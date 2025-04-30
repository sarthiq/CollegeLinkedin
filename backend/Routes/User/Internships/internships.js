const express = require("express");

const {
  createInternship,
  getInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
  applyToInternship,
  getAppliedInternships,
  withdrawFromInternship,
  updateUserInternshipStatus,
} = require("../../../Controller/User/Internships/internships");
const { fileHandlerRouter } = require("../../FileHandler/fileHandler");
const { userAuthentication } = require("../../../Middleware/auth");

const router = express.Router();

router.post("/create",userAuthentication, fileHandlerRouter(["image"], 20), createInternship);
router.post("/getAll",userAuthentication, getInternships);
router.post("/getById", getInternshipById);
router.post("/update",userAuthentication, fileHandlerRouter(["image"], 20), updateInternship);
router.post("/delete",userAuthentication, deleteInternship);

router.post("/apply",userAuthentication, fileHandlerRouter(["resume"], 10), applyToInternship);
router.post("/getApplied",userAuthentication, getAppliedInternships);
router.post("/withdraw",userAuthentication, withdrawFromInternship);
router.post("/updateUserStatus",userAuthentication, updateUserInternshipStatus);

module.exports = router;
