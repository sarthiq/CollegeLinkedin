const AdminActivity = require("../Models/User/adminActivity");
// const UserActivity = require("../Models/User/userActivity");



// exports.createUserActivity = async (
//   req,
//   user,
//   activityType,
//   activityDescription,
//   transaction
// ) => {
//   const activityData = {
//     activityType: activityType,
//     activityDescription: activityDescription,
//     ipAddress: req ? req.clientInfo.primaryIpAddress : 'N/A', // Use null if req is null
//     userAgent: req ? req.clientInfo.userAgent : 'N/A', // Use null if req is null
//     location: req ? req.clientInfo.location : 'N/A', // Use null if req is null
//     deviceType: req ? req.clientInfo.deviceType : 'N/A', // Use null if req is null
//     createdAt: new Date(),
//     UserId: user.id, // Link activity to the User
//   };

//   if (transaction) {
//     return await UserActivity.create(activityData, { transaction });
//   } else {
//     return await UserActivity.create(activityData);
//   }
// };


exports.createAdminActivity = async (
  req,
  activityType,
  activityDescription,
  transaction
) => {
  const activityData = {
    activityType: activityType,
    activityDescription: activityDescription,
    ipAddress: req ? req.clientInfo.primaryIpAddress : 'N/A', // Use null if req is null
    userAgent: req ? req.clientInfo.userAgent : 'N/A', // Use null if req is null
    location: req ? req.clientInfo.location : 'N/A', // Use null if req is null
    deviceType: req ? req.clientInfo.deviceType : 'N/A', // Use null if req is null
    createdAt: new Date(),
    AdminId: req.admin.id, // Link activity to the Admin performing the action
  };

  if (transaction) {
    return await AdminActivity.create(activityData, { transaction });
  } else {
    return await AdminActivity.create(activityData);
  }
};

