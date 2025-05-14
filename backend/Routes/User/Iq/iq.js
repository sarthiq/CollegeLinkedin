
const router = require("express").Router();
const iqController = require("../../../Controller/User/Iq/iq");

router.get("/getAllQuestions", iqController.getAllQuestions);
router.get("/getQuestionById", iqController.getQuestionById);
router.post("/submitIqTest", iqController.submitIqTest);

module.exports = router;
