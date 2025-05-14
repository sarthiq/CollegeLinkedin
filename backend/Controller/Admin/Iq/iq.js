const { sequelize, baseDir } = require("../../../importantInfo");
const IqAnswer = require("../../../Models/Iq/iqAnswers");
const IqQuestion = require("../../../Models/Iq/iqQuestions");
const { saveFile, safeDeleteFile } = require("../../../Utils/fileHandler");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Create a new IQ question
exports.createQuestion = async (req, res) => {
  try {
    const { text, type, weight } = req.body;
    const imageFile = req.files && req.files.image ? req.files.image[0] : null;
    
    // Validate input
    if (!text && !imageFile) {
      return res.status(400).json({
        success: false,
        message: "Question text or image is required",
      });
    }

    let imageUrl = "";
    if (imageFile) {
      const filePath = path.join("CustomFiles", "IqQuestion");
      const fileName = uuidv4();
      imageUrl = saveFile(imageFile, filePath, fileName);
    }

    // Create question
    const newQuestion = await IqQuestion.create({
      text,
      imageUrl,
      type: type || "text", // Default to text type
      weight: weight || 1.0,
    });

    return res.status(201).json({
      success: true,
      message: "IQ question created successfully",
      data: newQuestion,
    });
  } catch (error) {
    console.error("Error creating IQ question:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete an IQ question
exports.deleteQuestion = async (req, res) => {
  let transaction;
  try {
    const { questionId } = req.body;

    // Check if question exists
    const question = await IqQuestion.findByPk(questionId);
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "IQ question not found" });
    }

    // Delete the question's image if it exists
    if (question.imageUrl) {
      const imagePath = path.join(
        baseDir,
        question.imageUrl.replace("files/", "")
      );
      await safeDeleteFile(imagePath);
    }

    // Find all associated answers to delete their images first
    const answers = await IqAnswer.findAll({
      where: { id: question.correctAnswerId }
    });

    // Delete all answer images
    for (const answer of answers) {
      if (answer.imageUrl) {
        const imagePath = path.join(
          baseDir,
          answer.imageUrl.replace("files/", "")
        );
        await safeDeleteFile(imagePath);
      }
    }

    transaction = await sequelize.transaction();
    
    // Delete associated answers first
    await IqAnswer.destroy({ 
      where: { id: question.correctAnswerId }, 
      transaction 
    });

    // Delete the question
    await question.destroy({ transaction });

    // Commit transaction
    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "IQ question and associated answers deleted successfully",
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error deleting IQ question:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Update an IQ question
exports.updateQuestion = async (req, res) => {
  let transaction;

  try {
    const { questionId, text, type, weight, isActive } = req.body;
    const imageFile = req.files && req.files.image ? req.files.image[0] : null;

    // Find question
    const question = await IqQuestion.findByPk(questionId);
    if (!question) {
      if (transaction) {
        await transaction.rollback();
      }
      return res
        .status(404)
        .json({ success: false, message: "IQ question not found" });
    }

    let imageUrl = question.imageUrl;
    if (imageFile) {
      // Delete old image if exists
      if (question.imageUrl) {
        const oldImagePath = path.join(
          baseDir,
          question.imageUrl.replace("files/", "")
        );
        await safeDeleteFile(oldImagePath);
      }

      const filePath = path.join("CustomFiles", "IqQuestion");
      const fileName = uuidv4();
      imageUrl = saveFile(imageFile, filePath, fileName);
    }

    transaction = await sequelize.transaction();
    // Update question
    await question.update({
      text: text !== undefined ? text : question.text,
      type: type !== undefined ? type : question.type,
      weight: weight !== undefined ? weight : question.weight,
      imageUrl,
      isActive: isActive !== undefined ? isActive : question.isActive,
    }, { transaction });

    await transaction.commit();
    return res.status(200).json({
      success: true,
      message: "IQ question updated successfully",
      data: question,
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error updating IQ question:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Get all IQ questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = await IqQuestion.findAll({
      order: [["createdAt", "DESC"]],
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

// Get a specific IQ question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const { questionId } = req.body;

    // Check if questionId is provided
    if (!questionId) {
      return res.status(400).json({
        success: false,
        message: "Question ID is required",
      });
    }

    // Find the question by its primary key
    const question = await IqQuestion.findByPk(questionId);

    // Check if the question exists
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "IQ question not found",
      });
    }

    // Get associated answer if any
    let answer = null;
    if (question.correctAnswerId) {
      answer = await IqAnswer.findByPk(question.correctAnswerId);
    }
    const answers = await IqAnswer.findAll({
      where: { IqQuestionId: question.id }
    });

    // Return the question and its correct answer, if available
    return res.status(200).json({
      success: true,
      message: "IQ question retrieved successfully",
      data: {
        question,
        correctAnswer: answer,
        answers: answers,
      },
    });
  } catch (error) {
    console.error("Error fetching IQ question:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Create an answer for an IQ question
exports.createAnswer = async (req, res) => {
  try {
    const { text, type, questionId } = req.body;
    const imageFile = req.files && req.files.image ? req.files.image[0] : null;

    // Validate input
    if (!text && !imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Answer text or image is required" });
    }

    // Check if the question exists
    const question = await IqQuestion.findByPk(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "IQ question not found",
      });
    }

    let imageUrl = "";
    if (imageFile) {
      const filePath = path.join("CustomFiles", "IqAnswer");
      const fileName = uuidv4();
      imageUrl = saveFile(imageFile, filePath, fileName);
    }

    // Create answer
    const newAnswer = await IqAnswer.create({
      text,
      imageUrl,
      type: type || "text", // Default to text-based answers
      IqQuestionId: questionId,
    });

    return res.status(201).json({
      success: true,
      message: "Answer created successfully",
      data: newAnswer,
    });
  } catch (error) {
    console.error("Error creating answer:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update an answer
exports.updateAnswer = async (req, res) => {
  let transaction;
  try {
    const { answerId, text, type, isActive } = req.body;
    const imageFile = req.files && req.files.image ? req.files.image[0] : null;

    // Find answer
    const answer = await IqAnswer.findByPk(answerId);
    if (!answer) {
      if (transaction) {
        await transaction.rollback();
      }
      return res
        .status(404)
        .json({ success: false, message: "Answer not found" });
    }

    let imageUrl = answer.imageUrl;
    if (imageFile) {
      // Delete old image if exists
      if (answer.imageUrl) {
        const oldImagePath = path.join(
          baseDir,
          answer.imageUrl.replace("files/", "")
        );
        await safeDeleteFile(oldImagePath);
      }

      const filePath = path.join("CustomFiles", "IqAnswer");
      const fileName = uuidv4();
      imageUrl = saveFile(imageFile, filePath, fileName);
    }

    transaction = await sequelize.transaction();
    // Update answer
    await answer.update({
      text: text !== undefined ? text : answer.text,
      type: type !== undefined ? type : answer.type,
      imageUrl,
      isActive: isActive !== undefined ? isActive : answer.isActive,
    }, { transaction });

    await transaction.commit();
    return res.status(200).json({
      success: true,
      message: "Answer updated successfully",
      data: answer,
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error updating answer:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Delete an answer
exports.deleteAnswer = async (req, res) => {
  let transaction;
  try {
    const { answerId } = req.body;

    // Check if answer exists
    const answer = await IqAnswer.findByPk(answerId);
    if (!answer) {
      return res
        .status(404)
        .json({ success: false, message: "Answer not found" });
    }

    // Delete the answer's image if it exists
    if (answer.imageUrl) {
      const imagePath = path.join(
        baseDir,
        answer.imageUrl.replace("files/", "")
      );
      await safeDeleteFile(imagePath);
    }

    transaction = await sequelize.transaction();
    
    // Delete the answer
    await answer.destroy({ transaction });

    // Commit transaction
    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Answer deleted successfully",
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error deleting answer:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Update the correct answer for a question
exports.updateCorrectAnswer = async (req, res) => {
  try {
    const { questionId, answerId } = req.body;

    // Validate input
    if (!questionId || !answerId) {
      return res.status(400).json({
        success: false,
        message: "Both questionId and answerId are required.",
      });
    }

    // Check if the question exists
    const question = await IqQuestion.findByPk(questionId);
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "IQ question not found." });
    }

    // Check if the answer exists
    const answer = await IqAnswer.findOne({ where: { id: answerId, IqQuestionId: questionId } });
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: "Answer not found for this question!.",
      });
    }

    // Update the question's correct answer ID
    await question.update({ correctAnswerId: answerId });

    return res.status(200).json({ 
      success: true, 
      message: "Correct answer updated successfully." 
    });
  } catch (error) {
    console.error("Error updating correct answer:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// Delete all IQ questions and their associated answers and images
exports.deleteAllQuestions = async (req, res) => {
  try {
    // First, find all questions to get their IDs and image URLs
    const questions = await IqQuestion.findAll();
    
    if (questions.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No IQ questions found to delete",
      });
    }

    
    // Find all answers associated with these questions
    const answers = await IqAnswer.findAll();

    // Delete all answer images
    for (const answer of answers) {
      if (answer.imageUrl) {
        const imagePath = path.join(
          baseDir,
          answer.imageUrl.replace("files/", "")
        );
        await safeDeleteFile(imagePath);
      }
    }

    // Delete all question images
    for (const question of questions) {
      if (question.imageUrl) {
        const imagePath = path.join(
          baseDir,
          question.imageUrl.replace("files/", "")
        );
        await safeDeleteFile(imagePath);
      }
    }

    // Delete all answers first
    await IqAnswer.destroy({
      where: {}
    });

    // Delete all questions
    await IqQuestion.destroy({
      where: {}
    });

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${questions.length} IQ questions and all associated answers`,
    });
  } catch (error) {
    console.error("Error deleting all IQ questions:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

