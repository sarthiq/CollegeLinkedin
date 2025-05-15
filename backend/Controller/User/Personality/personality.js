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

// Get personality result history with pagination
exports.getPersonalityResultHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.body;
    const offset = (page - 1) * limit;
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { count, rows: results } = await PersonalityResult.findAndCountAll({
      where: {
        UserId: req.user.id
      },
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return res.status(200).json({
      success: true,
      message: "Personality result history retrieved successfully",
      data: {
        totalResults: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        results
      },
    });
  } catch (error) {
    console.error("Error fetching personality result history:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get personality stats information
exports.getPersonalityStatsInfo = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userId = req.user.id;

    // Get all personality results for the user
    const results = await PersonalityResult.findAll({
      where: {
        UserId: userId
      },
      order: [["createdAt", "DESC"]]
    });

    if (!results.length) {
      return res.status(200).json({
        success: true,
        message: "No personality test results found for this user",
        data: {
          totalTests: 0,
          averageTraits: null,
          latestResult: null,
          personalityChanges: null
        }
      });
    }

    // Calculate statistics
    const totalTests = results.length;
    const latestResult = results[0];
    
    // Calculate average traits
    const averageTraits = {
      openness: results.reduce((sum, result) => sum + result.openness, 0) / totalTests,
      neuroticism: results.reduce((sum, result) => sum + result.neuroticism, 0) / totalTests,
      extraversion: results.reduce((sum, result) => sum + result.extraversion, 0) / totalTests,
      agreeableness: results.reduce((sum, result) => sum + result.agreeableness, 0) / totalTests,
      conscientiousness: results.reduce((sum, result) => sum + result.conscientiousness, 0) / totalTests
    };
    
    // Format the average traits to 2 decimal places
    Object.keys(averageTraits).forEach(trait => {
      averageTraits[trait] = parseFloat(averageTraits[trait].toFixed(2));
    });
    
    // Calculate personality changes (if more than one test)
    let personalityChanges = null;
    if (totalTests > 1) {
      // Compare latest with the previous test
      const previousResult = results[1];
      personalityChanges = {
        openness: parseFloat((latestResult.openness - previousResult.openness).toFixed(2)),
        neuroticism: parseFloat((latestResult.neuroticism - previousResult.neuroticism).toFixed(2)),
        extraversion: parseFloat((latestResult.extraversion - previousResult.extraversion).toFixed(2)),
        agreeableness: parseFloat((latestResult.agreeableness - previousResult.agreeableness).toFixed(2)),
        conscientiousness: parseFloat((latestResult.conscientiousness - previousResult.conscientiousness).toFixed(2))
      };
    }

    // Find dominant trait in latest result
    const traits = ["openness", "neuroticism", "extraversion", "agreeableness", "conscientiousness"];
    const dominantTrait = traits.reduce((a, b) => 
      latestResult[a] > latestResult[b] ? a : b
    );

    return res.status(200).json({
      success: true,
      message: "Personality statistics retrieved successfully",
      data: {
        totalTests,
        averageTraits,
        latestResult,
        personalityChanges,
        dominantTrait,
        allResults: results.map(result => ({
          id: result.id,
          date: result.createdAt,
          openness: result.openness,
          neuroticism: result.neuroticism,
          extraversion: result.extraversion,
          agreeableness: result.agreeableness,
          conscientiousness: result.conscientiousness
        }))
      }
    });
  } catch (error) {
    console.error("Error fetching personality statistics:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
