import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFeedByIdHandler } from '../Feed/feedApiHandler';
import { toggleLikeHandler, getFeedLikesHandler } from '../Feed/likeApiHandler';
import { createCommentHandler, getFeedCommentsHandler } from '../Feed/commentApiHandler';
import { handleShare, renderActionButtons } from '../Feed/feedUtils';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './FeedDetails.css';

export const FeedDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feed, setFeed] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [showLikes, setShowLikes] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchFeedDetails();
  }, [id]);

  const fetchFeedDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getFeedByIdHandler(
        { id },
        setIsLoading,
        (error) => setError(error)
      );
      if (response && response.success) {
        setFeed(response.data);
      }
    } catch (error) {
      setError('Failed to fetch feed details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await toggleLikeHandler(
        { feedId: id },
        setIsLoading,
        (error) => setError(error)
      );
      if (response && response.success) {
        setFeed(prev => ({
          ...prev,
          isLiked: response.data.isLiked,
          like: response.data.likes
        }));
      }
    } catch (error) {
      setError('Failed to update like status');
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      const response = await createCommentHandler(
        { feedId: id, comment: commentText },
        setIsLoading,
        (error) => setError(error)
      );
      if (response && response.success) {
        setCommentText('');
        await loadComments();
        setFeed(prev => ({
          ...prev,
          comments: (prev.comments || 0) + 1
        }));
      }
    } catch (error) {
      setError('Failed to add comment');
    }
  };

  const loadComments = async () => {
    try {
      const response = await getFeedCommentsHandler(
        { feedId: id, page: 1, limit: 10 },
        setIsLoading,
        (error) => setError(error)
      );
      if (response && response.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      setError('Failed to load comments');
    }
  };

  const loadLikes = async () => {
    try {
      const response = await getFeedLikesHandler(
        { feedId: id, page: 1, limit: 10 },
        setIsLoading,
        (error) => setError(error)
      );
      if (response && response.success) {
        setLikes(response.data.likes);
      }
    } catch (error) {
      setError('Failed to load likes');
    }
  };

  const toggleComments = async () => {
    if (!showComments) {
      await loadComments();
    }
    setShowComments(!showComments);
  };

  const toggleLikes = async () => {
    if (!showLikes) {
      await loadLikes();
    }
    setShowLikes(!showLikes);
  };

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  const handleUserClick = (userId) => {
    navigate(`/dashboard/profile?userId=${userId}`);
  };

  const handlePageClick = (pageId) => {
    navigate(`/dashboard/pages/details/${pageId}`);
  };

  if (isLoading) {
    return (
      <div className="feed-details-loading">
        <div className="feed-details-spinner"></div>
        <p>Loading feed details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-details-error">
        <p>{error}</p>
        <button onClick={fetchFeedDetails}>Try Again</button>
      </div>
    );
  }

  if (!feed) {
    return (
      <div className="feed-details-error">
        <p>Feed not found</p>
        <button onClick={() => navigate('/dashboard')}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="feed-details-container">
      <div className="feed-details-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>Feed Details</h1>
      </div>

      <div className="feed-details-content">
        <div className="feed-details-user-info">
          <img 
            src={feed.User?.UserProfile?.profileUrl 
              ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${feed.User.UserProfile.profileUrl}` 
              : '/assets/Utils/male.png'} 
            alt={feed.User?.name} 
            className="feed-details-avatar"
            onClick={() => handleUserClick(feed.User?.id)}
            style={{ cursor: 'pointer' }}
          />
          <div className="feed-details-user-details">
            <h2 
              onClick={() => handleUserClick(feed.User?.id)}
              style={{ cursor: 'pointer' }}
            >
              {feed.User?.name}
            </h2>
            <p>{feed.User?.UserProfile?.title}</p>
            <span className="feed-details-time">
              {new Date(feed.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div 
          className={`feed-details-text ${!isExpanded ? 'feed-text-collapsed' : ''} ${!isExpanded && contentHeight > 222 ? 'has-gradient' : ''}`}
          dangerouslySetInnerHTML={{ __html: feed.feedData.content }}
          ref={el => {
            if (el) {
              setContentHeight(el.scrollHeight);
            }
          }}
        />
        {contentHeight > 222 && (
          <button 
            className="feed-show-more-btn"
            onClick={toggleContent}
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}

        {feed.feedData.imageUrl && (
          <div className="feed-details-image">
            <img 
              src={`${process.env.REACT_APP_REMOTE_ADDRESS}/${feed.feedData.imageUrl}`} 
              alt="Feed content" 
              className="feed-details-image-content"
            />
          </div>
        )}

        <div className="feed-details-stats">
          <div 
            className="feed-details-likes-count" 
            onClick={toggleLikes}
            style={{ cursor: 'pointer' }}
          >
            <span className="feed-icon">👍</span>
            <span>{feed.like} Likes</span>
          </div>
          <div 
            className="feed-details-comments-count"
            onClick={toggleComments}
            style={{ cursor: 'pointer', marginLeft: 'auto' }}
          >
            <span>{feed.comments} Comments</span>
          </div>
        </div>

        {renderActionButtons(feed, handleLike, toggleComments, handleShare)}

        {showComments && (
          <div className="feed-details-comments">
            <div className="feed-details-comments-list">
              {comments.map(comment => (
                <div key={comment.id} className="feed-details-comment">
                  <div className="feed-details-comment-user">
                    <img 
                      src={comment.User?.UserProfile?.profileUrl 
                        ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${comment.User.UserProfile.profileUrl}` 
                        : '/assets/Utils/male.png'} 
                      alt={comment.User?.name} 
                      className="feed-details-comment-avatar"
                      onClick={() => handleUserClick(comment.User?.id)}
                      style={{ cursor: 'pointer' }}
                    />
                    <div className="feed-details-comment-content">
                      <h4 
                        onClick={() => handleUserClick(comment.User?.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {comment.User?.name}
                      </h4>
                      <p>{comment.comment}</p>
                      <span className="feed-details-comment-time">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="feed-details-add-comment">
              <textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="feed-details-comment-input"
                rows="2"
              />
              <button 
                className="feed-details-comment-submit"
                onClick={handleComment}
                disabled={!commentText.trim()}
              >
                Post
              </button>
            </div>
          </div>
        )}

        {showLikes && (
          <div className="feed-details-likes">
            <h3>Likes</h3>
            <div className="feed-details-likes-list">
              {likes.map(like => (
                <div key={like.id} className="feed-details-like">
                  <img 
                    src={like.User?.UserProfile?.profileUrl 
                      ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${like.User.UserProfile.profileUrl}` 
                      : '/assets/Utils/male.png'} 
                    alt={like.User?.name} 
                    className="feed-details-like-avatar"
                    onClick={() => handleUserClick(like.User?.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  <div className="feed-details-like-info">
                    <h4 
                      onClick={() => handleUserClick(like.User?.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {like.User?.name}
                    </h4>
                    <p>{like.User?.UserProfile?.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

