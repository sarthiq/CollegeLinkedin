const Sequelize = require("sequelize");
const { sequelize } = require("../../importantInfo");

const Internship = sequelize.define(
  "Internship",
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
    companyName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    responsibilities: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    requirements: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    perksOrBenefits: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    otherDetails: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    jobType: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    duration: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    salary: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    skills: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    deadline: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'active',
    },
    imagesUrl: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    category: {
      type: Sequelize.STRING,//design, development, marketing, etc.
      allowNull: true,
    },
    experienceLevel: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    remote: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "internships",
  }
);

module.exports = Internship;
