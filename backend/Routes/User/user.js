
const express = require("express");
const router = express.Router();
const authRoutes = require("./Auth/auth");
const profileRoutes = require("./Profile/profile");

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);

module.exports = router;
