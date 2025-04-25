import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFeedByIdHandler } from "../Feed/feedApiHandler";
import { toggleLikeHandler, getFeedLikesHandler } from "../Feed/likeApiHandler";
import {
  createCommentHandler,
  getFeedCommentsHandler,
} from "../Feed/commentApiHandler";
import { handleShare, renderActionButtons } from "../Feed/feedUtils";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./FeedDetails.css";

export const FeedDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feed, setFeed] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [showLikes, setShowLikes] = useState(false);
  const [selectedImagePopup, setSelectedImagePopup] = useState(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imagePopupRef = useRef(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchFeedDetails();
  }, [id]);

  const fetchFeedDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getFeedByIdHandler({ id }, setIsLoading, (error) =>
        setError(error)
      );
      if (response && response.success) {
        const data = response.data;
        console.log(response.data.feedData.imagesUrl);
        data.feedData.imagesUrl =
  data.feedData.imagesUrl
    ? data.feedData.imagesUrl
    : data.feedData.imageUrl
    ? [data.feedData.imageUrl]
    : [];


        console.log(data.feedData.imagesUrl);
        setFeed(data);
        //console.log(data);
      }
    } catch (error) {
      setError("Failed to fetch feed details");
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
        setFeed((prev) => ({
          ...prev,
          isLiked: response.data.isLiked,
          like: response.data.likes,
        }));
      }
    } catch (error) {
      setError("Failed to update like status");
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
        setCommentText("");
        await loadComments();
        setFeed((prev) => ({
          ...prev,
          comments: (prev.comments || 0) + 1,
        }));
      }
    } catch (error) {
      setError("Failed to add comment");
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
      setError("Failed to load comments");
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
      setError("Failed to load likes");
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

  const handleUserClick = (userId) => {
    navigate(`/dashboard/profile?userId=${userId}`);
  };

  const handlePageClick = (pageId) => {
    navigate(`/dashboard/pages/details/${pageId}`);
  };

  const handleImageClick = (images, index) => {
    setSelectedImagePopup(images);
    setCurrentImageIndex(index);
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleClosePopup = (e) => {
    if (
      e.target === imagePopupRef.current ||
      e.target.closest(".feed-details-image-close-btn")
    ) {
      setSelectedImagePopup(null);
      setImageZoom(1);
      setImagePosition({ x: 0, y: 0 });
      setCurrentImageIndex(0);
    }
  };

  const handleZoomIn = () => {
    setImageZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setImageZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleMouseDown = (e) => {
    if (imageZoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && imageZoom > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedImagePopup.length - 1 : prev - 1
    );
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === selectedImagePopup.length - 1 ? 0 : prev + 1
    );
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleKeyDown = (e) => {
    if (selectedImagePopup) {
      if (e.key === "ArrowLeft") {
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      } else if (e.key === "Escape") {
        setSelectedImagePopup(null);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImagePopup]);

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
        <button onClick={() => navigate("/dashboard")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="feed-details-container">
      <div className="feed-details-content">
        <div className="feed-details-user-info">
          <img
            src={
              feed.User?.UserProfile?.profileUrl
                ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${feed.User.UserProfile.profileUrl}`
                : "/assets/Utils/male.png"
            }
            alt={feed.User?.name}
            className="feed-details-avatar"
            onClick={() => handleUserClick(feed.User?.id)}
            style={{ cursor: "pointer" }}
          />
          <div className="feed-details-user-details">
            <div className="feed-name-container">
              <h2
                onClick={() => handleUserClick(feed.User?.id)}
                style={{ cursor: "pointer" }}
              >
                {feed.User?.name}
              </h2>
              {feed.Page && (
                <span
                  className="feed-page-name"
                  onClick={() => handlePageClick(feed.Page.id)}
                  style={{ cursor: "pointer" }}
                >
                  - {feed.Page.title}
                </span>
              )}
            </div>
            <p>{feed.User?.UserProfile?.title}</p>
            <span className="feed-details-time">
              {new Date(feed.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div
          className="feed-details-text"
          dangerouslySetInnerHTML={{ __html: feed.feedData.content }}
        />

        {feed.feedData.imagesUrl && feed.feedData.imagesUrl.length > 0 && (
          <div className="feed-details-images">
            {feed.feedData.imagesUrl.length === 1 ? (
              <div className="feed-details-single-image">
                <img
                  src={`${process.env.REACT_APP_REMOTE_ADDRESS}/${feed.feedData.imagesUrl[0]}`}
                  alt="Post content"
                  onClick={() =>
                    handleImageClick(
                      feed.feedData.imagesUrl.map(
                        (url) =>
                          `${process.env.REACT_APP_REMOTE_ADDRESS}/${url}`
                      ),
                      0
                    )
                  }
                  className="feed-details-image-content"
                />
              </div>
            ) : feed.feedData.imagesUrl.length === 2 ? (
              <div className="feed-details-two-images">
                {feed.feedData.imagesUrl.map((image, index) => (
                  <div key={index} className="feed-details-image-half">
                    <img
                      src={`${process.env.REACT_APP_REMOTE_ADDRESS}/${image}`}
                      alt={`Post content ${index + 1}`}
                      onClick={() =>
                        handleImageClick(
                          feed.feedData.imagesUrl.map(
                            (url) =>
                              `${process.env.REACT_APP_REMOTE_ADDRESS}/${url}`
                          ),
                          index
                        )
                      }
                      className="feed-details-image-content"
                    />
                  </div>
                ))}
              </div>
            ) : feed.feedData.imagesUrl.length === 3 ? (
              <div className="feed-details-three-images">
                <div className="feed-details-three-main">
                  <img
                    src={`${process.env.REACT_APP_REMOTE_ADDRESS}/${feed.feedData.imagesUrl[0]}`}
                    alt="Post content 1"
                    onClick={() =>
                      handleImageClick(
                        feed.feedData.imagesUrl.map(
                          (url) =>
                            `${process.env.REACT_APP_REMOTE_ADDRESS}/${url}`
                        ),
                        0
                      )
                    }
                    className="feed-details-image-content"
                  />
                </div>
                <div className="feed-details-three-bottom">
                  {feed.feedData.imagesUrl.slice(1, 3).map((image, index) => (
                    <div key={index} className="feed-details-image-half">
                      <img
                        src={`${process.env.REACT_APP_REMOTE_ADDRESS}/${image}`}
                        alt={`Post content ${index + 2}`}
                        onClick={() =>
                          handleImageClick(
                            feed.feedData.imagesUrl.map(
                              (url) =>
                                `${process.env.REACT_APP_REMOTE_ADDRESS}/${url}`
                            ),
                            index + 1
                          )
                        }
                        className="feed-details-image-content"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="feed-details-multiple-images">
                <div className="feed-details-multiple-main">
                  <img
                    src={`${process.env.REACT_APP_REMOTE_ADDRESS}/${feed.feedData.imagesUrl[0]}`}
                    alt="Post content 1"
                    onClick={() =>
                      handleImageClick(
                        feed.feedData.imagesUrl.map(
                          (url) =>
                            `${process.env.REACT_APP_REMOTE_ADDRESS}/${url}`
                        ),
                        0
                      )
                    }
                    className="feed-details-image-content"
                  />
                </div>
                <div className="feed-details-multiple-bottom">
                  {feed.feedData.imagesUrl.slice(1, 3).map((image, index) => (
                    <div key={index} className="feed-details-image-half">
                      <img
                        src={`${process.env.REACT_APP_REMOTE_ADDRESS}/${image}`}
                        alt={`Post content ${index + 2}`}
                        onClick={() =>
                          handleImageClick(
                            feed.feedData.imagesUrl.map(
                              (url) =>
                                `${process.env.REACT_APP_REMOTE_ADDRESS}/${url}`
                            ),
                            index + 1
                          )
                        }
                        className="feed-details-image-content"
                      />
                      {index === 1 && feed.feedData.imagesUrl.length > 3 && (
                        <div
                          className="feed-details-more-images-overlay"
                          onClick={() =>
                            handleImageClick(
                              feed.feedData.imagesUrl.map(
                                (url) =>
                                  `${process.env.REACT_APP_REMOTE_ADDRESS}/${url}`
                              ),
                              3
                            )
                          }
                        >
                          +{feed.feedData.imagesUrl.length - 3}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="feed-details-stats">
          <div
            className="feed-details-likes-count"
            onClick={toggleLikes}
            style={{ cursor: "pointer" }}
          >
            <span className="feed-icon">👍</span>
            <span>{feed.like} Likes</span>
          </div>
          <div
            className="feed-details-comments-count"
            onClick={toggleComments}
            style={{ cursor: "pointer", marginLeft: "auto" }}
          >
            <span>{feed.comments} Comments</span>
          </div>
        </div>

        {renderActionButtons(feed, handleLike, toggleComments, handleShare)}

        {showComments && (
          <div className="feed-details-comments">
            <div className="feed-details-comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="feed-details-comment">
                  <div className="feed-details-comment-user">
                    <img
                      src={
                        comment.User?.UserProfile?.profileUrl
                          ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${comment.User.UserProfile.profileUrl}`
                          : "/assets/Utils/male.png"
                      }
                      alt={comment.User?.name}
                      className="feed-details-comment-avatar"
                      onClick={() => handleUserClick(comment.User?.id)}
                      style={{ cursor: "pointer" }}
                    />
                    <div className="feed-details-comment-content">
                      <h4
                        onClick={() => handleUserClick(comment.User?.id)}
                        style={{ cursor: "pointer" }}
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
              {likes.map((like) => (
                <div key={like.id} className="feed-details-like">
                  <img
                    src={
                      like.User?.UserProfile?.profileUrl
                        ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${like.User.UserProfile.profileUrl}`
                        : "/assets/Utils/male.png"
                    }
                    alt={like.User?.name}
                    className="feed-details-like-avatar"
                    onClick={() => handleUserClick(like.User?.id)}
                    style={{ cursor: "pointer" }}
                  />
                  <div className="feed-details-like-info">
                    <h4
                      onClick={() => handleUserClick(like.User?.id)}
                      style={{ cursor: "pointer" }}
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

      {selectedImagePopup && (
        <div
          className="feed-details-image-popup"
          ref={imagePopupRef}
          onClick={handleClosePopup}
        >
          <div className="feed-details-image-popup-content">
            <button
              className="feed-details-image-close-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleClosePopup(e);
              }}
            >
              ×
            </button>
            <button
              className="feed-details-image-nav-btn feed-details-image-prev-btn"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
            >
              ←
            </button>
            <button
              className="feed-details-image-nav-btn feed-details-image-next-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
            >
              →
            </button>
            <div className="feed-details-image-popup-counter">
              {currentImageIndex + 1} / {selectedImagePopup.length}
            </div>
            <img
              src={selectedImagePopup[currentImageIndex]}
              alt="Full size"
              style={{
                transform: `scale(${imageZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                cursor: imageZoom > 1 ? "move" : "default",
              }}
              className="feed-details-image-popup-img"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            />
          </div>
        </div>
      )}
    </div>
  );
};
