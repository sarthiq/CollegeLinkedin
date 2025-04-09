const Sequelize = require("sequelize");
const { sequelize } = require("../../importantInfo");

const Likes = sequelize.define(
  "Likes",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    timestamps: true,
    tableName: "likes",
  }
);

module.exports = Likes;