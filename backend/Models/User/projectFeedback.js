const Sequelize = require("sequelize");
const { sequelize } = require("../../importantInfo");

const ProjectFeedback = sequelize.define(
  "ProjectFeedback",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    feedbackDate: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    timestamps: true,
    tableName: "projectFeedback",
  }
);

module.exports = ProjectFeedback;
