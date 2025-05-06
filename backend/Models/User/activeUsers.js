const Sequelize = require("sequelize");
const { sequelize } = require("../../importantInfo");
const User = require("./users");

const ActiveUser = sequelize.define(
  "ActiveUser",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    requestCount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    lastActive: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  },
  {
    timestamps: true,
    tableName: "activeUsers",
    
  }
);



module.exports = ActiveUser;
