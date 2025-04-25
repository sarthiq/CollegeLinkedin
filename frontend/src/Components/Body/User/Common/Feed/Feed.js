import React, { useState, useRef, useEffect } from "react";
import {
  getAllFeedsHandler,
  createFeedHandler,
  deleteFeedHandler,
  updateFeedHandler,
} from "./feedApiHandler";
import {
  toggleLikeHandler,
  getLikeStatusHandler,
  getFeedLikesHandler,
} from "./likeApiHandler";
import {
  createCommentHandler,
  updateCommentHandler,
  deleteCommentHandler,
  getFeedCommentsHandler,
} from "./commentApiHandler";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Feed.css";
import { handleShare as shareFeed } from "./feedUtils";

export const Feed = ({
  pageId = null,
  usersFeed = false,
  othersUserId = null,
  showCreatePost = true,
}) => {
  const [feeds, setFeeds] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const fileInputRef = useRef(null);
  const [expandedFeeds, setExpandedFeeds] = useState(new Set());
  const [editingFeedId, setEditingFeedId] = useState(null);
  const [menuOpenFeedId, setMenuOpenFeedId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editImages, setEditImages] = useState([]);
  const [editImageFiles, setEditImageFiles] = useState([]);
  const editFileInputRef = useRef(null);
  const [selectedImagePopup, setSelectedImagePopup] = useState(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imagePopupRef = useRef(null);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [showLikes, setShowLikes] = useState(null);
  const [showComments, setShowComments] = useState(null);
  const [likesList, setLikesList] = useState({});
  const [commentsList, setCommentsList] = useState({});
  const [likesPagination, setLikesPagination] = useState({});
  const [commentsPagination, setCommentsPagination] = useState({});
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const [contentHeights, setContentHeights] = useState({});

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "link",
  ];

  // Fetch feeds on component mount and when pageId or pagination changes
  useEffect(() => {
    fetchFeeds();
  }, [pageId, pagination.currentPage]);

  // Prevent background scrolling when popup is open
  useEffect(() => {
    if (selectedImagePopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedImagePopup]);

  // Add this effect to measure content heights
  useEffect(() => {
    const measureHeights = () => {
      const heights = {};
      feeds.forEach((feed) => {
        const element = document.getElementById(`feed-content-${feed.id}`);
        if (element) {
          heights[feed.id] = element.scrollHeight;
        }
      });
      setContentHeights(heights);
    };

    // Measure heights after content is rendered
    measureHeights();

    // Re-measure when window is resized
    window.addEventListener("resize", measureHeights);
    return () => window.removeEventListener("resize", measureHeights);
  }, [feeds]);

  const fetchFeeds = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllFeedsHandler(
        {
          page: pagination.currentPage,
          limit: pagination.limit,
          pageId: pageId,
          usersFeed: usersFeed,
          userId: othersUserId,
        },
        setIsLoading,
        (error) => setError(error)
      );

      if (response && response.success) {
        const { feeds, pagination: paginationData } = response.data;

        // Set the userId from the response
        setUserId(response.data.userId);

        // Transform the feeds data to match our component's structure
        const transformedFeeds = feeds.map((feed) => {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = feed.feedData.content || "";
          const textContentLength = tempDiv.textContent.length;

          return {
            id: feed.id,
            user: {
              id: feed.User?.id,
              name: feed.User?.name || "Anonymous",
              avatar: feed.User?.UserProfile?.profileUrl
                ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${feed.User.UserProfile.profileUrl}`
                : "/assets/Utils/male.png",
              title: feed.User?.UserProfile?.title || "",
            },
            content: feed.feedData.content || "",
            images: feed.feedData.imagesUrl
              ? feed.feedData.imagesUrl.map(
                  (url) => `${process.env.REACT_APP_REMOTE_ADDRESS}/${url}`
                )
              : [],
            like: feed.like || 0,
            comments: feed.comments || 0,
            timestamp: new Date(feed.createdAt).toLocaleDateString(),
            showComments: false,
            pageInfo: feed.Page,
            isLiked: feed.isLiked,
            contentLength: textContentLength,
          };
        });

        setFeeds(transformedFeeds);
        setPagination(paginationData);

        // Scroll to top after content is loaded
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }, 100);
      }
    } catch (error) {
      setError("Failed to fetch feeds");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return {
          file,
          preview: URL.createObjectURL(file),
        };
      });
      setSelectedImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPost.trim() || selectedImages.length > 0) {
      setIsPosting(true);
      setError(null);

      const formData = new FormData();
      formData.append("feedData", JSON.stringify({ content: newPost }));

      if (selectedImages.length > 0) {
        selectedImages.forEach((image, index) => {
          formData.append("image", image.file);
        });
      }

      if (pageId) {
        formData.append("pageId", pageId);
      }

      const response = await createFeedHandler(
        formData,
        setIsPosting,
        (error) => setError(error)
      );

      if (response && response.success) {
        setNewPost("");
        setSelectedImages([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        fetchFeeds();
      }
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleLike = async (feedId) => {
    const response = await toggleLikeHandler(
      { feedId },
      setIsLoading,
      (error) => setError(error)
    );

    if (response && response.success) {
      setFeeds(
        feeds.map((feed) =>
          feed.id === feedId
            ? {
                ...feed,
                likesCount: response.data.likes,
                isLiked: response.data.isLiked,
              }
            : feed
        )
      );
    }
  };

  const handleComment = async (feedId, commentText) => {
    if (!commentText.trim()) return;

    const response = await createCommentHandler(
      { feedId, comment: commentText },
      setIsLoading,
      (error) => setError(error)
    );

    if (response && response.success) {
      setFeeds(
        feeds.map((feed) =>
          feed.id === feedId
            ? {
                ...feed,
                commentsCount: (feed.commentsCount || 0) + 1,
              }
            : feed
        )
      );
      setCommentText("");
      // Refresh comments list
      await loadFeedComments(feedId);
    }
  };

  const handleUpdateComment = async (feedId, commentId, newText) => {
    if (!newText.trim()) return;

    const response = await updateCommentHandler(
      { id: commentId, comment: newText },
      setIsLoading,
      (error) => setError(error)
    );

    if (response && response.success) {
      await loadFeedComments(feedId);
      setEditingCommentId(null);
      setEditingCommentText("");
    }
  };

  const handleDeleteComment = async (feedId, commentId) => {
    const response = await deleteCommentHandler(
      { id: commentId },
      setIsLoading,
      (error) => setError(error)
    );

    if (response && response.success) {
      setFeeds(
        feeds.map((feed) =>
          feed.id === feedId
            ? {
                ...feed,
                commentsCount: (feed.commentsCount || 0) - 1,
              }
            : feed
        )
      );
      await loadFeedComments(feedId);
    }
  };

  const loadFeedLikes = async (feedId, page = 1) => {
    const response = await getFeedLikesHandler(
      { feedId, page, limit: 10 },
      setIsLoading,
      (error) => setError(error)
    );

    if (response && response.success) {
      setLikesList((prev) => ({
        ...prev,
        [feedId]: response.data.likes,
      }));
      setLikesPagination((prev) => ({
        ...prev,
        [feedId]: response.data.pagination,
      }));
    }
  };

  const loadFeedComments = async (feedId, page = 1) => {
    const response = await getFeedCommentsHandler(
      { feedId, page, limit: 10 },
      setIsLoading,
      (error) => setError(error)
    );

    if (response && response.success) {
      setCommentsList((prev) => ({
        ...prev,
        [feedId]: response.data.comments,
      }));
      setCommentsPagination((prev) => ({
        ...prev,
        [feedId]: response.data.pagination,
      }));
    }
  };

  const toggleComments = async (feedId) => {
    if (showComments === feedId) {
      setShowComments(null);
    } else {
      setShowComments(feedId);
      if (!commentsList[feedId]) {
        await loadFeedComments(feedId);
      }
    }
  };

  const toggleLikes = async (feedId) => {
    if (showLikes === feedId) {
      setShowLikes(null);
    } else {
      setShowLikes(feedId);
      if (!likesList[feedId]) {
        await loadFeedLikes(feedId);
      }
    }
  };

  const toggleFeedContent = (feedId) => {
    setExpandedFeeds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(feedId)) {
        newSet.delete(feedId);
      } else {
        newSet.add(feedId);
      }
      return newSet;
    });
  };

  const handleDeleteFeed = async (feedId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const response = await deleteFeedHandler(
        { id: feedId },
        setIsLoading,
        (error) => setError(error)
      );
      if (response && response.success) {
        setFeeds(feeds.filter((feed) => feed.id !== feedId));
      }
    }
  };

  const handleMenuClick = (feedId) => {
    setMenuOpenFeedId(menuOpenFeedId === feedId ? null : feedId);
  };

  const handleEditClick = (feed) => {
    console.log('Edit clicked, feed images:', feed.images);
    setEditingFeedId(feed.id);
    setEditContent(feed.content);
    setEditImages(feed.images || []);
    setEditImageFiles([]);
  };

  const handleEditImageUpload = (e) => {
    const files = Array.from(e.target.files);
    console.log('Files selected:', files);
    if (files.length > 0) {
      const newImages = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      console.log('New images to add:', newImages);
      setEditImageFiles((prev) => [...prev, ...newImages]);
    }
  };

  const removeEditImage = (index, isExistingImage) => {
    console.log('Removing image:', { index, isExistingImage });
    console.log('Current editImages:', editImages);
    console.log('Current editImageFiles:', editImageFiles);

    if (isExistingImage) {
      const newImages = [...editImages];
      newImages.splice(index, 1);
      setEditImages(newImages);
    } else {
      const newFiles = [...editImageFiles];
      if (newFiles[index] && newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);
      setEditImageFiles(newFiles);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (
      editContent.trim() ||
      editImages.length > 0 ||
      editImageFiles.length > 0
    ) {
      setIsPosting(true);
      setError(null);

      const formData = new FormData();
      formData.append("id", editingFeedId);
      formData.append("feedData", JSON.stringify({ content: editContent }));

      // Append existing images that weren't removed
      editImages.forEach((image) => {
        formData.append("existingImages", image);
      });

      // Append new image files
      editImageFiles.forEach((image) => {
        formData.append("image", image.file);
      });

      const response = await updateFeedHandler(
        formData,
        setIsPosting,
        (error) => setError(error)
      );
      if (response.success) {
        setEditingFeedId(null);
        setEditContent("");
        setEditImages([]);
        setEditImageFiles([]);
        if (editFileInputRef.current) {
          editFileInputRef.current.value = "";
        }
        fetchFeeds();
      }
    }
  };

  const handleImageClick = (images, index) => {
    setSelectedImagePopup(images);
    setCurrentImageIndex(index);
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleClosePopup = (e) => {
    // Only close if clicking the overlay or the close button
    if (
      e.target === imagePopupRef.current ||
      e.target.closest(".feed-image-close-btn")
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

  const handleUserClick = (userId) => {
    navigate(`/dashboard/profile?userId=${userId}`);
  };

  const handlePageClick = (pageId) => {
    navigate(`/dashboard/pages/details/${pageId}`);
  };

  // Add this function to check content length without HTML tags
  const getTextContentLength = (htmlContent) => {
    if (!htmlContent) return 0;
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    // Get text content and count characters
    return tempDiv.textContent.length;
  };

  const handleShare = (feedId) => {
    shareFeed(feedId);
    navigate(`/dashboard/feed/${feedId}`);
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

  return (
    <div className="feed-container">
      {showCreatePost && (
        <div className="feed-create-post">
          <div className="feed-post-creator">
            <div className="feed-input-wrapper">
              <form onSubmit={handleSubmit}>
                <ReactQuill
                  theme="snow"
                  value={newPost}
                  onChange={setNewPost}
                  modules={modules}
                  formats={formats}
                  placeholder="Share your thoughts..."
                  className="feed-post-input"
                />
                {selectedImages.length > 0 && (
                  <div className="feed-image-preview">
                    {selectedImages.map((image, index) => (
                      <img
                        key={index}
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        onClick={() => removeImage(index)}
                        className="feed-image-preview-item"
                      />
                    ))}
                  </div>
                )}
                <div className="feed-post-footer">
                  <label className="feed-upload-btn">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      multiple
                      style={{ display: "none" }}
                    />
                    <svg viewBox="0 0 24 24" width="22" height="22">
                      <path
                        fill="currentColor"
                        d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z"
                      />
                    </svg>
                    <span>Photos</span>
                  </label>
                  <button
                    type="submit"
                    className="feed-submit-btn"
                    disabled={
                      isPosting ||
                      (!newPost.trim() && selectedImages.length === 0)
                    }
                  >
                    {isPosting ? "Posting..." : "Post"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="feed-error-message">
          <p>{error}</p>
          <button onClick={fetchFeeds}>Try Again</button>
        </div>
      )}

      {isLoading && feeds.length === 0 ? (
        <div className="feed-loading-container">
          <div className="feed-spinner"></div>
          <p>Loading feeds...</p>
        </div>
      ) : feeds.length === 0 ? (
        <div className="feed-loading-container">
          <p>No feeds to display</p>
        </div>
      ) : (
        <>
          <div className="feeds-list">
            {feeds.map((feed) => (
              <div key={feed.id} className="feed-item">
                <div className="feed-item-header">
                  <div className="feed-user-info">
                    <img
                      src={feed.user.avatar}
                      alt={feed.user.name}
                      className="feed-user-avatar"
                      onClick={() => handleUserClick(feed.user.id)}
                      style={{ cursor: "pointer" }}
                    />
                    <div className="feed-user-details">
                      <div className="feed-name-container">
                        <span
                          className="feed-user-name"
                          onClick={() => handleUserClick(feed.user.id)}
                        >
                          {feed.user.name}
                        </span>
                        {feed.pageInfo && (
                          <span
                            className="feed-page-name"
                            onClick={() => handlePageClick(feed.pageInfo.id)}
                          >
                            - {feed.pageInfo.title}
                          </span>
                        )}
                      </div>
                      <span className="feed-user-title">{feed.user.title}</span>
                      <span className="feed-post-time">{feed.timestamp}</span>
                    </div>
                  </div>
                  {userId === feed.user.id && (
                    <div className="feed-actions-menu">
                      <button
                        className="feed-menu-button"
                        onClick={() => handleMenuClick(feed.id)}
                      >
                        <span>⋮</span>
                      </button>
                      {menuOpenFeedId === feed.id && (
                        <div className="feed-menu-dropdown">
                          <button onClick={() => handleEditClick(feed)}>
                            Edit
                          </button>
                          <button onClick={() => handleDeleteFeed(feed.id)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="feed-item-content">
                  {editingFeedId === feed.id ? (
                    <div className="feed-edit-form">
                      <div className="feed-input-wrapper">
                        <form onSubmit={handleEditSubmit}>
                          <ReactQuill
                            theme="snow"
                            value={editContent}
                            onChange={setEditContent}
                            modules={modules}
                            formats={formats}
                            placeholder="Edit your post..."
                            className="feed-post-input"
                          />
                          {(editImages.length > 0 || editImageFiles.length > 0) && (
                            <div className="feed-image-preview">
                              {editImages.map((image, index) => (
                                <div
                                  key={`existing-${index}`}
                                  className="feed-image-preview-item"
                                  style={{ position: 'relative' }}
                                >
                                  <img
                                    src={image}
                                    alt={`Preview ${index + 1}`}
                                    className="feed-preview-image"
                                  />
                                  <button
                                    type="button"
                                    className="feed-remove-image-btn"
                                    style={{
                                      position: 'absolute',
                                      top: '5px',
                                      right: '5px',
                                      background: 'rgba(0, 0, 0, 0.5)',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '50%',
                                      width: '24px',
                                      height: '24px',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      zIndex: 10
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      removeEditImage(index, true);
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                              {editImageFiles.map((image, index) => (
                                <div
                                  key={`new-${index}`}
                                  className="feed-image-preview-item"
                                  style={{ position: 'relative' }}
                                >
                                  <img
                                    src={image.preview}
                                    alt={`Preview ${index + 1}`}
                                    className="feed-preview-image"
                                  />
                                  <button
                                    type="button"
                                    className="feed-remove-image-btn"
                                    style={{
                                      position: 'absolute',
                                      top: '5px',
                                      right: '5px',
                                      background: 'rgba(0, 0, 0, 0.5)',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '50%',
                                      width: '24px',
                                      height: '24px',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      zIndex: 10
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      removeEditImage(index, false);
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="feed-post-footer">
                            <label className="feed-upload-btn">
                              <input
                                type="file"
                                ref={editFileInputRef}
                                onChange={handleEditImageUpload}
                                accept="image/*"
                                multiple
                                style={{ display: "none" }}
                              />
                              <svg viewBox="0 0 24 24" width="22" height="22">
                                <path fill="currentColor" d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z"/>
                              </svg>
                              <span>Photos</span>
                            </label>
                            <div className="feed-edit-buttons">
                              <button
                                type="button"
                                className="feed-cancel-btn"
                                onClick={() => {
                                  setEditingFeedId(null);
                                  setEditContent("");
                                  setEditImages([]);
                                  setEditImageFiles([]);
                                  if (editFileInputRef.current) {
                                    editFileInputRef.current.value = "";
                                  }
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="feed-submit-btn"
                                disabled={
                                  isPosting ||
                                  (!editContent.trim() &&
                                    editImages.length === 0 &&
                                    editImageFiles.length === 0)
                                }
                              >
                                {isPosting ? "Updating..." : "Update"}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div 
                        id={`feed-content-${feed.id}`}
                        className={`feed-item-text ${!expandedFeeds.has(feed.id) ? 'feed-text-collapsed' : ''} ${!expandedFeeds.has(feed.id) && contentHeights[feed.id] > 192 ? 'has-gradient' : ''}`}
                      >
                        <div dangerouslySetInnerHTML={{ __html: feed.content }} />
                      </div>
                      {contentHeights[feed.id] > 222 && (
                        <button 
                          className="feed-show-more-btn"
                          onClick={() => toggleFeedContent(feed.id)}
                        >
                          {expandedFeeds.has(feed.id) ? 'Show less' : 'Show more'}
                        </button>
                      )}
                      {feed.images.length > 0 && (
                        <div className="feed-item-images">
                          {feed.images.length === 1 ? (
                            <div className="feed-single-image">
                              <img
                                src={feed.images[0]}
                                alt="Post content"
                                onClick={() => handleImageClick(feed.images, 0)}
                                className="feed-item-thumbnail"
                              />
                            </div>
                          ) : feed.images.length === 2 ? (
                            <div className="feed-two-images">
                              {feed.images.map((image, index) => (
                                <div key={index} className="feed-image-half">
                                  <img
                                    src={image}
                                    alt={`Post content ${index + 1}`}
                                    onClick={() => handleImageClick(feed.images, index)}
                                    className="feed-item-thumbnail"
                                  />
                                </div>
                              ))}
                            </div>
                          ) : feed.images.length === 3 ? (
                            <div className="feed-three-images">
                              <div className="feed-three-main">
                                <img
                                  src={feed.images[0]}
                                  alt="Post content 1"
                                  onClick={() => handleImageClick(feed.images, 0)}
                                  className="feed-item-thumbnail"
                                />
                              </div>
                              <div className="feed-three-bottom">
                                {feed.images.slice(1, 3).map((image, index) => (
                                  <div key={index} className="feed-image-half">
                                    <img
                                      src={image}
                                      alt={`Post content ${index + 2}`}
                                      onClick={() => handleImageClick(feed.images, index + 1)}
                                      className="feed-item-thumbnail"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="feed-multiple-images">
                              <div className="feed-multiple-main">
                                <img
                                  src={feed.images[0]}
                                  alt="Post content 1"
                                  onClick={() => handleImageClick(feed.images, 0)}
                                  className="feed-item-thumbnail"
                                />
                              </div>
                              <div className="feed-multiple-bottom">
                                {feed.images.slice(1, 3).map((image, index) => (
                                  <div key={index} className="feed-image-half">
                                    <img
                                      src={image}
                                      alt={`Post content ${index + 2}`}
                                      onClick={() => handleImageClick(feed.images, index + 1)}
                                      className="feed-item-thumbnail"
                                    />
                                    {index === 1 && feed.images.length > 3 && (
                                      <div
                                        className="feed-more-images-overlay"
                                        onClick={() => handleImageClick(feed.images, 3)}
                                      >
                                        +{feed.images.length - 3}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="feed-item-stats">
                  <div
                    className="feed-likes-count"
                    onClick={() => toggleLikes(feed.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="feed-icon">👍</span>
                    <span>{feed.like} Likes</span>
                  </div>
                  <div className="feed-comments-count">
                    <span>{feed.comments} Comments</span>
                  </div>
                </div>

                <div className="feed-item-actions">
                  <button
                    className={`feed-action-button ${
                      feed.isLiked ? "liked" : ""
                    }`}
                    onClick={() => handleLike(feed.id)}
                  >
                    <span className="feed-icon">👍</span>
                    <span className="feed-action-text">
                      {feed.isLiked ? "Liked" : "Like"}
                    </span>
                  </button>
                  <button
                    className="feed-action-button"
                    onClick={() => toggleComments(feed.id)}
                  >
                    <span className="feed-icon">💬</span>
                    <span className="feed-action-text">Comment</span>
                  </button>
                  <button
                    className="feed-action-button"
                    onClick={() => handleShare(feed.id)}
                  >
                    <span className="feed-icon">↗️</span>
                    <span className="feed-action-text">Share</span>
                  </button>
                </div>

                {showComments === feed.id && (
                  <div className="feed-comments-section">
                    <div className="feed-comments-header">
                      <h4>Comments ({feed.comments})</h4>
                    </div>

                    <div className="feed-comments-list">
                      {commentsList[feed.id]?.map((comment) => (
                        <div key={comment.id} className="feed-comment-item">
                          <div className="feed-comment-user">
                            <img
                              src={
                                comment.User?.UserProfile?.profileUrl
                                  ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${comment.User.UserProfile.profileUrl}`
                                  : "/assets/Utils/male.png"
                              }
                              alt={comment.User?.name}
                              className="feed-comment-avatar"
                            />
                            <div className="feed-comment-user-info">
                              <span className="feed-comment-username">
                                {comment.User?.name}
                              </span>
                              <span className="feed-comment-time">
                                {new Date(
                                  comment.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="feed-comment-content">
                            {editingCommentId === comment.id ? (
                              <div className="feed-comment-edit">
                                <textarea
                                  value={editingCommentText}
                                  onChange={(e) =>
                                    setEditingCommentText(e.target.value)
                                  }
                                  className="feed-comment-edit-input"
                                  rows="2"
                                />
                                <div className="feed-comment-edit-actions">
                                  <button
                                    className="feed-comment-save-btn"
                                    onClick={() =>
                                      handleUpdateComment(
                                        feed.id,
                                        comment.id,
                                        editingCommentText
                                      )
                                    }
                                  >
                                    Save
                                  </button>
                                  <button
                                    className="feed-comment-cancel-btn"
                                    onClick={() => {
                                      setEditingCommentId(null);
                                      setEditingCommentText("");
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="feed-comment-text">
                                {comment.comment}
                              </p>
                            )}
                          </div>

                          {comment.User?.id === userId && !editingCommentId && (
                            <div className="feed-comment-actions">
                              <button
                                className="feed-comment-edit-btn"
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditingCommentText(comment.comment);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="feed-comment-delete-btn"
                                onClick={() =>
                                  handleDeleteComment(feed.id, comment.id)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {commentsPagination[feed.id]?.hasNextPage && (
                      <button
                        className="feed-comments-load-more"
                        onClick={() =>
                          loadFeedComments(
                            feed.id,
                            commentsPagination[feed.id].currentPage + 1
                          )
                        }
                      >
                        Load More Comments
                      </button>
                    )}

                    <div className="feed-add-comment">
                      <img
                        src={feed.user.avatar}
                        alt="User"
                        className="feed-add-comment-avatar"
                      />
                      <div className="feed-add-comment-input-wrapper">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleComment(feed.id, commentText);
                            }
                          }}
                          className="feed-add-comment-input"
                        />
                        {commentText && (
                          <button
                            className="feed-add-comment-submit"
                            onClick={() => handleComment(feed.id, commentText)}
                          >
                            Post
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {showLikes === feed.id && (
                  <div className="feed-likes-section">
                    <div className="feed-likes-header">
                      <h4>Likes ({feed.like})</h4>
                    </div>

                    <div className="feed-likes-list">
                      {likesList[feed.id]?.map((like) => (
                        <div key={like.id} className="feed-like-item">
                          <div className="feed-like-user">
                            <img
                              src={
                                like.User?.UserProfile?.profileUrl
                                  ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${like.User.UserProfile.profileUrl}`
                                  : "/assets/Utils/male.png"
                              }
                              alt={like.User?.name}
                              className="feed-like-avatar"
                            />
                            <div className="feed-like-user-info">
                              <span className="feed-like-username">
                                {like.User?.name}
                              </span>
                              <span className="feed-like-title">
                                {like.User?.UserProfile?.title || ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {likesPagination[feed.id]?.hasNextPage && (
                      <button
                        className="feed-likes-load-more"
                        onClick={() =>
                          loadFeedLikes(
                            feed.id,
                            likesPagination[feed.id].currentPage + 1
                          )
                        }
                      >
                        Load More Likes
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="feed-pagination">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage || isLoading}
              >
                Previous
              </button>
              <span>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage || isLoading}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {selectedImagePopup && (
        <div
          className="feed-image-popup"
          ref={imagePopupRef}
          onClick={handleClosePopup}
        >
          <div className="feed-image-popup-content">
            <button
              className="feed-image-close-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleClosePopup(e);
              }}
            >
              ×
            </button>
            <button
              className="feed-image-nav-btn feed-image-prev-btn"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
            >
              ←
            </button>
            <button
              className="feed-image-nav-btn feed-image-next-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
            >
              →
            </button>
            <div className="feed-image-popup-counter">
              {currentImageIndex + 1} / {selectedImagePopup.length}
            </div>
            <img
              src={selectedImagePopup[currentImageIndex]}
              alt="Full size"
              style={{
                transform: `scale(${imageZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                cursor: imageZoom > 1 ? "move" : "default",
              }}
              className="feed-image-popup-img"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>
        </div>
      )}
    </div>
  );
};
