const express = require("express");
const router = express.Router();
const projectsController = require("../../../Controller/User/Projects/projects");
const { fileHandlerRouter } = require("../../FileHandler/fileHandler");
const { userAuthentication, unauthorizedUserAuthentication } = require("../../../Middleware/auth");

router.post("/create",userAuthentication, fileHandlerRouter(["image"], 20), projectsController.createProject);
router.post("/getAll",userAuthentication, projectsController.getProjects);
router.post("/getById",unauthorizedUserAuthentication, projectsController.getProjectById);
router.post("/update",userAuthentication, fileHandlerRouter(["image"], 20), projectsController.updateProject);
router.post("/delete",userAuthentication, projectsController.deleteProject);

router.post("/addFeedback",userAuthentication, projectsController.addProjectFeedback);
router.post("/getAllFeedback",userAuthentication, projectsController.getProjectFeedback);
router.post("/sendCollaborationInvitation",userAuthentication, projectsController.sendCollaborationInvitation);
router.post("/applyForCollaboration",userAuthentication, projectsController.applyForCollaboration);
router.post("/updateCollaborationStatus",userAuthentication, projectsController.updateCollaborationStatus);
router.post("/withdrawCollaboration",userAuthentication, projectsController.withdrawCollaboration);
router.post("/handleCollaborationRequest",userAuthentication, projectsController.handleCollaborationRequest);

module.exports = router;
