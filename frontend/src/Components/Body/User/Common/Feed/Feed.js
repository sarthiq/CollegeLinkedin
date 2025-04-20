import React, { useState, useRef, useEffect } from 'react';
import { getAllFeedsHandler, createFeedHandler } from './feedApiHandler';
import './Feed.css';

export const Feed = ({ pageId = null, showCreatePost = true }) => {
  const [feeds, setFeeds] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const fileInputRef = useRef(null);

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
          //pageId: pageId,
          //usersFeed: !pageId // If no pageId, show user feeds
        },
        setIsLoading,
        (error) => setError(error)
      );

      if (response && response.success) {
        const { feeds, pagination: paginationData } = response.data;
        
        // Transform the feeds data to match our component's structure
        const transformedFeeds = feeds.map(feed => ({
          id: feed.id,
          user: {
            name: feed.User?.name || 'Anonymous',
            avatar: feed.User?.profileUrl 
              ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${feed.User.profileUrl}` 
              : 'https://randomuser.me/api/portraits/men/1.jpg',
            title: feed.User?.title || 'User'
          },
          content: feed.feedData.content || '',
          image: feed.feedData.imageUrl 
            ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${feed.feedData.imageUrl}` 
            : null,
          likes: feed.likes || [],
          comments: feed.comments || [],
          timestamp: new Date(feed.createdAt).toLocaleDateString(),
          showComments: false
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

  return (
    <div className="feed-container">
      {showCreatePost && (
        <div className="create-post">
          <div className="post-creator">
            <img 
              src="https://randomuser.me/api/portraits/men/3.jpg" 
              alt="User" 
              className="user-avatar"
            />
            <div className="post-input-container">
              <form onSubmit={handleSubmit}>
                <textarea
                  placeholder="Share your thoughts..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="post-input"
                />
                {selectedImage && (
                  <div className="image-preview">
                    <img src={selectedImage} alt="Preview" />
                    <button 
                      type="button" 
                      onClick={() => setSelectedImage(null)}
                      className="remove-image"
                    >
                      ×
                    </button>
                  </div>
                )}
                <div className="post-actions">
                  <div className="action-buttons">
                    <button 
                      type="button" 
                      className="image-upload-button"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                      </svg>
                      <span>Photo</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="post-button"
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
                <div className="feed-header">
                  <div className="user-info">
                    <img src={feed.user.avatar} alt={feed.user.name} className="user-avatar" />
                    <div className="user-details">
                      <span className="user-name">{feed.user.name}</span>
                      <span className="user-title">{feed.user.title}</span>
                      <span className="post-time">{feed.timestamp}</span>
                    </div>
                  </div>
                </div>
                
                <div className="feed-content">
                  <p>{feed.content}</p>
                  {feed.image && (
                    <div className="feed-image">
                      <img src={feed.image} alt="Post content" />
                    </div>
                  )}
                </div>

                <div className="feed-stats">
                  <div className="likes-count">
                    <span className="icon">👍</span>
                    <span>{feed.likes.length}</span>
                  </div>
                  <div className="comments-count">
                    <span>{feed.comments.length} comments</span>
                  </div>
                </div>

                <div className="feed-actions">
                  <button 
                    className="action-button"
                    onClick={() => handleLike(feed.id)}
                  >
                    <span className="icon">👍</span>
                    <span className="text">Like</span>
                  </button>
                  <button 
                    className="action-button"
                    onClick={() => handleComment(feed.id)}
                  >
                    <span className="icon">💬</span>
                    <span className="text">Comment</span>
                  </button>
                  <button className="action-button">
                    <span className="icon">🔄</span>
                    <span className="text">Share</span>
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
    </div>
  );
}; 