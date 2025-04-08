const adminRouter = require("./Admin/admin");
const developerRouter = require("./Developer/developer");

exports.setupRoutes = (app) => {
  app.use("/admin", adminRouter);
  app.use("/developer", developerRouter);
};
