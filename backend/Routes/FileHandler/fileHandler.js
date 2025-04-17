const express = require("express");
const {
  setFileSizeLimit,
  checkFileSize,
  multipleFileHandler,
  checkFileExist,
} = require("../../Middleware/fileHandler");

exports.fileHandlerRouter = (fileNames, fileSize) => {
  const router = express.Router();

  router.use(
    setFileSizeLimit({ fileSizeLimit: fileSize, fileNames: fileNames }),
    checkFileSize,
    multipleFileHandler(fileNames),
    checkFileExist
  );

  return router;
};
