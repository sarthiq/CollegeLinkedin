const { userAuthentication } = require("../../Middleware/auth");
const express = require("express");

const authRoutes = require("./Auth/auth");
const profileRoutes = require("./Profile/profile");
const feedsRoutes = require("./Feeds/feeds");   
const likesRoutes = require("./Likes/likes");
const commentsRoutes = require("./Comments/comments");
const pagesRoutes = require("./Pages/pages");
const internshipsRoutes = require("./Internships/internships");
const router = express.Router();



router.use("/auth", authRoutes);
router.use("/profile", userAuthentication, profileRoutes);
router.use("/feeds", userAuthentication, feedsRoutes);
router.use("/likes", userAuthentication, likesRoutes);
router.use("/comments", userAuthentication, commentsRoutes);
router.use("/pages", userAuthentication, pagesRoutes);
router.use("/internships", userAuthentication, internshipsRoutes);

module.exports = router;
