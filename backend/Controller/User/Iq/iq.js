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

    // Calculate percentage
    const percentage = questions.length > 0 ? (correctAnswers / questions.length) * 100 : 0;

    // Create IQ result record
    const result = await IqResult.create({
      percentile: iqResult.percentile,
      estimatedIQRange: iqResult.estimated_iq_range,
      description: iqResult.description,
      noOfQuestionAttempted: attemptedQuestions,
      noOfWrongAnswers: wrongAnswers,
      noOfCorrectAnswers: correctAnswers,
      percentage: parseFloat(percentage.toFixed(2)),
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
        percentage: percentage.toFixed(2),
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

// Get IQ result history with pagination
exports.getIqResultHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.body;
    const offset = (page - 1) * limit;
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { count, rows: results } = await IqResult.findAndCountAll({
      where: {
        UserId: req.user.id
      },
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return res.status(200).json({
      success: true,
      message: "IQ result history retrieved successfully",
      data: {
        totalResults: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        results
      },
    });
  } catch (error) {
    console.error("Error fetching IQ result history:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getIqStatsInfo = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userId = req.user.id;

    // Get all IQ results for the user
    const results = await IqResult.findAll({
      where: {
        UserId: userId
      },
      order: [["createdAt", "DESC"]]
    });

    if (!results.length) {
      return res.status(200).json({
        success: true,
        message: "No IQ test results found for this user",
        data: {
          totalTests: 0,
          averageIQ: null,
          bestScore: null,
          latestResult: null,
          improvement: null
        }
      });
    }

    // Calculate statistics
    const totalTests = results.length;
    const latestResult = results[0];
    
    // Calculate average percentage
    const averagePercentage = results.reduce((sum, result) => sum + result.percentage, 0) / totalTests;
    
    // Find best score
    const bestScore = Math.max(...results.map(result => result.percentage));
    
    // Calculate improvement (if more than one test)
    let improvement = null;
    if (totalTests > 1) {
      // Compare latest with the previous test
      const previousResult = results[1];
      improvement = latestResult.percentage - previousResult.percentage;
    }

    return res.status(200).json({
      success: true,
      message: "IQ statistics retrieved successfully",
      data: {
        totalTests,
        averagePercentage: parseFloat(averagePercentage.toFixed(2)),
        bestScore,
        latestResult,
        improvement: improvement !== null ? parseFloat(improvement.toFixed(2)) : null,
        allResults: results.map(result => ({
          id: result.id,
          date: result.createdAt,
          percentage: result.percentage,
          label: result.label,
          estimatedIQRange: result.estimatedIQRange
        }))
      }
    });
  } catch (error) {
    console.error("Error fetching IQ statistics:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
