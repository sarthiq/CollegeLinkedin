const IqAnswer = require("../../../Models/Iq/iqAnswers");
const IqQuestion = require("../../../Models/Iq/iqQuestions");
const IqResult = require("../../../Models/Iq/iqResult");
const { calculateIQ } = require("./iqUtils");
const { sequelize } = require("../../../importantInfo");

// Get all IQ questions with answers
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await IqQuestion.findAll({
      where: {
        isActive: true,
      },
      include: [
        {
          model: IqAnswer,
          attributes: ["id", "text", "imageUrl", "type"],
          where: {
            isActive: true
          },
          required: false
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: "IQ questions retrieved successfully",
      data: questions,
    });
  } catch (error) {
    console.error("Error fetching IQ questions:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get a specific question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;

    if (!questionId) {
      return res.status(400).json({
        success: false,
        message: "Question ID is required",
      });
    }

    const question = await IqQuestion.findOne({
      where: {
        id: questionId,
        isActive: true,
      },
      include: [
        {
          model: IqAnswer,
          attributes: ["id", "text", "imageUrl", "type"],
          where: {
            isActive: true
          },
          required: false
        },
      ],
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Question retrieved successfully",
      data: question,
    });
  } catch (error) {
    console.error("Error fetching question:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Submit IQ test results
exports.submitIqTest = async (req, res) => {
  let transaction;
  try {
    const { answers, timeDuration } = req.body;
    const { startTime, endTime } = timeDuration;

    if (!answers || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data. Answers and time data are required.",
      });
    }

    // Calculate time taken in minutes and seconds
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const timeTakenMs = endDate - startDate;
    const timeTakenMinutes = timeTakenMs / (1000 * 60);
    const timeTakenSeconds = Math.round(timeTakenMs / 1000);

    // Get all questions to evaluate answers
    const questions = await IqQuestion.findAll({
      where: { isActive: true },
    });

    if (!questions.length) {
      return res.status(404).json({
        success: false,
        message: "No active IQ questions found",
      });
    }

    // Calculate test results
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let attemptedQuestions = 0;
    let totalWeight = 0;
    let score = 0;

    for (const question of questions) {
      totalWeight += question.weight;
      const submittedAnswerId = answers[question.id];

      if (submittedAnswerId !== undefined) {
        attemptedQuestions++;
        
        if (parseInt(submittedAnswerId) === question.correctAnswerId) {
          correctAnswers++;
          score += question.weight;
        } else {
          wrongAnswers++;
        }
      }
    }

    // Calculate IQ level using the utility function
    const iqResult = calculateIQ(correctAnswers, timeTakenMinutes);
    
    // Begin transaction for database operations
    transaction = await sequelize.transaction();

    // Create IQ result record
    const result = await IqResult.create({
      score,
      noOfQuestionAttempted: attemptedQuestions,
      noOfWrongAnswers: wrongAnswers,
      noOfCorrectAnswers: correctAnswers,
      label: iqResult.label,
      startTime: startDate,
      endTime: endDate,
      timeTaken: timeTakenSeconds,
      UserId: req.user ? req.user.id : null,
    }, { transaction });

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "IQ test submitted successfully",
      data: {
        totalQuestions: questions.length,
        attemptedQuestions,
        correctAnswers,
        wrongAnswers,
        score,
        percentage: totalWeight > 0 ? ((score / totalWeight) * 100).toFixed(2) : 0,
        iqLevel: iqResult.label,
        estimated_iq_range: iqResult.estimated_iq_range,
        percentile: iqResult.percentile,
        description: iqResult.description,
        resultId: result.id
      },
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error submitting IQ test:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


