const adminRouter = require("./Admin/admin");
const developerRouter = require("./Developer/developer");
const userRouter = require("./User/user");
const filesRouter = require("./Files/files");

exports.setupRoutes = (app) => {
  app.use("/admin", adminRouter);
  app.use("/developer", developerRouter);
  app.use("/user", userRouter);
  app.use("/files", filesRouter);
};
