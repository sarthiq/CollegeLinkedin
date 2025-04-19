const Sequelize = require("sequelize");
const { sequelize } = require("../../importantInfo");

const Pages = sequelize.define(
  "Pages",
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
    imageUrl: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    followers: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    posts: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    adminId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "pages",
  }
);

module.exports = Pages;
