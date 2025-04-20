const Likes = require("../../../Models/Basic/likes");
const Feeds = require("../../../Models/Basic/feeds");
const User = require("../../../Models/User/users");
const UserProfile = require("../../../Models/User/userProfile");

// Toggle like on a feed
exports.toggleLike = async (req, res) => {
  try {
    const { feedId } = req.body;
    const userId = req.user.id;

    if (!feedId) {
      return res.status(400).json({ success: false, message: "Feed ID is required" });
    }

    const feed = await Feeds.findByPk(feedId);
    if (!feed) {
      return res.status(404).json({ success: false, message: "Feed not found" });
    }

    // Check if user has already liked the feed
    const existingLike = await Likes.findOne({
      where: {
        UserId: userId,
        FeedId: feedId
      }
    });

    if (existingLike) {
      // Unlike
      await existingLike.destroy();
      await feed.decrement('like');
      res.status(200).json({ 
        success: true, 
        message: "Unliked successfully",
        data: { isLiked: false, likes: feed.like - 1 }
      });
    } else {
      // Like
      await Likes.create({
        UserId: userId,
        FeedId: feedId
      });
      await feed.increment('like');
      res.status(200).json({ 
        success: true, 
        message: "Liked successfully",
        data: { isLiked: true, likes: feed.like + 1 }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get like status for a feed
exports.getLikeStatus = async (req, res) => {
  try {
    const { feedId } = req.body;
    const userId = req.user.id;

    if (!feedId) {
      return res.status(400).json({ success: false, message: "Feed ID is required" });
    }

    const feed = await Feeds.findByPk(feedId);
    if (!feed) {
      return res.status(404).json({ success: false, message: "Feed not found" });
    }

    const isLiked = await Likes.findOne({
      where: {
        UserId: userId,
        FeedId: feedId
      }
    });

    res.status(200).json({ 
      success: true, 
      data: { 
        isLiked: !!isLiked,
        likes: feed.like
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all likes for a feed
exports.getFeedLikes = async (req, res) => {
  try {
    const { feedId } = req.body;
    const { page = 1, limit = 10 } = req.body;
    const offset = (page - 1) * limit;

    const { count, rows: likes } = await Likes.findAndCountAll({
      where: { FeedId: feedId },
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
      ],
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
        likes,
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
