const Pages = require("../../../Models/Basic/pages");
const User = require("../../../Models/User/users");
const { Op } = require("sequelize");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { saveFile } = require("../../../Utils/fileHandler");


// Get all pages
exports.getAllPages = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, userPages=false } = req.body;
    const offset = (page - 1) * limit;

    // Build search condition if search query exists
    const whereCondition = search ? {
      title: {
        [Op.like]: `%${search}%` // Search in title field
      }
    } : {};

    if(userPages){
      const userId = req.user.id;
      whereCondition.UserId = userId;
    }
    // Get pages with pagination and search
    const { count, rows: pages } = await Pages.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: "followers", 
          attributes: ["id", "name", "profileUrl"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']] // Order by latest first
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({ 
      success: true, 
      data: {
        pages,
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
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get page by id
exports.getPageById = async (req, res) => {
  try {
    const { id } = req.body;
    const page = await Pages.findByPk(id, {
      include: [
        {
          model: User,
          as: "followers",
          attributes: ["id", "name", "profileUrl"],
        },
      ],
    });

    if (!page) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }

    res.status(200).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create page
exports.createPage = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.id;
    const imageFile = req.files
      ? req.files[req.fileName]
        ? req.files[req.fileName][0]
        : null
      : null;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    let imageUrl = "";
    if (imageFile) {
      const filePath = path.join("CustomFiles", "Pages");
      const fileName = uuidv4();
      imageUrl = saveFile(imageFile, filePath, fileName);
    }

    const page = await Pages.create({
      title,
      imageUrl,
      followers: 0,
    });

    // Add the creator as a follower
    await page.addFollower(userId);

    res.status(201).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update page
exports.updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const imageFile = req.files
      ? req.files[req.fileName]
        ? req.files[req.fileName][0]
        : null
      : null;

    const page = await Pages.findByPk(id);
    if (!page) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }

    let imageUrl = page.imageUrl;
    if (imageFile) {
      const filePath = path.join("CustomFiles", "Pages");
      const fileName = uuidv4();
      imageUrl = saveFile(imageFile, filePath, fileName);
    }

    // Update the page
    await page.update({
      title: title || page.title,
      imageUrl,
    });

    res.status(200).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete page
exports.deletePage = async (req, res) => {
  try {
    const { id } = req.params;

    const page = await Pages.findByPk(id);
    if (!page) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }

    await page.destroy();
    res.status(200).json({ success: true, message: "Page deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Follow/Unfollow page
exports.toggleFollowPage = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.user.id; // Assuming user ID is available in request

    const page = await Pages.findByPk(id);
    if (!page) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }

    const isFollowing = await page.hasFollower(userId);
    
    if (isFollowing) {
      await page.removeFollower(userId);
      await page.decrement("followers");
    } else {
      await page.addFollower(userId);
      await page.increment("followers");
    }

    res.status(200).json({
      success: true,
      message: isFollowing ? "Unfollowed successfully" : "Followed successfully",
      data: { followers: page.followers },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

