const AdminActivity = require("./User/adminActivity");
const Admin = require("./User/admins");

exports.setupModels = async () => {
  // Define associations
  Admin.hasMany(AdminActivity);
  AdminActivity.belongsTo(Admin);
};
