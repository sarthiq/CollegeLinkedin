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
    
  },
  {
    timestamps: true,
    tableName: "userProfiles",
  }
);


module.exports = UserProfile;
