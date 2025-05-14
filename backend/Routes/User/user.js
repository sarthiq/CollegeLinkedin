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
const searchRoutes = require("./Search/search");
const followsRoutes = require("./Follows/follows");
const messagesRoutes = require("./Messages/messages");
const iqRoutes = require("./Iq/iq");
const personalityRoutes = require("./Personality/personality");


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/profile",  profileRoutes);
router.use("/feeds",  feedsRoutes);
router.use("/likes", userAuthentication, likesRoutes);
router.use("/comments", commentsRoutes);
router.use("/pages", pagesRoutes);
router.use("/internships", internshipsRoutes);
router.use("/projects", projectsRoutes);
router.use("/search", searchRoutes);
router.use("/follows", userAuthentication, followsRoutes);
router.use("/messages", userAuthentication, messagesRoutes);
router.use("/iq",userAuthentication, iqRoutes);
router.use("/personality",userAuthentication, personalityRoutes);

module.exports = router;
