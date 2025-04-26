const Sequelize = require("sequelize");
const { sequelize } = require("../../importantInfo");

const AppliedInternship = sequelize.define(
  "AppliedInternship",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
    noticePeriod: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    currentSalary: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    expectedSalary: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    availability: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    coverLetter: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    appliedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    interviewDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    feedback: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: "appliedInternships",
  }
);

module.exports = AppliedInternship;
