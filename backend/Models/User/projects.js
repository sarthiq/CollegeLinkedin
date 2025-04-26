const Sequelize = require("sequelize");
const { sequelize } = require("../../importantInfo");

const Projects = sequelize.define(
  "Projects",
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
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    endDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'ongoing',
    },
    technologies: {
      type: Sequelize.JSON,
      allowNull: true,
    },
   
  },
  {
    timestamps: true,
    tableName: "projects",
  }
);

module.exports = Projects;
