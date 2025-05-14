const express = require("express");
const router = express.Router();
const personalityController = require("../../../Controller/Admin/Personality/personality");

router.post("/createQuestions", personalityController.createQuestions);
router.post("/deleteQuestion", personalityController.deleteQuestion);
router.post("/updateQuestion", personalityController.updateQuestion);
router.post("/getQuestions", personalityController.getQuestions);

module.exports = router;

