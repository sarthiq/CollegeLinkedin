const Admin = require("../Models/User/admins");

exports.validateAdminDetails = async (req, res, next) => {
  const { userName, phone, otpAuthenticationToken } = req.body;

  if (otpAuthenticationToken) {
    return next();
  }

  if (!userName || !phone) {
    return res.status(400).json({ error: "All fields are required--" });
  }

  try {
    const admin = await Admin.findOne({
      where: { userName: userName, phone: phone },
    });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
