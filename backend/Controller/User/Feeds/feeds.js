const Feeds = require("../../../Models/Basic/feeds");
const { saveFile } = require("../../../Utils/fileHandler");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Create a new feed
exports.createFeed = async (req, res) => {
  try {
    const { feedData } = req.body;
    const userId = req.user.id; // Get user ID from request
    const imageFile = req.files
      ? req.files[req.fileName]
        ? req.files[req.fileName][0]
        : null
      : null;

    if (!feedData) {
      return res.status(400).json({ success: false, message: "Feed data is required" });
    }

    let parsedFeedData = typeof feedData === 'string' ? JSON.parse(feedData) : feedData;

    if (imageFile) {
      const filePath = path.join("CustomFiles", "Feeds");
      const fileName = uuidv4();
      const imageUrl = saveFile(imageFile, filePath, fileName);
      parsedFeedData.imageUrl = imageUrl;
    }

    const newFeed = await Feeds.create({
      UserId: userId,
      feedData: parsedFeedData,
      like: 0,
      comments: 0
    });

    res.status(201).json({ success: true, data: newFeed });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all feeds with pagination
exports.getAllFeeds = async (req, res) => {
  try {
    const { page = 1, limit = 10, usersFeed = false } = req.body;
    const offset = (page - 1) * limit;

    // Build where condition
    const whereCondition = {};
    if (usersFeed) {
      const userId = req.user.id; // Assuming user ID is available in request
      whereCondition.UserId = userId; // Assuming there's a UserId field in the Feeds model
    }

    const { count, rows: feeds } = await Feeds.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

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
          hasPrevPage
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get feed by id
exports.getFeedById = async (req, res) => {
  try {
    const { id } = req.body;
    const feed = await Feeds.findByPk(id);

    if (!feed) {
      return res.status(404).json({ success: false, message: "Feed not found" });
    }

    res.status(200).json({ success: true, data: feed });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update feed
exports.updateFeed = async (req, res) => {
  try {
    const { id } = req.body;
    const { feedData } = req.body;
    const userId = req.user.id;
    const imageFile = req.files
      ? req.files[req.fileName]
        ? req.files[req.fileName][0]
        : null
      : null;

    const feed = await Feeds.findByPk(id);
    if (!feed) {
      return res.status(404).json({ success: false, message: "Feed not found" });
    }

    // Check if the user is the owner of the feed
    if (feed.UserId !== userId) {
      return res.status(403).json({ success: false, message: "You are not authorized to update this feed" });
    }

    let parsedFeedData = typeof feedData === 'string' ? JSON.parse(feedData) : feedData;
    let currentFeedData = feed.feedData;

    if (imageFile) {
      const filePath = path.join("CustomFiles", "Feeds");
      const fileName = uuidv4();
      const imageUrl = saveFile(imageFile, filePath, fileName);
      parsedFeedData.imageUrl = imageUrl;
    } else if (currentFeedData.imageUrl) {
      parsedFeedData.imageUrl = currentFeedData.imageUrl;
    }

    await feed.update({
      feedData: parsedFeedData
    });

    res.status(200).json({ success: true, data: feed });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete feed
exports.deleteFeed = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.user.id;
    const feed = await Feeds.findByPk(id);

    if (!feed) {
      return res.status(404).json({ success: false, message: "Feed not found" });
    }

    // Check if the user is the owner of the feed
    if (feed.UserId !== userId) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this feed" });
    }

    await feed.destroy();
    res.status(200).json({ success: true, message: "Feed deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

