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

const router = express.Router();

router.post("/create", fileHandlerRouter(["image"], 20), createInternship);
router.post("/getAll", getInternships);
router.post("/getById", getInternshipById);
router.post("/update", fileHandlerRouter(["image"], 20), updateInternship);
router.post("/delete", deleteInternship);

router.post("/apply", fileHandlerRouter(["resume"], 10), applyToInternship);
router.post("/getApplied", getAppliedInternships);
router.post("/withdraw", withdrawFromInternship);
router.post("/updateUserStatus", updateUserInternshipStatus);

module.exports = router;
