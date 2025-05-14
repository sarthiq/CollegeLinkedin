const PersonalityQuestion = require("../../../Models/Personality/personalityQuestion");
const PersonalityResult = require("../../../Models/Personality/personalityResult");
const { calculatePersonalityResults } = require("./personalityUtils");
const { sequelize } = require("../../../importantInfo");

// Get all personality questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await PersonalityQuestion.findAll({
      where: {
        isActive: true,
      },
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Personality questions retrieved successfully",
      data: questions,
    });
  } catch (error) {
    console.error("Error fetching personality questions:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Submit personality test results
exports.submitPersonalityTest = async (req, res) => {
  let transaction;
  try {
    const { answers, timeDuration } = req.body;
    const { startTime, endTime } = timeDuration;

    // Validate answers array
    if (!Array.isArray(answers) || answers.length !== 50) {
      return res.status(400).json({
        success: false,
        message: "Invalid input: Personality test requires exactly 50 answers",
      });
    }

    // Validate each answer is within the valid range (1-5)
    const isValidAnswer = answers.every(
      (answer) => Number.isInteger(answer) && answer >= 1 && answer <= 5
    );

    if (!isValidAnswer) {
      return res.status(400).json({
        success: false,
        message: "Invalid answers: Each answer must be between 1 and 5",
      });
    }

    // Validate time data
    if (!startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Start time and end time are required",
      });
    }

    // Calculate time taken
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const timeTakenMs = endDate - startDate;
    const timeTakenSeconds = Math.round(timeTakenMs / 1000);

    // Calculate personality results
    const personalityResults = calculatePersonalityResults(answers);
    
    // Begin transaction for database operations
    transaction = await sequelize.transaction();

    // Create personality result record
    const result = await PersonalityResult.create({
      openness: personalityResults.openness,
      neuroticism: personalityResults.neuroticism,
      extraversion: personalityResults.extraversion,
      agreeableness: personalityResults.agreeableness,
      conscientiousness: personalityResults.conscientiousness,
      startTime: startDate,
      endTime: endDate,
      timeTaken: timeTakenSeconds,
      UserId: req.user ? req.user.id : null,
    }, { transaction });

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Personality test submitted successfully",
      data: {
        ...personalityResults,
        resultId: result.id
      },
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error submitting personality test:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
