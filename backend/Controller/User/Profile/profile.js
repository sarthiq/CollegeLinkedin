const { sequelize, baseDir } = require("../../../importantInfo");
const User = require("../../../Models/User/users");
const UserProfile = require("../../../Models/User/userProfile");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { saveFile } = require("../../../Utils/fileHandler");


exports.getProfile = async (req, res) => {
  try {
    // Get userId from either req.body or req.user.id
    const userId = req.body.userId || req.user.id;
    
    const userProfile = await UserProfile.findOne({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ["name", "email", "phone"]
        }
      ]
    });
    
    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: userProfile
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  
  // Extract all possible fields from request body
  const { 
    name, 
    collegeName, 
    collegeYear, 
    courseName,
    title, 
    bio 
  } = req.body;
  
  // Get the uploaded files
  const imageFile = req.files && req.files.image ? req.files.image[0] : null;
  const coverImageFile = req.files && req.files.coverImage ? req.files.coverImage[0] : null;
  
  // Validation for fields if they are provided
  if (name && (typeof name !== "string" || name.length < 2 || name.length > 100)) {
    return res.status(400).json({
      success: false,
      message: "Name must be a string between 2 and 100 characters."
    });
  }
  
  if (collegeName && (typeof collegeName !== "string" || collegeName.length < 2 || collegeName.length > 100)) {
    return res.status(400).json({
      success: false,
      message: "College name must be a string between 2 and 100 characters."
    });
  }
  
  if (collegeYear && (typeof collegeYear !== "string" || collegeYear.length < 4 || collegeYear.length > 10)) {
    return res.status(400).json({
      success: false,
      message: "College year must be a valid string."
    });
  }
  
  if (courseName && (typeof courseName !== "string" || courseName.length < 2 || courseName.length > 100)) {
    return res.status(400).json({
      success: false,
      message: "Course name must be a string between 2 and 100 characters."
    });
  }
  
  if (title && (typeof title !== "string" || title.length > 200)) {
    return res.status(400).json({
      success: false,
      message: "Title must be a string with maximum 200 characters."
    });
  }
  
  if (bio && (typeof bio !== "string" || bio.length > 1000)) {
    return res.status(400).json({
      success: false,
      message: "Bio must be a string with maximum 1000 characters."
    });
  }
  
  
  
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const commonPath = 'CustomFiles';
    const pathProfile = 'ProfileImages';
    
    // Handle the profile image file if provided
    let profileUrl = null;
    if (imageFile) {
      const filePath = path.join( commonPath, pathProfile);
      const fileName = uuidv4();
      profileUrl = saveFile(imageFile, filePath, fileName);
      //profileUrl = path.join(commonPath, pathProfile, profileUrl);
    }
    
    // Handle the cover image file if provided
    let coverUrl = null;
    if (coverImageFile) {
      const filePath = path.join( commonPath, pathProfile);
      const fileName = uuidv4();
      coverUrl = saveFile(coverImageFile, filePath, fileName);
      //coverUrl = path.join(commonPath, pathProfile, coverUrl);
    }
    
    // Update user name if provided
    if (name) {
      await User.update(
        { name },
        { where: { id: userId }, transaction }
      );
    }
    
    // Check if profile exists
    let userProfile = await UserProfile.findOne({
      where: { userId },
      transaction
    });
    
    
    userProfile.update({
      collegeName: collegeName || userProfile.collegeName,
      collegeYear: collegeYear || userProfile.collegeYear,
      courseName: courseName || userProfile.courseName,
      title: title || userProfile.title,
      bio: bio || userProfile.bio,
      profileUrl: profileUrl || userProfile.profileUrl,
      coverUrl: coverUrl || userProfile.coverUrl,
    })
    
    // Commit the transaction
    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: userProfile
    });
  } catch (error) {
    // Rollback transaction in case of error
    if (transaction) await transaction.rollback();
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message
    });
  }
};
