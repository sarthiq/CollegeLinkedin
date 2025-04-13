import React, { useState, useRef } from 'react';
import './Feed.css';

export const Feed = ({ feeds, onPostSubmit, onLike, onComment, showCreatePost = true }) => {
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim() || selectedImage) {
      setIsPosting(true);
      onPostSubmit(newPost, selectedImage, () => {
        setNewPost('');
        setSelectedImage(null);
        setIsPosting(false);
      });
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
                onClick={() => onLike(feed.id)}
              >
                <span className="icon">👍</span>
                <span className="text">Like</span>
              </button>
              <button 
                className="action-button"
                onClick={() => onComment(feed.id)}
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
                        onComment(feed.id, e.target.value);
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
    </div>
  );
}; 