import React, { useState, useRef, useEffect } from 'react';
import { getAllFeedsHandler, createFeedHandler, deleteFeedHandler, updateFeedHandler } from './feedApiHandler';
import './Feed.css';

export const Feed = ({ pageId = null,usersFeed = false, showCreatePost = true }) => {
  const [feeds, setFeeds] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
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
    hasPrevPage: false
  });
  const fileInputRef = useRef(null);
  const [expandedFeeds, setExpandedFeeds] = useState(new Set());
  const [editingFeedId, setEditingFeedId] = useState(null);
  const [menuOpenFeedId, setMenuOpenFeedId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState(null);
  const editFileInputRef = useRef(null);
  const [selectedImagePopup, setSelectedImagePopup] = useState(null);
  const [imageZoom, setImageZoom] = useState(1);
  const imagePopupRef = useRef(null);

  // Fetch feeds on component mount and when pageId or pagination changes
  useEffect(() => {
    fetchFeeds();
  }, [pageId, pagination.currentPage]);

  const fetchFeeds = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllFeedsHandler(
        { 
          page: pagination.currentPage, 
          limit: pagination.limit,
          pageId: pageId,
          usersFeed: usersFeed
        },
        setIsLoading,
        (error) => setError(error)
      );

      if (response && response.success) {
        const { feeds, pagination: paginationData } = response.data;
        
        // Set the userId from the response
        setUserId(response.data.userId);
        
        // Transform the feeds data to match our component's structure
        const transformedFeeds = feeds.map(feed => ({
          id: feed.id,
          user: {
            id: feed.User?.id,
            name: feed.User?.name || 'Anonymous',
            avatar: feed.User?.UserProfile?.profileUrl 
              ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${feed.User.UserProfile.profileUrl}` 
              : '/assets/Utils/male.png',
            title: feed.User?.UserProfile?.title || ''
          },
          content: feed.feedData.content || '',
          image: feed.feedData.imageUrl 
            ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${feed.feedData.imageUrl}` 
            : null,
          likes: feed.likes || [],
          comments: feed.comments || [],
          timestamp: new Date(feed.createdAt).toLocaleDateString(),
          showComments: false,
          pageInfo:feed.Page
        }));

        setFeeds(transformedFeeds);
        setPagination(paginationData);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching feeds');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPost.trim() || selectedImage) {
      setIsPosting(true);
      setError(null);

     
        const formData = new FormData();
        formData.append('feedData', JSON.stringify({ content: newPost }));
        
        if (selectedImage) {
          // Get the actual file from the file input
          const file = fileInputRef.current.files[0];
          if (file) {
            formData.append('image', file);
          }
        }

        if (pageId) {
          formData.append('pageId', pageId);
        }

        const response = await createFeedHandler(
          formData,
          setIsPosting,
          (error) => setError(error)
        );

        if (response && response.success) {
          setNewPost('');
          setSelectedImage(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear the file input
          }
          fetchFeeds(); // Refresh feeds after successful post
        }
     
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  // For now, keeping these handlers simple as backend APIs are not implemented
  const handleLike = (feedId) => {
    setFeeds(feeds.map(feed => 
      feed.id === feedId 
        ? { ...feed, likes: [...feed.likes, { id: Date.now(), user: 'Current User' }] }
        : feed
    ));
  };

  const handleComment = (feedId, commentText) => {
    if (commentText.trim()) {
      setFeeds(feeds.map(feed => 
        feed.id === feedId 
          ? {
              ...feed,
              comments: [
                ...feed.comments,
                {
                  id: Date.now(),
                  user: {
                    name: 'Current User',
                    avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
                  },
                  text: commentText,
                  timestamp: 'Just now'
                }
              ]
            }
          : feed
      ));
    }
  };

  const toggleFeedContent = (feedId) => {
    setExpandedFeeds(prev => {
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
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await deleteFeedHandler(
          { id:feedId },
          setIsLoading,
          (error) => setError(error)
        );
        if (response && response.success) {
          setFeeds(feeds.filter(feed => feed.id !== feedId));
        }
      } catch (err) {
        setError(err.message || 'Failed to delete post');
      }
    }
  };

  const handleMenuClick = (feedId) => {
    setMenuOpenFeedId(menuOpenFeedId === feedId ? null : feedId);
  };

  const handleEditClick = (feed) => {
    setEditingFeedId(feed.id);
    setEditContent(feed.content);
    setEditImage(feed.image);
    setMenuOpenFeedId(null); // Close the menu when edit is clicked
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (feedId) => {
    if (editContent.trim() || editImage) {
      setIsPosting(true);
      setError(null);

      const formData = new FormData();
      formData.append('id', feedId);
      formData.append('feedData', JSON.stringify({ content: editContent }));
      
      if (editFileInputRef.current && editFileInputRef.current.files[0]) {
        formData.append('image', editFileInputRef.current.files[0]);
      }

      try {
        const response = await updateFeedHandler(
          formData,
          setIsPosting,
          (error) => setError(error)
        );

        if (response && response.success) {
          setFeeds(feeds.map(feed => 
            feed.id === feedId 
              ? { 
                  ...feed, 
                  content: editContent,
                  image: editImage
                }
              : feed
          ));
          setEditingFeedId(null);
          setEditContent('');
          setEditImage(null);
          if (editFileInputRef.current) {
            editFileInputRef.current.value = '';
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to update post');
      } finally {
        setIsPosting(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingFeedId(null);
    setEditContent('');
    setEditImage(null);
    if (editFileInputRef.current) {
      editFileInputRef.current.value = '';
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImagePopup(imageUrl);
    setImageZoom(1);
  };

  const handleClosePopup = () => {
    setSelectedImagePopup(null);
    setImageZoom(1);
  };

  const handleZoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setImageZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClosePopup();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="feed-container">
      {showCreatePost && (
        <div className="feed-create-post">
          <div className="feed-post-creator">
            <div className="feed-input-wrapper">
              <form onSubmit={handleSubmit}>
                <textarea
                  placeholder="Share your thoughts..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="feed-post-input"
                  rows="3"
                />
                {selectedImage && (
                  <div className="feed-image-preview">
                    <img src={selectedImage} alt="Preview" />
                    <button 
                      type="button" 
                      onClick={() => setSelectedImage(null)}
                      className="feed-remove-image"
                    >
                      ×
                    </button>
                  </div>
                )}
                <div className="feed-post-footer">
                  <label className="feed-upload-btn">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <svg viewBox="0 0 24 24" width="22" height="22">
                      <path fill="currentColor" d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z"/>
                    </svg>
                    <span>Photo</span>
                  </label>
                  <button 
                    type="submit" 
                    className="feed-submit-btn"
                    disabled={isPosting || (!newPost.trim() && !selectedImage)}
                  >
                    {isPosting ? 'Posting...' : 'Post'}
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
                    <img src={feed.user.avatar} alt={feed.user.name} className="feed-user-avatar" />
                    <div className="feed-user-details">
                      <span className="feed-user-name">
                        {feed.user.name}
                        {feed.pageInfo && <span> - {feed.pageInfo.title}</span>}
                      </span>
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
                          <button onClick={() => handleEditClick(feed)}>Edit</button>
                          <button onClick={() => handleDeleteFeed(feed.id)}>Delete</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="feed-item-content">
                  {editingFeedId === feed.id ? (
                    <div className="feed-edit-form">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="feed-edit-input"
                        rows="3"
                      />
                      {editImage && (
                        <div className="feed-edit-image-preview">
                          <img src={editImage} alt="Preview" />
                          <button 
                            type="button" 
                            onClick={() => setEditImage(null)}
                            className="feed-edit-remove-image"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      <div className="feed-edit-actions">
                        <label className="feed-edit-upload-btn">
                          <input
                            type="file"
                            ref={editFileInputRef}
                            onChange={handleEditImageUpload}
                            accept="image/*"
                            style={{ display: 'none' }}
                          />
                          <svg viewBox="0 0 24 24" width="22" height="22">
                            <path fill="currentColor" d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z"/>
                          </svg>
                          <span>Change Photo</span>
                        </label>
                        <div className="feed-edit-buttons">
                          <button 
                            className="feed-edit-cancel-btn"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                          <button 
                            className="feed-edit-save-btn"
                            onClick={() => handleEditSubmit(feed.id)}
                            disabled={isPosting}
                          >
                            {isPosting ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={`feed-item-text ${!expandedFeeds.has(feed.id) ? 'feed-text-collapsed' : ''}`}>
                        <p>{feed.content}</p>
                      </div>
                      {feed.content.length > 200 && (
                        <button 
                          className="feed-show-more-btn"
                          onClick={() => toggleFeedContent(feed.id)}
                        >
                          {expandedFeeds.has(feed.id) ? 'Show less' : 'Show more'}
                        </button>
                      )}
                      {feed.image && (
                        <div className="feed-item-image">
                          <img 
                            src={feed.image} 
                            alt="Post content" 
                            onClick={() => handleImageClick(feed.image)}
                            className="feed-item-thumbnail"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="feed-item-stats">
                  <div className="feed-likes-count">
                    <span className="feed-icon">👍</span>
                    <span>{feed.likes.length}</span>
                  </div>
                  <div className="feed-comments-count">
                    <span>{feed.comments.length} comments</span>
                  </div>
                </div>

                <div className="feed-item-actions">
                  <button 
                    className="feed-action-button"
                    onClick={() => handleLike(feed.id)}
                  >
                    <span className="feed-icon">👍</span>
                    <span className="feed-action-text">Like</span>
                  </button>
                  <button 
                    className="feed-action-button"
                    onClick={() => handleComment(feed.id)}
                  >
                    <span className="feed-icon">💬</span>
                    <span className="feed-action-text">Comment</span>
                  </button>
                </div>
                
                {feed.showComments && (
                  <div className="comments-section">
                    {feed.likes.length > 0 && (
                      <div className="likes-list">
                        <div className="likes-preview">
                          {feed.likes.slice(0, 3).map(like => (
                            <span key={like.id} className="like-user">{like.user}</span>
                          ))}
                          {feed.likes.length > 3 && (
                            <span className="more-likes">and {feed.likes.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="comments-list">
                      {feed.comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                          <img 
                            src={comment.user.avatar} 
                            alt={comment.user.name} 
                            className="comment-avatar"
                          />
                          <div className="comment-content">
                            <div className="comment-header">
                              <span className="comment-user">{comment.user.name}</span>
                              <span className="comment-time">{comment.timestamp}</span>
                            </div>
                            <p className="comment-text">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="add-comment">
                      <img 
                        src="https://randomuser.me/api/portraits/men/3.jpg" 
                        alt="User" 
                        className="comment-avatar"
                      />
                      <input 
                        type="text" 
                        placeholder="Write a comment..." 
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleComment(feed.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>
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
              <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
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
        <div className="feed-image-popup" ref={imagePopupRef}>
          <div className="feed-image-popup-content">
            <div className="feed-image-popup-controls">
              <button className="feed-image-zoom-btn" onClick={handleZoomIn}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </button>
              <button className="feed-image-zoom-btn" onClick={handleZoomOut}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M19 13H5v-2h14v2z"/>
                </svg>
              </button>
              <button className="feed-image-close-btn" onClick={handleClosePopup}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <img 
              src={selectedImagePopup} 
              alt="Full size" 
              style={{ transform: `scale(${imageZoom})` }}
              className="feed-image-popup-img"
            />
          </div>
        </div>
      )}
    </div>
  );
}; 