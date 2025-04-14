import React, { useState, useRef } from 'react';
import { Feed } from '../Common/Feed/Feed';
import './Profile.css';

export const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    title: 'Computer Science Student',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    description: 'Passionate about technology and software development. Currently pursuing my degree in Computer Science with a focus on web development and machine learning.',
    followers: 1200,
    following: 850,
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  });

  const coverImageInputRef = useRef(null);
  const profileImageInputRef = useRef(null);

  const [feeds, setFeeds] = useState([
    {
      id: 1,
      user: {
        name: 'John Doe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        title: 'Computer Science Student'
      },
      content: 'Just completed my final year project on machine learning!',
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
          text: 'Great work!', 
          timestamp: '1h ago' 
        }
      ],
      timestamp: '2h ago',
      showComments: false
    }
  ]);

  const handlePostSubmit = (content, image, callback) => {
    if (content.trim() || image) {
      const newFeed = {
        id: feeds.length + 1,
        user: {
          name: profile.name,
          avatar: profile.image,
          title: profile.title
        },
        content,
        image,
        likes: [],
        comments: [],
        timestamp: 'Just now',
        showComments: false
      };
      setFeeds([newFeed, ...feeds]);
      callback();
    }
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
                    name: profile.name,
                    avatar: profile.image
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

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setProfile({
      ...profile,
      name: formData.get('name'),
      title: formData.get('title'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      description: formData.get('description')
    });
    setIsEditing(false);
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          coverImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-cover-image">
          <img src={profile.coverImage} alt="Cover" />
          <button 
            className="profile-edit-cover-button"
            onClick={() => coverImageInputRef.current.click()}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
          <input
            type="file"
            ref={coverImageInputRef}
            onChange={handleCoverImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
        <div className="profile-info">
          <div className="profile-image-container">
            <img src={profile.image} alt={profile.name} />
            <button 
              className="profile-edit-image-button"
              onClick={() => profileImageInputRef.current.click()}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </button>
            <input
              type="file"
              ref={profileImageInputRef}
              onChange={handleProfileImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
          <div className="profile-details">
            <h1>{profile.name}</h1>
            <p className="title">{profile.title}</p>
            <div className="profile-stats">
              <div className="profile-stat-item">
                <span className="profile-stat-value">{profile.followers}</span>
                <span className="profile-stat-label">Followers</span>
              </div>
              <div className="profile-stat-item">
                <span className="profile-stat-value">{profile.following}</span>
                <span className="profile-stat-label">Following</span>
              </div>
            </div>
            <button 
              className="profile-edit-button"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-about">
          <h2>About</h2>
          {isEditing ? (
            <form onSubmit={handleProfileUpdate} className="profile-edit-form">
              <div className="profile-form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={profile.name}
                  required
                />
              </div>
              <div className="profile-form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={profile.title}
                  required
                />
              </div>
              <div className="profile-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={profile.email}
                  required
                />
              </div>
              <div className="profile-form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={profile.phone}
                  required
                />
              </div>
              <div className="profile-form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  defaultValue={profile.description}
                  required
                />
              </div>
              <div className="profile-form-actions">
                <button 
                  type="button"
                  className="profile-cancel-button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="profile-save-button">
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="profile-description">{profile.description}</p>
              <div className="profile-contact-info">
                <div className="profile-info-item">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <span>{profile.email}</span>
                </div>
                <div className="profile-info-item">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                  </svg>
                  <span>{profile.phone}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="profile-feeds">
          <Feed 
            feeds={feeds}
            onPostSubmit={handlePostSubmit}
            onLike={handleLike}
            onComment={handleComment}
            showCreatePost={true}
          />
        </div>
      </div>
    </div>
  );
};
    
