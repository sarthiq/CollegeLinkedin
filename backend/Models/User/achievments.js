const Sequelize = require("sequelize");
const { sequelize } = require("../../importantInfo");

const Achievements = sequelize.define(
  "Achievements",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    issuer: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    
    imageUrl: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "achievements",
  }
);

module.exports = Achievements;
