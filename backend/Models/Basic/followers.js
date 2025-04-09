const Sequelize = require("sequelize");
const { sequelize } = require("../../importantInfo");

const Followers = sequelize.define(
  "Followers",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    timestamps: true,
    tableName: "followers",
  }
);

module.exports = Followers;