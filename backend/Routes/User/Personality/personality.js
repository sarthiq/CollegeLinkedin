
const router = require("express").Router();
const personalityController = require("../../../Controller/User/Personality/personality");

router.get("/getAllQuestions", personalityController.getAllQuestions);
router.post("/submitPersonalityTest", personalityController.submitPersonalityTest);

module.exports = router;
