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
  const fields = fileNames.map(name => ({ name, maxCount: 1 }));
  const storage = multer.memoryStorage();

  return multer({
    storage: storage,
  }).fields(fields);
};

exports.checkFileExist = (req, res, next) => {
  return next();
  // Check if at least one file was uploaded
  if (req.files && Object.keys(req.files).length > 0) {
    return next();
  }
  //res.status(404).json({ error: "No files uploaded!" });
};