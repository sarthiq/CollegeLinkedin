const express = require("express");
const router = express.Router();
const profileController = require("../../../Controller/User/Profile/profile");

router.get("/profile", profileController.getProfile);
router.post("/profile", profileController.updateProfile);

module.exports = router;
