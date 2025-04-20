const Comments = require("../../../Models/Basic/comments");
const Feeds = require("../../../Models/Basic/feeds");
const UserProfile = require("../../../Models/User/userProfile");
const User = require("../../../Models/User/users");


// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { feedId, comment } = req.body;
    const userId = req.user.id;

    if (!feedId || !comment) {
      return res.status(400).json({ success: false, message: "Feed ID and comment are required" });
    }

    const feed = await Feeds.findByPk(feedId);
    if (!feed) {
      return res.status(404).json({ success: false, message: "Feed not found" });
    }

    const newComment = await Comments.create({
      comment,
      UserId: userId,
      FeedId: feedId
    });

    // Increment comments count in feed
    await feed.increment('comments');

    res.status(201).json({ success: true, data: newComment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all comments for a feed
exports.getFeedComments = async (req, res) => {
  try {
    const { feedId } = req.body;
    const { page = 1, limit = 10 } = req.body;
    const offset = (page - 1) * limit;

    const { count, rows: comments } = await Comments.findAndCountAll({
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
        comments,
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

// Update comment
exports.updateComment = async (req, res) => {
  try {
    const { id, comment } = req.body;
    const userId = req.user.id;

    if (!comment) {
      return res.status(400).json({ success: false, message: "Comment is required" });
    }

    const existingComment = await Comments.findByPk(id);
    if (!existingComment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    if (existingComment.UserId !== userId) {
      return res.status(403).json({ success: false, message: "You are not authorized to update this comment" });
    }

    await existingComment.update({ comment });
    res.status(200).json({ success: true, data: existingComment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.user.id;

    const comment = await Comments.findByPk(id);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    if (comment.UserId !== userId) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this comment" });
    }

    // Decrement comments count in feed
    const feed = await Feeds.findByPk(comment.FeedId);
    if (feed) {
      await feed.decrement('comments');
    }

    await comment.destroy();
    res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
