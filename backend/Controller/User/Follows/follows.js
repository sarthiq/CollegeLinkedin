const Follow = require("../../../Models/Relationships/follows");
const User = require("../../../Models/User/users");
const UserProfile = require("../../../Models/User/userProfile");
const { Op } = require("sequelize");
const { sequelize } = require("../../../importantInfo");

// Toggle follow/unfollow user
exports.toggleFollow = async (req, res) => {
  let transaction;
  try {
    const { userId } = req.body;
    const currentUserId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Check if user exists
    const userToFollow = await User.findByPk(userId, {
      include: [{ model: UserProfile }]
    });
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get current user's profile
    const currentUser = await User.findByPk(currentUserId, {
      include: [{ model: UserProfile }]
    });

    // Prevent self-following
    if (userId === currentUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const isFollowing = await Follow.findOne({
      where: {
        followersId: currentUserId,
        followingId: userId,
      },
    });

    transaction = await sequelize.transaction();

    if (isFollowing) {
      // Unfollow
      await Follow.destroy({
        where: {
          followersId: currentUserId,
          followingId: userId,
        },
        transaction,
      });

      // Update follower count for the user being unfollowed
      await userToFollow.UserProfile.decrement('followers', { transaction });
      // Update following count for the current user
      await currentUser.UserProfile.decrement('following', { transaction });
    } else {
      // Follow
      await Follow.create(
        {
          followersId: currentUserId,
          followingId: userId,
        },
        { transaction }
      );

      // Update follower count for the user being followed
      await userToFollow.UserProfile.increment('followers', { transaction });
      // Update following count for the current user
      await currentUser.UserProfile.increment('following', { transaction });
    }

    await transaction.commit();

    // Get updated counts
    const updatedUserToFollow = await User.findByPk(userId, {
      include: [{ model: UserProfile }]
    });
    const updatedCurrentUser = await User.findByPk(currentUserId, {
      include: [{ model: UserProfile }]
    });

    res.status(200).json({
      success: true,
      message: isFollowing ? "Unfollowed successfully" : "Followed successfully",
      data: {
        targetUser: {
          followers: updatedUserToFollow.UserProfile.followers
        },
        currentUser: {
          following: updatedCurrentUser.UserProfile.following
        }
      }
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get followers list
exports.getFollowers = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId } = req.body;
    const offset = (page - 1) * limit;

    const targetUserId = userId || req.user.id;

    const { count, rows: followers } = await Follow.findAndCountAll({
      where: {
        followingId: targetUserId,
      },
      include: [
        {
          model: User,
          as: 'follower',
          attributes: ['id', 'name'],
          include: [
            {
              model: UserProfile,
              attributes: ['profileUrl'],
            },
          ],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    // Transform the data to include isFollowing flag
    const transformedFollowers = await Promise.all(followers.map(async (follow) => {
      const followerData = follow.follower.toJSON();
      const isFollowing = await Follow.findOne({
        where: {
          followersId: req.user.id,
          followingId: followerData.id,
        },
      });
      return {
        ...followerData,
        isFollowing: !!isFollowing,
      };
    }));

    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: {
        followers: transformedFollowers,
        pagination: {
          total: count,
          totalPages,
          currentPage: parseInt(page),
          limit: parseInt(limit),
          hasNextPage,
          hasPrevPage,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get following list
exports.getFollowing = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId } = req.body;
    const offset = (page - 1) * limit;

    const targetUserId = userId || req.user.id;

    const { count, rows: following } = await Follow.findAndCountAll({
      where: {
        followersId: targetUserId,
      },
      include: [
        {
          model: User,
          as: 'following',
          attributes: ['id', 'name'],
          include: [
            {
              model: UserProfile,
              attributes: ['profileUrl'],
            },
          ],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    // Transform the data to include isFollowing flag
    const transformedFollowing = await Promise.all(following.map(async (follow) => {
      const followingData = follow.following.toJSON();
      const isFollowing = await Follow.findOne({
        where: {
          followersId: req.user.id,
          followingId: followingData.id,
        },
      });
      return {
        ...followingData,
        isFollowing: !!isFollowing,
      };
    }));

    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: {
        following: transformedFollowing,
        pagination: {
          total: count,
          totalPages,
          currentPage: parseInt(page),
          limit: parseInt(limit),
          hasNextPage,
          hasPrevPage,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Check if current user is following a specific user
exports.checkFollowStatus = async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const isFollowing = await Follow.findOne({
      where: {
        followersId: currentUserId,
        followingId: userId,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        isFollowing: !!isFollowing,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
