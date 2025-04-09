const AdminActivity = require("./User/adminActivity");
const Admin = require("./User/admins");
const UserActivity = require("./User/userActivity");
const UserProfile = require("./User/userProfile");
const User = require("./User/users");
const Pages = require("./Basic/pages");
const Feeds = require("./Basic/feeds");
const Likes = require("./Basic/likes");
const Comments = require("./Basic/comments");

exports.setupModels = async () => {
  // Define associations
  Admin.hasMany(AdminActivity);
  AdminActivity.belongsTo(Admin);

  User.hasOne(UserProfile);
  UserProfile.belongsTo(User);

  User.hasMany(UserActivity);
  UserActivity.belongsTo(User);


  User.belongsToMany(Pages, { through: 'followers' });
  Pages.belongsToMany(User, { through: 'followers' });

  User.hasMany(Feeds);
  Feeds.belongsTo(User);

  Pages.hasMany(Feeds);
  Feeds.belongsTo(Pages);

  
  
  Feeds.hasMany(Likes);
  Likes.belongsTo(Feeds);

  Feeds.hasMany(Comments);
  Comments.belongsTo(Feeds);

  User.hasMany(Likes);
  Likes.belongsTo(User);

  User.hasMany(Comments);
  Comments.belongsTo(User);
  
  
  
  
  
  
  
  
  
  
  
};
