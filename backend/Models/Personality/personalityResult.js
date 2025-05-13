const { DataTypes } = require("sequelize");
const { sequelize } = require("../../importantInfo");

const PersonalityResult = sequelize.define(
  "PersonalityResult",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    
    openness: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    neuroticism: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    extraversion: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    agreeableness: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    conscientiousness: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    timeTaken: {
      type: DataTypes.INTEGER, // in seconds
      allowNull: false
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    tableName: "personalityResults", // Specify table name
  }
);

module.exports = PersonalityResult;