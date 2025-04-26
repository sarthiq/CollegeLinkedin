const Sequelize = require("sequelize");
const { sequelize } = require("../../importantInfo");

const Interests = sequelize.define(
  "Interests",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    preferredJobTypes: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    preferredLocations: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    preferredIndustries: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    preferredRoles: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    workMode: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    expectedSalary: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    currentSalary: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "interests",
  }
);

module.exports = Interests;
