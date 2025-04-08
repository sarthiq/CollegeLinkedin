const Admin = require("../../../Models/User/admins");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { Op } = require("sequelize");

exports.createSSAdmin = async (req, res, next) => {
  try {
    const { password, userName, name, email, adminType, phone,authPassword } = req.body;
    if (!password || !userName || !name || !adminType || !phone || !authPassword) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    if (phone && phone.length !== 10) {
      return res.status(400).json({
        message: "Phone number must be 10 digits long.",
      });
    }
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email address.",
      });
    }

    // Check if any SSA type admin already exists
    // Check existing SSA and SA admins count
    const existingSSACount = await Admin.count({ where: { adminType: "SSA" } });
    const existingSACount = await Admin.count({ where: { adminType: "SA" } });

    // Check limits based on admin type
    if (adminType === "SSA" && existingSSACount >= 2) {
      return res.status(400).json({
        message: "Cannot create more than 2 SSA type admins.",
      });
    }

    if (adminType === "SA" && existingSACount >= 1) {
      return res.status(400).json({
        message: "Cannot create more than 1 SA type admin.",
      });
    }

    if (adminType !== "SSA" && adminType !== "SA") {
      return res.status(400).json({
        message: "Invalid admin type.",
      });
    }

    const existingAdmin = await Admin.findOne({
      where: {
        [Op.or]: [{ email }, { phone }],
      },
    });
    if (existingAdmin) {
      return res.status(400).json({
        message:
          "Admin already exists. Please try with different email or phone number or userName.",
      });
    }

    // Generate random username
    //const userName = "XDMJT36652"//generateRandomId();

    // Extract password from request body

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAuthPassword = await bcrypt.hash(authPassword, 10);
    // Create the new SSA admin
    const newAdmin = await Admin.create({
      userName,
      adminType,
      password: hashedPassword,
      freezeStatus: false,
      name,
      authPassword: hashedAuthPassword,
      email,
      phone,
    });

    return res.status(201).json({
      message: "Admin created successfully.",
      admin: newAdmin,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
