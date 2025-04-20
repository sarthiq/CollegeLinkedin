const Sequelize = require("sequelize");
const { sequelize } = require("../../importantInfo");

const Feeds = sequelize.define(
  "Feeds",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    feedData: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    like: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    comments: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    tableName: "feeds",
  }
);

module.exports = Feeds;
