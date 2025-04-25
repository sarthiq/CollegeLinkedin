const express = require("express");
const {
  setFileSizeLimit,
  checkFileSize,
  multipleFileHandler,
  checkFileExist,
} = require("../../Middleware/fileHandler");
  

exports.fileHandlerRouter = (fileNames, fileSize,isArray=false) => {
  const router = express.Router();

  router.use(
    (req, res, next) => {
      
      if (isArray) {
        const names = JSON.parse(req.body.fileNames);
        req.fileNames = names;
      } else {
        req.fileNames = [fileNames];
      }
      next();
    },
    setFileSizeLimit({ fileSizeLimit: fileSize, fileNames: fileNames }),
    checkFileSize,
    multipleFileHandler(fileNames),
    checkFileExist
  );

  return router;
};
