const { userAuthentication } = require("../../Middleware/auth");
const express = require("express");

const authRoutes = require("./Auth/auth");
const profileRoutes = require("./Profile/profile");
const feedsRoutes = require("./Feeds/feeds");
const likesRoutes = require("./Likes/likes");
const commentsRoutes = require("./Comments/comments");
const pagesRoutes = require("./Pages/pages");
const internshipsRoutes = require("./Internships/internships");
const projectsRoutes = require("./Projects/projects");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/profile",  profileRoutes);
router.use("/feeds",  feedsRoutes);
router.use("/likes", userAuthentication, likesRoutes);
router.use("/comments", commentsRoutes);
router.use("/pages", pagesRoutes);
router.use("/internships", internshipsRoutes);
router.use("/projects", projectsRoutes);

module.exports = router;
