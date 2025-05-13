const { DataTypes } = require("sequelize");
const { sequelize } = require("../../importantInfo");// Adjust the path to your database configuration

const IqResult = sequelize.define(
  "IqResult",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    noOfQuestionAttempted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    noOfWrongAnswers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    noOfCorrectAnswers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    label: {
      type: DataTypes.STRING,
      allowNull: true
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
    tableName: "iqResults", // Specify table name
  }
);

module.exports = IqResult;

//score
//noOfQuestionAttempted
//noOfWrongAnswers
//noOfCorrectAnswers
//label
//startTime
//endTime
//timeTaken