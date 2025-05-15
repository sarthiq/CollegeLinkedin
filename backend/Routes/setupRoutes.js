const adminRouter = require("./Admin/admin");
const developerRouter = require("./Developer/developer");
const userRouter = require("./User/user");
const filesRouter = require("./Files/files");
const emailRouter = require("./Email/email");

exports.setupRoutes = (app) => {
  app.use("/admin", adminRouter);
  app.use("/developer", developerRouter);
  app.use("/user", userRouter);
  app.use("/files", filesRouter);
  app.use("/email", emailRouter);
};
