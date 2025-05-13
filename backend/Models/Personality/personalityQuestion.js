const { DataTypes } = require("sequelize");
const { sequelize } = require("../../importantInfo");// Adjust the path to your database configuration

const PersonalityQuestion = sequelize.define(
  "PersonalityQuestion",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    text: {
      type: DataTypes.JSON,
      allowNull: true, // Ensure a PersonalityQuestion always has text
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    tableName: "personalityQuestions", // Optional: specify table name if different from model name
  }
);

module.exports = PersonalityQuestion;
