const Feeds = require("../../../Models/Basic/feeds");
const Community = require("../../../Models/Community/community");
const { Op } = require("sequelize");
const Followers = require("../../../Models/Basic/followers");
const User = require("../../../Models/User/users");
const UserProfile = require("../../../Models/User/userProfile");
const { sequelize } = require("../../../importantInfo");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { saveFile, safeDeleteFile } = require("../../../Utils/fileHandler");
const { baseDir } = require("../../../importantInfo");

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

    if(!id ){
      return res.status(400).json({
        success: false,
        message: "Community ID is required"
      });
    }

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

//creat feed
exports.createFeed = async (req, res) => {
  let transaction;
  try {
    const { feedData, communityId } = req.body;
    const userId = req.user.id;

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
      return res.status(400).json({ 
        success: false, 
        message: "Community not found or inactive" 
      });
    }

    // Check if the user is following this community
    const isFollowing = await Followers.findOne({
      where: {
        UserId: userId,
        CommunityId: communityId
      }
    });

    if (!isFollowing) {
      return res.status(403).json({ 
        success: false, 
        message: "You must follow a community before posting" 
      });
    }

    let parsedFeedData =
      typeof feedData === "string" ? JSON.parse(feedData) : feedData;

    // Handle multiple images
    if (req.files && req.files.image) {
      const imagesUrl = [];
      for (const imageFile of req.files.image) {
        const filePath = path.join("CustomFiles", "CommunityFeeds");
        const fileName = uuidv4();
        const imageUrl = saveFile(imageFile, filePath, fileName);
        imagesUrl.push(imageUrl);
      }
      parsedFeedData.imagesUrl = imagesUrl;
    }

    transaction = await sequelize.transaction();

    const feedDataToCreate = {
      feedData: parsedFeedData,
      like: 0,
      comments: 0,
      UserId: userId,
      CommunityId: communityId
    };

    const newFeed = await Feeds.create(feedDataToCreate, { transaction });
    
    // Update the community posts
    const posts = community.posts ? JSON.parse(community.posts) : [];
    posts.push(newFeed.id);
    await community.update({ posts: JSON.stringify(posts) }, { transaction });
    
    await transaction.commit();

    res.status(201).json({ success: true, data: newFeed });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

//delete feed
exports.deleteFeed = async (req, res) => {
  let transaction;
  try {
    const { id } = req.body;
    const userId = req.user.id;
    
    const feed = await Feeds.findOne({
      where: {
        id,
        CommunityId: { [Op.not]: null }, // Ensure it's a community feed
      }
    });

    if (!feed) {
      return res
        .status(404)
        .json({ success: false, message: "Feed not found" });
    }

    // Check if the user is the creator of the feed
    if (feed.UserId !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "You can only delete your own feeds" });
    }

    // Delete all associated images
    const feedData = feed.feedData;
    if (feedData.imagesUrl && feedData.imagesUrl.length > 0) {
      for (const imageUrl of feedData.imagesUrl) {
        const imagePath = path.join(baseDir, imageUrl.replace("files/", ""));
        await safeDeleteFile(imagePath);
      }
    }

    transaction = await sequelize.transaction();

    // Update the community posts
    const community = await Community.findByPk(feed.CommunityId);
    if (community) {
      const posts = community.posts ? JSON.parse(community.posts) : [];
      const updatedPosts = posts.filter(postId => postId !== feed.id);
      await community.update({ posts: JSON.stringify(updatedPosts) }, { transaction });
    }

    await feed.destroy({ transaction });
    await transaction.commit();
    
    res
      .status(200)
      .json({ success: true, message: "Feed deleted successfully" });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

//update feed
exports.updateFeed = async (req, res) => {
  try {
    const { id, feedData } = req.body;
    const userId = req.user.id;
    const imageFiles = req.files || [];
    const existingImages = req.body.existingImages || [];

    const feed = await Feeds.findOne({
      where: {
        id,
        CommunityId: { [Op.not]: null } // Ensure it's a community feed
      }
    });
    
    if (!feed) {
      return res
        .status(404)
        .json({ success: false, message: "Feed not found" });
    }

    // Check if the user is the creator of the feed
    if (feed.UserId !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "You can only update your own feeds" });
    }

    let parsedFeedData =
      typeof feedData === "string" ? JSON.parse(feedData) : feedData;
    let currentFeedData = feed.feedData;

    // Handle image updates
    // Process existing images to get the correct path after 'files/'
    const processedExistingImages = existingImages.map((url) => {
      const parts = url.split("files/");
      return parts.length > 1 ? "files/" + parts[1] : url;
    });

    const imagesUrl = [...processedExistingImages]; // Start with processed existing images

    // Add new images
    if (imageFiles.image && imageFiles.image.length > 0) {
      for (const imageFile of imageFiles.image) {
        const filePath = path.join("CustomFiles", "CommunityFeeds");
        const fileName = uuidv4();
        const imageUrl = saveFile(imageFile, filePath, fileName);
        imagesUrl.push(imageUrl);
      }
    }

    // Delete images that are no longer in existingImages
    if (currentFeedData.imagesUrl) {
      for (const oldImageUrl of currentFeedData.imagesUrl) {
        if (!processedExistingImages.includes(oldImageUrl)) {
          const oldImagePath = path.join(
            baseDir,
            oldImageUrl.replace("files/", "")
          );
          await safeDeleteFile(oldImagePath);
        }
      }
    }

    // Update the feed data with new images
    parsedFeedData.imagesUrl = imagesUrl;

    await feed.update({
      feedData: parsedFeedData,
    });

    res.status(200).json({ success: true, data: feed });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
