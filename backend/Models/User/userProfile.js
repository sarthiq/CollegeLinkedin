const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const UserProfile = sequelize.define(
  "UserProfile",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    collegeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    collegeYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coverUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
  },
  {
    timestamps: true,
    tableName: "userProfiles",
  }
);


module.exports = UserProfile;
