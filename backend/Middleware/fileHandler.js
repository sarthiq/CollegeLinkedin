const multer = require("multer");

exports.setFileSizeLimit = ({ fileSizeLimit = 0.5, fileNames = [] }) => {
  return (req, res, next) => {
    req.fileNames = fileNames;
    req.fileSizeLimit = fileSizeLimit * 1024 * 1024; // Convert MB to bytes
    next();
  };
};

exports.checkFileSize = (req, res, next) => {
  // Check if Content-Length header exists and is within the limit
  const contentLength = parseInt(req.headers["content-length"], 10);

  if (contentLength > req.fileSizeLimit) {
    return res.status(400).json({
      error: `File size exceeds the ${
        req.fileSizeLimit / (1024 * 1024)
      } MB limit. Current Size: ${contentLength / (1024 * 1024)} MB`,
    });
  }
  next();
};

exports.multipleFileHandler = (fileNames) => {
  const storage = multer.memoryStorage();
  
  return multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      // Check if the field name is in the allowed list
      if (fileNames.includes(file.fieldname)) {
        cb(null, true);
      } else {
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
      }
    }
  }).array('image', 10); // Allow up to 10 files with field name 'image'
};

exports.checkFileExist = (req, res, next) => {
  // Check if at least one file was uploaded
  if (req.files && req.files.length > 0) {
    return next();
  }
  // If no files are required, proceed
  return next();
};