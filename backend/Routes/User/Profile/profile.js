const express = require("express");
const router = express.Router();
const profileController = require("../../../Controller/User/Profile/profile");
const { fileHandlerRouter } = require("../../FileHandler/fileHandler");
const achievmentsRouter = require("./achievments");
const educationRouter = require("./education");
const experienceRouter = require("./experience");
const interestsRouter = require("./interests");
const skillsRouter = require("./skills");

router.post("/get", profileController.getProfile);
router.post("/update",fileHandlerRouter(["image", "coverImage"], 15), profileController.updateProfile);


router.use("/achievments", achievmentsRouter);
router.use("/education", educationRouter);
router.use("/experience", experienceRouter);
router.use("/interests", interestsRouter);
router.use("/skills", skillsRouter);

module.exports = router;
