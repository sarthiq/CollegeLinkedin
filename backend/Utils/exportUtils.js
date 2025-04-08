const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const { driveUploader } = require("../importantInfo"); 


// Use the credentials directly
const CREDENTIALS = driveUploader

const SCOPES = ["https://www.googleapis.com/auth/drive"];
const TEMP_DIR = path.join(__dirname, "../temp");

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Initialize Google Drive API with credentials
const auth = new google.auth.GoogleAuth({
  credentials: CREDENTIALS,
  scopes: SCOPES,
});

// Helper function to wait for a specified time
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const createOrUpdateExcelFile = async (data, filePath, fileId = null) => {
  let workbook = null;
  try {
    let existingData = [];
    if (fileId) {
      try {
        // Download existing file if it exists
        const authClient = await auth.getClient();
        const drive = google.drive({ version: 'v3', auth: authClient });
        
        // Create a unique temporary file for download
        const tempDownloadPath = `${filePath}.download`;
        const dest = fs.createWriteStream(tempDownloadPath);
        
        const response = await drive.files.get(
          { fileId: fileId, alt: 'media' },
          { responseType: 'stream' }
        );
        
        await new Promise((resolve, reject) => {
          response.data
            .pipe(dest)
            .on('finish', resolve)
            .on('error', reject);
        });
        
        // Close the write stream
        dest.end();
        
        // Wait a moment to ensure file is fully written
        await sleep(100);
        
        // Read existing data
        workbook = xlsx.readFile(tempDownloadPath);
        existingData = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        
        // Delete the temporary download file
        safeDeleteFile(tempDownloadPath);
      } catch (downloadError) {
        console.error("Error downloading existing file:", downloadError);
        // Continue with empty existingData if download fails
      }
    }
    
    // Append new data or create new file
    const dataToWrite = fileId ? [...existingData, ...data] : data;
    
    // Create/Update Excel file
    workbook = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(dataToWrite);
    xlsx.utils.book_append_sheet(workbook, ws, "Data");
    xlsx.writeFile(workbook, filePath);
    
    // Wait a moment to ensure file is fully written
    await sleep(100);
  } catch (error) {
    console.error("Error creating/updating Excel file:", error);
    throw error;
  }
};

// Safe file deletion function with retries
const safeDeleteFile = async (filePath, maxRetries = 3) => {
  if (!filePath) return;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Successfully deleted file: ${filePath}`);
        return;
      }
    } catch (error) {
      console.error(`Error deleting file ${filePath} (attempt ${attempt + 1}/${maxRetries}):`, error);
      // Wait before retrying
      await sleep(500);
    }
  }
  
  console.warn(`Failed to delete file after ${maxRetries} attempts: ${filePath}`);
};

exports.uploadDataToGoogleDrive = async (data, fileName = 'testResult.xlsx') => {
  let filePath = null;
  let fileStream = null;
  
  try {
    // Create temporary file path with timestamp to avoid conflicts
    const timestamp = new Date().getTime();
    const uniqueFileName = `${path.parse(fileName).name}_${timestamp}${path.parse(fileName).ext}`;
    filePath = path.join(TEMP_DIR, uniqueFileName);
    
    const PUBLIC_FOLDER_ID = "1SbK5I2rFRtyMCMYHK7bxd1L-KLoRKTIb";

    // Check if file already exists in Google Drive - use exact name match
    const authClient = await auth.getClient();
    const drive = google.drive({ version: 'v3', auth: authClient });
    
    // Use a more precise query to find the exact file
    const existingFile = await drive.files.list({
      q: `name = '${fileName}' and '${PUBLIC_FOLDER_ID}' in parents and trashed = false`,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    console.log(`Searching for file: ${fileName}`);
    console.log(`Found ${existingFile.data.files.length} matching files`);

    const fileId = existingFile.data.files[0]?.id;
    
    if (fileId) {
      console.log(`Updating existing file with ID: ${fileId}`);
    } else {
      console.log(`Creating new file: ${fileName}`);
    }

    // Create or update Excel file
    await createOrUpdateExcelFile(data, filePath, fileId);

    if (fileId) {
      // Update existing file
      fileStream = fs.createReadStream(filePath);
      
      const media = {
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        body: fileStream
      };

      const response = await drive.files.update({
        fileId: fileId,
        media: media,
        fields: 'id, webViewLink'
      });

      // Close the file stream
      fileStream.destroy();
      fileStream = null;
      
      // Wait a moment before deleting the file
      await sleep(500);
      
      // Clean up temporary file
      await safeDeleteFile(filePath);

      const folderLink = `https://drive.google.com/drive/folders/${PUBLIC_FOLDER_ID}`;
      return {
        fileUrl: response.data.webViewLink,
        fileId: response.data.id,
        folderId: PUBLIC_FOLDER_ID,
        folderUrl: folderLink
      };
    } else {
      // Create new file
      fileStream = fs.createReadStream(filePath);
      
      const fileMetadata = {
        name: fileName,
        parents: [PUBLIC_FOLDER_ID]
      };

      const media = {
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        body: fileStream
      };

      const response = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, webViewLink'
      });

      // Close the file stream
      fileStream.destroy();
      fileStream = null;
      
      // Wait a moment before deleting the file
      await sleep(500);

      // Make the file accessible
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',  // Makes it accessible via link
        }
      });

      // Clean up temporary file
      await safeDeleteFile(filePath);

      // Get shareable links
      const folderLink = `https://drive.google.com/drive/folders/${PUBLIC_FOLDER_ID}`;
      
      return {
        fileUrl: response.data.webViewLink,
        fileId: response.data.id,
        folderId: PUBLIC_FOLDER_ID,
        folderUrl: folderLink
      };
    }

  } catch (error) {
    console.error("Error in uploadDataToGoogleDrive:", error);
    // Clean up temporary file in case of error
    if (fileStream) {
      fileStream.destroy();
    }
    if (filePath) {
      await safeDeleteFile(filePath);
    }
    throw error;
  }
};




// exports.exportDataToGoogleDrive = async () => {


  
//   // Format the data for Excel
//   const formattedData = results.map((result) => {
//     const user = result.userDetails || {};

//     return {
//       Date: new Date(result.createdAt).toLocaleDateString(),
//       Time: new Date(result.createdAt).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
//       Name: user.name || "Anonymous",
//       Email: user.email || "N/A",
//       "Quiz Type": result.type || "N/A",
//       result: result.type === 'personality' ? 
//         `{"openness":${result.result?.openness || 0},"neuroticism":${result.result?.neuroticism || 0},"extraversion":${result.result?.extraversion || 0},"agreeableness":${result.result?.agreeableness || 0},"conscientiousness":${result.result?.conscientiousness || 0}}` :
//         result.result?.label || "N/A",
//     };
//   });

//   // Generate filename with timestamp
//   const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
//   const fileName = `quiz_results_${timestamp}.xlsx`;

//   // Call the Google Drive upload utility
//   const fileUrl = await exports.uploadResultsToGoogleDrive(formattedData);
// }