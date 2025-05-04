const Sequelize = require("sequelize");
const { sequelize } = require("../../importantInfo");

const Follow = sequelize.define(
  "Follow",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    followersId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    followingId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "follows",
  }
);

module.exports = Follow;
