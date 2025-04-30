const express = require("express");
const router = express.Router();
const profileController = require("../../../Controller/User/Profile/profile");
const { fileHandlerRouter } = require("../../FileHandler/fileHandler");
const achievmentsRouter = require("./achievments");
const educationRouter = require("./education");
const experienceRouter = require("./experience");
const interestsRouter = require("./interests");
const skillsRouter = require("./skills");
const { userAuthentication, unauthorizedUserAuthentication } = require("../../../Middleware/auth");


router.post("/get", unauthorizedUserAuthentication, profileController.getProfile);
router.post("/update",userAuthentication, fileHandlerRouter(["image", "coverImage"], 15), profileController.updateProfile);


router.use("/achievments",userAuthentication, achievmentsRouter);
router.use("/education",userAuthentication, educationRouter);
router.use("/experience",userAuthentication, experienceRouter);
router.use("/interests",userAuthentication, interestsRouter);
router.use("/skills",userAuthentication, skillsRouter);

module.exports = router;
