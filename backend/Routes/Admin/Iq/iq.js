const express = require("express");
const router = express.Router();
const iqController = require("../../../Controller/Admin/Iq/iq");
const { fileHandlerRouter } = require("../../FileHandler/fileHandler");


router.post("/createQuestion",fileHandlerRouter(["image"], 15), iqController.createQuestion);
router.post("/deleteQuestion", iqController.deleteQuestion);
router.post("/updateQuestion",fileHandlerRouter(["image"], 15), iqController.updateQuestion);
router.post("/getQuestions", iqController.getQuestions);
router.post("/getQuestionById", iqController.getQuestionById);
router.post("/createAnswer",fileHandlerRouter(["image"], 15), iqController.createAnswer);
router.post("/updateAnswer",fileHandlerRouter(["image"], 15), iqController.updateAnswer);
router.post("/deleteAnswer", iqController.deleteAnswer);
router.post("/updateCorrectAnswer", iqController.updateCorrectAnswer);
router.post("/deleteAllQuestions", iqController.deleteAllQuestions);

module.exports = router;

