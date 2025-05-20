const Feeds = require("../../../Models/Basic/feeds");
const Community = require("../../../Models/Community/community");
const { Op } = require("sequelize");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { saveFile, safeDeleteFile } = require("../../../Utils/fileHandler");
const User = require("../../../Models/User/users");
const UserProfile = require("../../../Models/User/userProfile");
const { sequelize, baseDir } = require("../../../importantInfo");

exports.createCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;
    const imageFile = req.files && req.files.image ? req.files.image[0] : null;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }

    // Check if community with same name already exists
    const trimmedName = name.trim();
    const existingCommunity = await Community.findOne({
      where: {
        name: trimmedName
      }
    });

    if (existingCommunity) {
      return res
        .status(400)
        .json({ success: false, message: "A community with this name already exists" });
    }

    let imageUrl = "";
    if (imageFile) {
      const filePath = path.join("CustomFiles", "Communities");
      const fileName = uuidv4();
      imageUrl = saveFile(imageFile, filePath, fileName);
    }

    const community = await Community.create({
      name: trimmedName,
      description: description || "",
      imageUrl,
      followers: JSON.stringify([]),
      posts: JSON.stringify([]),
      isActive: true
    });

    res.status(201).json({ success: true, data: community });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateCommunity = async (req, res) => {
  try {
    const { id, name, description, isActive } = req.body;
    const imageFile = req.files && req.files.image ? req.files.image[0] : null;

    const community = await Community.findByPk(id);
    if (!community) {
      return res
        .status(404)
        .json({ success: false, message: "Community not found" });
    }

    // If there's a new image file, delete the old one if it exists
    if (imageFile && community.imageUrl) {
      const oldImagePath = path.join(baseDir, community.imageUrl.replace("files/", ""));
      await safeDeleteFile(oldImagePath);
    }

    let imageUrl = community.imageUrl;
    if (imageFile) {
      const filePath = path.join("CustomFiles", "Communities");
      const fileName = uuidv4();
      imageUrl = saveFile(imageFile, filePath, fileName);
    }

    // Update the community
    await community.update({
      name: name || community.name,
      description: description || community.description,
      imageUrl,
      isActive: isActive !== undefined ? isActive : community.isActive
    });

    res.status(200).json({ success: true, data: community });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllCommunities = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, active } = req.body;
    const offset = (page - 1) * limit;

    // Build search condition if search query exists
    let whereCondition = {};
    
    if (search) {
      whereCondition.name = {
        [Op.like]: `%${search}%`, // Search in name field
      };
    }
    
    if (active !== undefined) {
      whereCondition.isActive = active;
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

    res.status(200).json({
      success: true,
      data: {
        communities,
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

exports.getCommunityById = async (req, res) => {
  try {
    const { id } = req.body;
    const community = await Community.findByPk(id);

    if (!community) {
      return res
        .status(404)
        .json({ success: false, message: "Community not found" });
    }

    res.status(200).json({
      success: true,
      data: { community }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

//Feeds Related function --- 

exports.createCommunityFeed = async (req, res) => {
  let transaction;
  try {
    const { feedData, communityId, userId } = req.body;

    if (!communityId) {
      return res.status(400).json({ 
        success: false, 
        message: "Community ID is required" 
      });
    }

    // Check if community exists
    const community = await Community.findByPk(communityId);
    if (!community) {
      return res.status(400).json({ 
        success: false, 
        message: "Community not found" 
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
      UserId: userId || null, // Admin can create on behalf of a user or without a user
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

exports.updateCommunityFeed = async (req, res) => {
  try {
    const { id, feedData } = req.body;
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
        .json({ success: false, message: "Community feed not found" });
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

exports.getAllCommunityFeeds = async (req, res) => {
  try {
    const { page = 1, limit = 10, communityId } = req.body;
    const offset = (page - 1) * limit;

    if (!communityId) {
      return res.status(400).json({ 
        success: false, 
        message: "Community ID is required" 
      });
    }

    // Check if community exists
    const community = await Community.findByPk(communityId);
    if (!community) {
      return res.status(400).json({ 
        success: false, 
        message: "Community not found" 
      });
    }

    // Build where condition for feeds
    const whereCondition = {
      CommunityId: communityId
    };

    // Fetch feeds with user info for admin display
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

exports.getCommunityFeedById = async (req, res) => {
  try {
    const { id } = req.body;
    const feed = await Feeds.findOne({
      where: {
        id,
        CommunityId: { [Op.not]: null } // Ensure it's a community feed
      },
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
    });

    if (!feed) {
      return res
        .status(404)
        .json({ success: false, message: "Community feed not found" });
    }

    res.status(200).json({ success: true, data: feed });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteCommunityFeed = async (req, res) => {
  let transaction;
  try {
    const { id } = req.body;
    
    const feed = await Feeds.findOne({
      where: {
        id,
        CommunityId: { [Op.not]: null } // Ensure it's a community feed
      }
    });

    if (!feed) {
      return res
        .status(404)
        .json({ success: false, message: "Community feed not found" });
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
      .json({ success: true, message: "Community feed deleted successfully" });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
