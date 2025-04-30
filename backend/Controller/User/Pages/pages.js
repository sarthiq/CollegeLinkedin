const Pages = require("../../../Models/Basic/pages");
const User = require("../../../Models/User/users");
const { Op } = require("sequelize");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { saveFile, safeDeleteFile } = require("../../../Utils/fileHandler");
const Followers = require("../../../Models/Basic/followers");
const UserProfile = require("../../../Models/User/userProfile");
const { sequelize } = require("../../../importantInfo");
const { baseDir } = require("../../../importantInfo");

// Get all pages
exports.getAllPages = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, userPages = false } = req.body;
    const offset = (page - 1) * limit;

    // Build search condition if search query exists
    const whereCondition = search
      ? {
          title: {
            [Op.like]: `%${search}%`, // Search in title field
          },
        }
      : {};

    if (userPages) {
      const userId = req.user.id;
      whereCondition.adminId = userId;
    }
    whereCondition.type = "page";
    // Get pages with pagination and search
    const { count, rows: pages } = await Pages.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          attributes: ["id", "name"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]], // Order by latest first
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Check if current user is following each page
    const userId = req.user.id;
    const pagesWithFollowingStatus = await Promise.all(pages.map(async (page) => {
      const follower = await Followers.findOne({
        where: {
          UserId: userId,
          PageId: page.id
        }
      });
      const pageData = page.toJSON();
      pageData.isFollowing = !!follower;
      return pageData;
    }));
    

    res.status(200).json({
      success: true,
      data: {
        pages: pagesWithFollowingStatus,
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

// Get page by id
exports.getPageById = async (req, res) => {
  try {
    const { id } = req.body;
    const page = await Pages.findByPk(id);

    if (!page) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }

    const user = await User.findByPk(page.adminId, {
      attributes: ["name"],
      include: [
        {
          model: UserProfile,
          attributes: ["profileUrl"],
        },
      ],
    });

    page.admin = user;

    // Initialize response data
    const responseData = {
      page,
      admin: {
        name: user.name,
        profileUrl: user.UserProfile.profileUrl,
      }
    };

    // Only check user-specific data if user is authenticated
    if (req.user && req.user.id) {
      const isFollowing = await Followers.findOne({
        where: {
          UserId: req.user.id,
          PageId: page.id,
        },
      });

      responseData.admin.isAdmin = req.user.id === page.adminId;
      responseData.isFollowing = isFollowing ? true : false;
    } else {
      responseData.admin.isAdmin = false;
      responseData.isFollowing = false;
    }
    
    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create page
exports.createPage = async (req, res) => {
  try {
    const { title,description ,category} = req.body;
    const userId = req.user.id;
    const imageFile = req.files && req.files.image ? req.files.image[0] : null;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    // Check if page with same trimmed title already exists
    const trimmedTitle = title.trim();
    const existingPage = await Pages.findOne({
      where: {
        title: trimmedTitle
      }
    });

    if (existingPage) {
      return res
        .status(400)
        .json({ success: false, message: "A page with this title already exists" });
    }

    let imageUrl = "";
    if (imageFile) {
      const filePath = path.join("CustomFiles", "Pages");
      const fileName = uuidv4();
      imageUrl = saveFile(imageFile, filePath, fileName);
    }

    const page = await Pages.create({
      title: trimmedTitle,
      description: description,
      imageUrl,
      followers: 0,
      adminId: userId,
      category: category,
      type: "page",
    });

    // Add the creator as a follower
    await Followers.create({
      UserId: userId,
      PageId: page.id,
    });

    res.status(201).json({ success: true, data: page });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update page
exports.updatePage = async (req, res) => {
  try {
    const { title, description, id } = req.body;
    const userId = req.user.id;

    const imageFile = req.files && req.files.image ? req.files.image[0] : null;

    const page = await Pages.findOne({ where: { id: id, adminId: userId } });
    if (!page) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }

    // If there's a new image file, delete the old one if it exists
    if (imageFile && page.imageUrl) {
      const oldImagePath = path.join(baseDir, page.imageUrl.replace("files/", ""));
      await safeDeleteFile(oldImagePath);
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
      description: description || page.description,
      imageUrl,
    });

    res.status(200).json({ success: true, data: page });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete page
exports.deletePage = async (req, res) => {
  let transaction;
  try {
    const { id } = req.body;
    const userId = req.user.id;

    const page = await Pages.findOne({ where: { id: id, adminId: userId } });
    if (!page) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }

    // Delete the image file if it exists
    if (page.imageUrl) {
      const imagePath = path.join(baseDir, page.imageUrl.replace("files/", ""));
      await safeDeleteFile(imagePath);
    }

    transaction = await sequelize.transaction();

    await Followers.destroy({ where: { PageId: id }, transaction });
    await Pages.destroy({ where: { id: id }, transaction });

    await transaction.commit();

    res
      .status(200)
      .json({ success: true, message: "Page deleted successfully" });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Follow/Unfollow page
exports.toggleFollowPage = async (req, res) => {
  let transaction;
  try {
    const { id } = req.body;
    const userId = req.user.id; // Assuming user ID is available in request

    const page = await Pages.findByPk(id);
    if (!page) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }

    const isFollowing = await Followers.findOne({
      where: { UserId: userId, PageId: id },
    });
    transaction = await sequelize.transaction();
    if (isFollowing) {
      await Followers.destroy({ where: { UserId: userId, PageId: id }, transaction });
      await page.decrement("followers", { transaction });
    } else {
      await Followers.create({ UserId: userId, PageId: id }, { transaction });
      await page.increment("followers", { transaction });
    }

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: isFollowing
        ? "Unfollowed successfully"
        : "Followed successfully",
      data: { followers: page.followers },
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
