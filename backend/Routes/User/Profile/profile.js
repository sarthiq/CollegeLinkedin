const express = require("express");
const router = express.Router();
const profileController = require("../../../Controller/User/Profile/profile");
const { fileHandlerRouter } = require("../../FileHandler/fileHandler");

router.get("/get", profileController.getProfile);
router.post("/update",fileHandlerRouter(["image", "coverImage"], 5), profileController.updateProfile);

module.exports = router;
