const UserProfile = require("../../../Models/User/userProfile");
const User = require("../../../Models/User/users");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user data in req from auth middleware

    // Try to find existing profile
    let userProfile = await UserProfile.findOne({
      where: { UserId: userId },
      include: [
        {
          model: User,
          attributes: ["name", "email", "phone", "profileUrl"],
        },
      ],
    });

    // If profile doesn't exist, create one with default values
    if (!userProfile) {
      userProfile = await UserProfile.create({
        UserId: userId,
        institutionName: "",
        institutionType: "SCHOOL",
        standard: null,
        course: null,
        year: null,
        branch: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: userProfile,
    });
  } catch (error) {
    console.error("Error in getProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user data in req from auth middleware
    const { institutionName, institutionType, standard, course, year, branch } =
      req.body;
    
    // Validate required fields
    if (!institutionName || !institutionType) {
      return res.status(400).json({
        success: false,
        message: "Institution name and type are required",
      });
    }

    // Find or create profile
    const userProfile = await UserProfile.findOne({
      where: { UserId: userId },
    });

    // Update profile
    await userProfile.update(
      {
        institutionName,
        institutionType,
        standard: standard || null,
        course: course || null,
        year: year || null,
        branch: branch || null,
      },
      { where: { UserId: userId } }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: userProfile,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
