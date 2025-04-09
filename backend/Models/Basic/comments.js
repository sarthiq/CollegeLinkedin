const Sequelize = require("sequelize");
const { sequelize } = require("../../importantInfo");

const Comments = sequelize.define(
  "Comments",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    comment: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "comments",
  }
);

module.exports = Comments;