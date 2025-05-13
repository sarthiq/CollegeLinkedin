const { DataTypes } = require("sequelize");
const { sequelize } = require("../../importantInfo");// Adjust the path to your database configuration

const IqAnswer = sequelize.define(
  "IqAnswer",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    text: {
      type: DataTypes.TEXT,
      allowNull: true, // IqAnswer text is optional if an image is provided
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true, // Image-based answers are optional
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false, // Type must be defined
      defaultValue: "text", // Default to text-based answers
    },isActive:{
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:true
    }
   
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    tableName: "iqAnswers", // Optional: specify table name if different from model name
  }
);

module.exports = IqAnswer;
