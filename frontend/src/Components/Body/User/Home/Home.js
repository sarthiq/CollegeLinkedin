import React, { useState, useRef } from 'react';
import './Home.css';

export const Home = () => {
  const [feeds, setFeeds] = useState([
    {
      id: 1,
      user: {
        name: 'John Doe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        title: 'Computer Science Student'
      },
      content: 'Just completed my final year project!',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      likes: [
        { id: 1, user: 'Alice Smith' },
        { id: 2, user: 'Bob Johnson' }
      ],
      comments: [
        { 
          id: 1, 
          user: {
            name: 'Alice Smith',
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
          }, 
          text: 'Congratulations!', 
          timestamp: '1h ago' 
        },
        { 
          id: 2, 
          user: {
            name: 'Bob Johnson',
            avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
          },
          text: 'Great work!', 
          timestamp: '45m ago' 
        }
      ],
      timestamp: '2h ago',
      showComments: false
    }
  ]);

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

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim() || selectedImage) {
      setIsPosting(true);
      // Simulate API call
      setTimeout(() => {
        const newFeed = {
          id: feeds.length + 1,
          user: {
            name: 'Current User',
            avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
            title: 'Student'
          },
          content: newPost,
          image: selectedImage,
          likes: [],
          comments: [],
          timestamp: 'Just now',
          showComments: false
        };
        setFeeds([newFeed, ...feeds]);
        setNewPost('');
        setSelectedImage(null);
        setIsPosting(false);
      }, 1000);
    }
  };

  const toggleComments = (feedId) => {
    setFeeds(feeds.map(feed => 
      feed.id === feedId 
        ? { ...feed, showComments: !feed.showComments }
        : feed
    ));
  };

  const handleLike = (feedId) => {
    setFeeds(feeds.map(feed => 
      feed.id === feedId 
        ? { 
            ...feed, 
            likes: [...feed.likes, { id: Date.now(), user: 'Current User' }]
          }
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
    <div className="home-container">
      <div className="feed-container">
        <div className="create-post">
          <div className="post-creator">
            <img 
              src="https://randomuser.me/api/portraits/men/3.jpg" 
              alt="User" 
              className="user-avatar"
            />
            <div className="post-input-container">
              <form onSubmit={handlePostSubmit}>
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
                  onClick={() => toggleComments(feed.id)}
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
      </div>
    </div>
  );
};

