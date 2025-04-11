const { userAuthentication } = require("../../Middleware/auth");
const express = require("express");

const authRoutes = require("./Auth/auth");
const profileRoutes = require("./Profile/profile");
const feedsRoutes = require("./Feeds/feeds");   
const likesRoutes = require("./Likes/likes");
const commentsRoutes = require("./Comments/comments");
const pagesRoutes = require("./Pages/pages");

const router = express.Router();



router.use("/auth", authRoutes);
router.use("/profile", userAuthentication, profileRoutes);
router.use("/feeds", userAuthentication, feedsRoutes);
router.use("/likes", userAuthentication, likesRoutes);
router.use("/comments", userAuthentication, commentsRoutes);
router.use("/pages", userAuthentication, pagesRoutes);


module.exports = router;
