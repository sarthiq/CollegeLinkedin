const Sequelize = require("sequelize");
const { sequelize } = require("../../importantInfo");

const Skills = sequelize.define(
  "Skills",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    level: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    yearsOfExperience: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "skills",
  }
);

module.exports = Skills;
