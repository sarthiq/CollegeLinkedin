const Sequelize = require("sequelize");
const { sequelize } = require("../../importantInfo");

const PageDescription = sequelize.define(
  "PageDescription",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "page_descriptions",
  }
);

module.exports = PageDescription;