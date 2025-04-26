const AdminActivity = require("./User/adminActivity");
const Admin = require("./User/admins");
const UserActivity = require("./User/userActivity");
const UserProfile = require("./User/userProfile");
const User = require("./User/users");
const Pages = require("./Basic/pages");
const Feeds = require("./Basic/feeds");
const Likes = require("./Basic/likes");
const Comments = require("./Basic/comments");
const Followers = require("./Basic/followers");
const Achievements = require("./User/achievments");
const Education = require("./User/education");
const Experience = require("./User/experience");
const Interests = require("./User/interests");
const Projects = require("./User/projects");
const ProjectMember = require("./User/projectMember");
const Skills = require("./User/skills");

exports.setupModels = async () => {
  // Define associations
  Admin.hasMany(AdminActivity);
  AdminActivity.belongsTo(Admin);

  User.hasOne(UserProfile);
  UserProfile.belongsTo(User);

  User.hasMany(UserActivity);
  UserActivity.belongsTo(User);

  User.belongsToMany(Pages, { through: Followers });
  Pages.belongsToMany(User, { through: Followers });

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

  // New associations
  User.hasMany(Achievements);
  Achievements.belongsTo(User);

  User.hasMany(Education);
  Education.belongsTo(User);

  User.hasMany(Experience);
  Experience.belongsTo(User);

  User.hasOne(Interests);
  Interests.belongsTo(User);

  User.hasMany(Projects);
  Projects.belongsTo(User);

  User.hasMany(ProjectMember);
  ProjectMember.belongsTo(User);

  Projects.hasMany(ProjectMember);
  ProjectMember.belongsTo(Projects);

  User.hasMany(Skills);
  Skills.belongsTo(User);
};
