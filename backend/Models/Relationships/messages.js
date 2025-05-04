const Sequelize = require("sequelize");
const { sequelize } = require("../../importantInfo");

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    senderId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    message: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "text",
    },
    isRead: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "messages",
  }
);

module.exports = Message;
