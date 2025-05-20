const Feeds = require("../../../Models/Basic/feeds");
const Community = require("../../../Models/Community/community");
const { Op } = require("sequelize");
const Followers = require("../../../Models/Basic/followers");
const User = require("../../../Models/User/users");
const UserProfile = require("../../../Models/User/userProfile");
const { sequelize } = require("../../../importantInfo");

// Get all communities for users with pagination, search, and follow status
exports.getAllCommunities = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.body;
    const userId = req.user.id;
    const offset = (page - 1) * limit;

    // Build where condition
    const whereCondition = {
      isActive: true // Only show active communities to users
    };
    
    if (search) {
      whereCondition.name = {
        [Op.like]: `%${search}%` // Search in name field
      };
    }

    // Get communities with pagination and search
    const { count, rows: communities } = await Community.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]], // Order by latest first
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Check if current user is following each community
    const communitiesWithFollowingStatus = await Promise.all(communities.map(async (community) => {
      const follower = await Followers.findOne({
        where: {
          UserId: userId,
          CommunityId: community.id
        }
      });
      const communityData = community.toJSON();
      communityData.isFollowing = !!follower;
      return communityData;
    }));

    res.status(200).json({
      success: true,
      data: {
        communities: communitiesWithFollowingStatus,
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

// Get community by id with user-specific info
exports.getCommunityById = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.user.id;
    
    const community = await Community.findOne({
      where: {
        id,
        isActive: true // Only show active communities
      }
    });

    if (!community) {
      return res
        .status(404)
        .json({ success: false, message: "Community not found" });
    }

    // Check if user is following this community
    const isFollowing = await Followers.findOne({
      where: {
        UserId: userId,
        CommunityId: id
      }
    });

    // Get member count
    const memberCount = await Followers.count({
      where: {
        CommunityId: id
      }
    });

    const responseData = {
      community: community.toJSON(),
      isFollowing: !!isFollowing,
      memberCount
    };

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Follow/Unfollow community
exports.toggleFollowCommunity = async (req, res) => {
  let transaction;
  try {
    const { id } = req.body;
    const userId = req.user.id;

    const community = await Community.findOne({
      where: {
        id,
        isActive: true // Only active communities can be followed
      }
    });
    
    if (!community) {
      return res
        .status(404)
        .json({ success: false, message: "Community not found" });
    }

    const isFollowing = await Followers.findOne({
      where: {
        UserId: userId,
        CommunityId: id
      }
    });

    transaction = await sequelize.transaction();

    // Get current followers data
    let followers = community.followers ? JSON.parse(community.followers) : [];

    if (isFollowing) {
      // Unfollow
      await Followers.destroy({
        where: {
          UserId: userId,
          CommunityId: id
        },
        transaction
      });

      // Remove user from followers array
      followers = followers.filter(followerId => followerId !== userId);
    } else {
      // Follow
      await Followers.create({
        UserId: userId,
        CommunityId: id
      }, { transaction });

      // Add user to followers array if not already present
      if (!followers.includes(userId)) {
        followers.push(userId);
      }
    }

    // Update followers in community
    await community.update({
      followers: JSON.stringify(followers)
    }, { transaction });

    await transaction.commit();

    // Get updated member count
    const memberCount = await Followers.count({
      where: {
        CommunityId: id
      }
    });

    res.status(200).json({
      success: true,
      message: isFollowing ? "Community unfollowed successfully" : "Community followed successfully",
      data: {
        isFollowing: !isFollowing,
        memberCount
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

// Get feeds from a specific community
exports.getCommunityFeeds = async (req, res) => {
  try {
    const { communityId, page = 1, limit = 10 } = req.body;
    const userId = req.user.id;
    const offset = (page - 1) * limit;

    if (!communityId) {
      return res.status(400).json({ 
        success: false, 
        message: "Community ID is required" 
      });
    }

    // Check if community exists and is active
    const community = await Community.findOne({
      where: {
        id: communityId,
        isActive: true
      }
    });
    
    if (!community) {
      return res.status(404).json({ 
        success: false, 
        message: "Community not found" 
      });
    }

    // Build where condition for feeds
    const whereCondition = {
      CommunityId: communityId
    };

    // Fetch feeds
    const { count, rows: feeds } = await Feeds.findAndCountAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["id", "name"],
          include: [
            {
              model: UserProfile,
              attributes: ["profileUrl", "title"],
            },
          ],
        },
        {
          model: Community,
          attributes: ["id", "name", "imageUrl", "description"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: {
        feeds,
        pagination: {
          total: count,
          totalPages,
          currentPage: parseInt(page),
          limit: parseInt(limit),
          hasNextPage,
          hasPrevPage,
        }
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get feeds from all communities the user follows
exports.getFollowedCommunitiesFeeds = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.body;
    const userId = req.user.id;
    const offset = (page - 1) * limit;

    // Get communities the user follows
    const followedCommunities = await Followers.findAll({
      where: {
        UserId: userId
      },
      attributes: ['CommunityId']
    });

    const communityIds = followedCommunities.map(fc => fc.CommunityId);

    if (communityIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          feeds: [],
          pagination: {
            total: 0,
            totalPages: 0,
            currentPage: parseInt(page),
            limit: parseInt(limit),
            hasNextPage: false,
            hasPrevPage: false,
          }
        },
      });
    }

    // Build where condition for feeds
    const whereCondition = {
      CommunityId: {
        [Op.in]: communityIds
      }
    };

    // Fetch feeds
    const { count, rows: feeds } = await Feeds.findAndCountAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["id", "name"],
          include: [
            {
              model: UserProfile,
              attributes: ["profileUrl", "title"],
            },
          ],
        },
        {
          model: Community,
          attributes: ["id", "name", "imageUrl", "description"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: {
        feeds,
        pagination: {
          total: count,
          totalPages,
          currentPage: parseInt(page),
          limit: parseInt(limit),
          hasNextPage,
          hasPrevPage,
        }
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

