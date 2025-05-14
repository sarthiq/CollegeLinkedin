const PersonalityQuestion = require("../../../Models/Personality/personalityQuestion");
const { sequelize, baseDir } = require("../../../importantInfo");
const path = require("path");

// Create multiple personality questions in a single API call
exports.createQuestions = async (req, res) => {
  let transaction;
  try {
    const questions = req.body;

    if (!Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: "Request body should be an array of questions",
      });
    }

    transaction = await sequelize.transaction();
    const createdQuestions = [];

    for (const question of questions) {
      const { text, isActive } = question;

      // Validate each question
      if (!text) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Each question must have text content",
        });
      }

      // Create question
      const newQuestion = await PersonalityQuestion.create({
        text,
        isActive: isActive !== undefined ? isActive : true,
      }, { transaction });

      createdQuestions.push(newQuestion);
    }

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "Personality questions created successfully",
      data: createdQuestions,
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error creating personality questions:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete a personality question
exports.deleteQuestion = async (req, res) => {
  let transaction;
  try {
    const { questionId } = req.body;

    // Check if question exists
    const question = await PersonalityQuestion.findByPk(questionId);
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Personality question not found" });
    }

    transaction = await sequelize.transaction();
    
    // Delete the question
    await question.destroy({ transaction });

    // Commit transaction
    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Personality question deleted successfully",
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error deleting personality question:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Update a personality question
exports.updateQuestion = async (req, res) => {
  let transaction;
  try {
    const { questionId, text, isActive } = req.body;

    // Find question
    const question = await PersonalityQuestion.findByPk(questionId);
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Personality question not found" });
    }

    transaction = await sequelize.transaction();
    
    // Update question
    await question.update({
      text: text !== undefined ? text : question.text,
      isActive: isActive !== undefined ? isActive : question.isActive,
    }, { transaction });

    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: "Personality question updated successfully",
      data: question,
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error updating personality question:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Get all personality questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = await PersonalityQuestion.findAll({
      order: [["createdAt", "DESC"]],
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

// Delete all personality questions
exports.deleteAllQuestions = async (req, res) => {
  let transaction;
  try {
    // First check if there are any questions to delete
    const count = await PersonalityQuestion.count();
    
    if (count === 0) {
      return res.status(200).json({
        success: true,
        message: "No personality questions found to delete",
      });
    }

    // Begin transaction for database operations
    transaction = await sequelize.transaction();

    // Delete all questions
    await PersonalityQuestion.destroy({
      where: {},  // Empty where clause to delete all records
      transaction
    });

    // Commit transaction
    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: `Successfully deleted all personality questions (${count} questions)`,
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error deleting all personality questions:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

