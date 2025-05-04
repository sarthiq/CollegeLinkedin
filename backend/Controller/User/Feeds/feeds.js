const Feeds = require("../../../Models/Basic/feeds");
const { saveFile, safeDeleteFile } = require("../../../Utils/fileHandler");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Page = require("../../../Models/Basic/pages");
const User = require("../../../Models/User/users");
const UserProfile = require("../../../Models/User/userProfile");
const { sequelize } = require("../../../importantInfo");
const Likes = require("../../../Models/Basic/likes");
const { baseDir } = require("../../../importantInfo");
const Internship = require("../../../Models/Basic/internship");
const Projects = require("../../../Models/User/projects");

// Create a new feed
exports.createFeed = async (req, res) => {
  let transaction;
  try {
    const { feedData, pageId } = req.body;
    const userId = req.user.id;

    let parsedFeedData =
      typeof feedData === "string" ? JSON.parse(feedData) : feedData;

    // Handle multiple images
    if (req.files.image) {
      const imagesUrl = [];
      for (const imageFile of req.files.image) {
        const filePath = path.join("CustomFiles", "Feeds");
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
    };

    // Add PageId to feed data if provided
    let page;
    if (pageId) {
      feedDataToCreate.PageId = pageId;
      page = await Page.findByPk(pageId);

      if (!page) {
        return res
          .status(400)
          .json({ success: false, message: "Page not found" });
      }

      page.increment("posts", { transaction });
    }

    const newFeed = await Feeds.create(feedDataToCreate, { transaction });
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

// Get all feeds with pagination
exports.getAllFeeds = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      usersFeed = false,
      userId,
      pageId,
    } = req.body;
    const offset = (page - 1) * limit;
    //console.log(req.body);

    // Build where condition for feeds
    const whereCondition = {};
    if (usersFeed) {
      whereCondition.UserId = req.user.id;
    } else if (userId) {
      whereCondition.UserId = userId;
    }

    if (pageId) {
      whereCondition.PageId = pageId;
    }

    // Fetch feeds
    const feeds = await Feeds.findAll({
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
          model: Page,
          attributes: ["id", "title", "imageUrl", "description", "adminId"],
        },
      ],
    });

    // Fetch internships
    const internships = await Internship.findAll({
      where: { status: "active", ...whereCondition },
      order: [["createdAt", "DESC"]],
      include: [
          {
            model: User,
            as: 'User',
            attributes: ["id", "name"],
            include: [
              {
                model: UserProfile,
                attributes: ["profileUrl"],
              },
            ],
          },
        ],
      });

    
      
    // Fetch projects
    const projects = await Projects.findAll({
      where: { isPublic: true, ...whereCondition },
      order: [["createdAt", "DESC"]],
      include: [
          {
            model: User,
            attributes: ["id", "name"],
            include: [
              {
                model: UserProfile,
                attributes: ["profileUrl"],
              },
            ],
          },
        ],
      });

   

    // Transform and combine all data with type identifiers
    const combinedData = [
      ...feeds.map((feed) => ({
        type: "feed",
        data: feed.toJSON(),
        createdAt: feed.createdAt,
      })),
      ...internships.map((internship) => ({
        type: "internship",
        data: internship.toJSON(),
        createdAt: internship.createdAt,
      })),
      ...projects.map((project) => ({
        type: "project",
        data: project.toJSON(),
        createdAt: project.createdAt,
      })),
    ];

    
    
    // Sort by creation date
    combinedData.sort((a, b) => b.createdAt - a.createdAt);

    // Apply pagination
    const paginatedData = combinedData.slice(offset, offset + parseInt(limit));
    const totalCount = combinedData.length;

    // Get like status for feed items
    const feedsWithLikeStatus = await Promise.all(
      paginatedData.map(async (item) => {
        if (item.type === "feed") {
          const isLiked = await Likes.findOne({
            where: {
              UserId: req.user.id,
              FeedId: item.data.id,
            },
          });
          item.data.isLiked = !!isLiked;
        }
        return item;
      })
    );

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: {
        items: feedsWithLikeStatus,
        pagination: {
          total: totalCount,
          totalPages,
          currentPage: parseInt(page),
          limit: parseInt(limit),
          hasNextPage,
          hasPrevPage,
        },
        userId: req.user.id,
      },
    });
  } catch (error) {
    console.error("Error in getAllFeeds:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get feed by id
exports.getFeedById = async (req, res) => {
  try {
    const { id } = req.body;
    const feed = await Feeds.findByPk(id, {
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
          model: Page,
          attributes: ["id", "title", "imageUrl", "description", "adminId"],
        },
      ],
    });

    if (!feed) {
      return res
        .status(404)
        .json({ success: false, message: "Feed not found" });
    }

    const feedData = feed.toJSON();

    // Only check like status if user is authenticated
    if (req.user && req.user.id) {
      const isLiked = await Likes.findOne({
        where: {
          UserId: req.user.id,
          FeedId: feed.id,
        },
      });
      feedData.isLiked = !!isLiked;
    } else {
      feedData.isLiked = false;
    }

    res.status(200).json({ success: true, data: feedData });
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
    const imageFiles = req.files || [];
    const existingImages = req.body.existingImages || [];

    const feed = await Feeds.findByPk(id);
    if (!feed) {
      return res
        .status(404)
        .json({ success: false, message: "Feed not found" });
    }

    // Check if the user is the owner of the feed
    if (feed.UserId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this feed",
      });
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
        const filePath = path.join("CustomFiles", "Feeds");
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

// Delete feed
exports.deleteFeed = async (req, res) => {
  let transaction;
  try {
    const { id } = req.body;
    const userId = req.user.id;
    const feed = await Feeds.findByPk(id);

    if (!feed) {
      return res
        .status(404)
        .json({ success: false, message: "Feed not found" });
    }

    // Check if the user is either the page admin or the feed creator
    let isAuthorized = false;

    // Check if user is the feed creator
    if (feed.UserId === userId) {
      isAuthorized = true;
    }

    // If feed belongs to a page, check if user is the page admin
    if (feed.PageId) {
      const page = await Page.findByPk(feed.PageId);
      if (page && page.adminId === userId) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this feed",
      });
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

    if (feed.PageId) {
      const page = await Page.findByPk(feed.PageId);
      page.decrement("posts", { transaction });
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
