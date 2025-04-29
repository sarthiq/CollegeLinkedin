const express = require("express");
const router = express.Router();
const projectsController = require("../../../Controller/User/Projects/projects");
const { fileHandlerRouter } = require("../../FileHandler/fileHandler");

router.post("/create", fileHandlerRouter(["image"], 20), projectsController.createProject);
router.post("/getAll", projectsController.getProjects);
router.post("/getById", projectsController.getProjectById);
router.post("/update", fileHandlerRouter(["image"], 20), projectsController.updateProject);
router.post("/delete", projectsController.deleteProject);

router.post("/addFeedback", projectsController.addProjectFeedback);
router.post("/getAllFeedback", projectsController.getProjectFeedback);
router.post("/sendCollaborationInvitation", projectsController.sendCollaborationInvitation);
router.post("/applyForCollaboration", projectsController.applyForCollaboration);
router.post("/updateCollaborationStatus", projectsController.updateCollaborationStatus);
router.post("/withdrawCollaboration", projectsController.withdrawCollaboration);
router.post("/handleCollaborationRequest", projectsController.handleCollaborationRequest);

module.exports = router;
