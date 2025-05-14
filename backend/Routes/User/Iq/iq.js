
const router = require("express").Router();
const iqController = require("../../../Controller/User/Iq/iq");

router.post("/getAllQuestions", iqController.getAllQuestions);
router.post("/getQuestionById", iqController.getQuestionById);
router.post("/submitIqTest", iqController.submitIqTest);

module.exports = router;
