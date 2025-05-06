const { sequelize } = require("../../../importantInfo");
const AdminActivity = require("../../../Models/User/adminActivity");
const Admin = require("../../../Models/User/admins");
const UserProfile = require("../../../Models/User/userProfile");
const User = require("../../../Models/User/users");
const { createAdminActivity } = require("../../../Utils/activityUtils");
const { Op } = require("sequelize");
const ActiveUser = require("../../../Models/User/activeUsers");

exports.getUsers = async (req, res) => {
  try {
    const { limit = 10, page = 1, search = "", email, phone } = req.body;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }
    if (email) whereClause.email = email;
    if (phone) whereClause.phone = phone;

    const users = await User.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: UserProfile,
          // attributes: ['collegeName', 'collegeYear', 'courseName', 'title', 'bio']
        },
      ],
      attributes: { exclude: ["password"] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: users.rows,
      pagination: {
        total: users.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(users.count / limit),
      },
    });
  } catch (error) {
    console.error("Error in getUsers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getUsersStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const [totalUsers, todayUsers, monthUsers] = await Promise.all([
      User.count(),
      User.count({
        where: {
          createdAt: {
            [Op.gte]: today,
          },
        },
      }),
      User.count({
        where: {
          createdAt: {
            [Op.gte]: oneMonthAgo,
          },
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        todayUsers,
        monthUsers,
      },
    });
  } catch (error) {
    console.error("Error in getUsersStats:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await User.findOne({
      where: { id },
      include: [
        {
          model: UserProfile,
          attributes: [
            "collegeName",
            "collegeYear",
            "courseName",
            "title",
            "bio",
            "profileUrl",
            "coverUrl",
            "followers",
            "following",
          ],
        },
      ],
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error in getUserById:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateUserDetails = async (req, res) => {
  let transaction;
  try {
    const { id } = req.body;
    const { isBlocked, email, phone } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    transaction = await sequelize.transaction();
    const updateData = {};
    if (typeof isBlocked === "boolean") updateData.isBlocked = isBlocked;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    await user.update(updateData, { transaction });

    // Log admin activity
    const activityDescription = `Updated user details: ${Object.keys(
      updateData
    ).join(", ")}`;
    await createAdminActivity(
      req,
      "UPDATE_USER",
      activityDescription,
      transaction
    );

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "User details updated successfully",
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error in updateUserDetails:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getDailyActiveUsers = async (req, res) => {
  try {
    // Get date from query params or use today's date
    const date = req.body.date ? new Date(req.body.date) : new Date();
    date.setHours(0, 0, 0, 0);

    // Get all active users for the specified date
    const activeUsers = await ActiveUser.findAll({
      where: {
        date: date,
      },
      include: [
        {
          model: User,
          include: [
            {
              model: UserProfile,
            },
          ],
        },
      ],
      attributes: [
        "UserId",
        [sequelize.fn("SUM", sequelize.col("requestCount")), "totalRequests"],
        [sequelize.fn("MAX", sequelize.col("lastActive")), "lastActive"],
      ],
      group: ["UserId", "User.id", "User.UserProfile.id"],
      raw: false,
    });

    // Format the response
    const formattedResponse = activeUsers.map((record) => ({
      userId: record.User.id,
      name: record.User.name,
      email: record.User.email,
      phone: record.User.phone,
      totalRequests: record.getDataValue("totalRequests"),
      lastActive: record.getDataValue("lastActive"),
      profile: record.User.UserProfile
        ? {
            profileUrl: record.User.UserProfile.profileUrl,
          }
        : null,
    }));

    return res.status(200).json({
      success: true,
      date: date.toISOString().split("T")[0],
      totalActiveUsers: formattedResponse.length,
      users: formattedResponse,
    });
  } catch (error) {
    console.error("Error in getDailyActiveUsers:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching daily active users",
      error: error.message,
    });
  }
};

exports.getDailyActiveUsersStats = async (req, res) => {
  try {
    const { days = 30 } = req.body;
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get all active users data for the period
    const activeUsersData = await ActiveUser.findAll({
      attributes: [
        'date',
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('UserId'))), 'uniqueUsers'],
        [sequelize.fn('SUM', sequelize.col('requestCount')), 'totalRequests']
      ],
      where: {
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      group: ['date'],
      order: [['date', 'ASC']],
      raw: true
    });

    // Create a map of all dates in the range
    const dateMap = new Map();
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dateMap.set(dateStr, {
        date: dateStr,
        uniqueUsers: 0,
        totalRequests: 0
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Fill in the actual data
    activeUsersData.forEach(record => {
      const dateStr = new Date(record.date).toISOString().split('T')[0];
      dateMap.set(dateStr, {
        date: dateStr,
        uniqueUsers: parseInt(record.uniqueUsers) || 0,
        totalRequests: parseInt(record.totalRequests) || 0
      });
    });

    // Convert map to array
    const formattedResponse = Array.from(dateMap.values());

    return res.status(200).json({
      success: true,
      period: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        days: days
      },
      stats: formattedResponse
    });

  } catch (error) {
    console.error('Error in getDailyActiveUsersStats:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching daily active users stats",
      error: error.message
    });
  }
};

exports.getUserActivityStats = async (req, res) => {
  try {
    const { userId, days = 30 } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get user's activity data for the period
    const userActivityData = await ActiveUser.findAll({
      where: {
        UserId: userId,
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        'date',
        [sequelize.fn('SUM', sequelize.col('requestCount')), 'totalRequests'],
        [sequelize.fn('MAX', sequelize.col('lastActive')), 'lastActive']
      ],
      group: ['date'],
      order: [['date', 'ASC']],
      raw: true
    });

    // Create a map of all dates in the range
    const dateMap = new Map();
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dateMap.set(dateStr, {
        date: dateStr,
        totalRequests: 0,
        lastActive: null
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Fill in the actual data
    userActivityData.forEach(record => {
      const dateStr = new Date(record.date).toISOString().split('T')[0];
      dateMap.set(dateStr, {
        date: dateStr,
        totalRequests: parseInt(record.totalRequests) || 0,
        lastActive: record.lastActive
      });
    });

    // Get user details
    const user = await User.findOne({
      where: { id: userId },
      include: [{
        model: UserProfile,
        attributes: ['profileUrl']
      }],
      attributes: ['id', 'name', 'email', 'phone']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Convert map to array
    const formattedResponse = Array.from(dateMap.values());

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileUrl: user.UserProfile?.profileUrl
      },
      period: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        days: days
      },
      activity: formattedResponse
    });

  } catch (error) {
    console.error('Error in getUserActivityStats:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user activity stats",
      error: error.message
    });
  }
};

