const Sequelize = require("sequelize");
const { sequelize } = require("../../importantInfo");

const Community = sequelize.define(
  "Community",
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
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    followers: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    posts: {
      type: Sequelize.JSON,
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
    tableName: "communities",
  }
);

module.exports = Community;
