
const router = require("express").Router();
const personalityController = require("../../../Controller/User/Personality/personality");

router.post("/getAllQuestions", personalityController.getAllQuestions);
router.post("/submitPersonalityTest", personalityController.submitPersonalityTest);
router.post("/getPersonalityStatsInfo", personalityController.getPersonalityStatsInfo); 
router.post("/getPersonalityResultHistory", personalityController.getPersonalityResultHistory);


module.exports = router;
