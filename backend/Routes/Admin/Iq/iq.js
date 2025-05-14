const express = require("express");
const router = express.Router();
const iqController = require("../../../Controller/Admin/Iq/iq");

router.post("/createQuestion", iqController.createQuestion);
router.post("/deleteQuestion", iqController.deleteQuestion);
router.post("/updateQuestion", iqController.updateQuestion);
router.post("/getQuestions", iqController.getQuestions);
router.post("/getQuestionById", iqController.getQuestionById);
router.post("/createAnswer", iqController.createAnswer);
router.post("/updateAnswer", iqController.updateAnswer);
router.post("/deleteAnswer", iqController.deleteAnswer);
router.post("/updateCorrectAnswer", iqController.updateCorrectAnswer);
module.exports = router;

