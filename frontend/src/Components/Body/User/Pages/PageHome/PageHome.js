import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PageHome.css';

export const PageHome = () => {
  const navigate = useNavigate();
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [showUserPages, setShowUserPages] = useState(false);
  const [pages, setPages] = useState([
    {
      id: 1,
      name: 'Computer Science Department',
      description: 'Official page for Computer Science Department',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
      followers: 1200,
      posts: 45,
      isFollowing: true,
      category: 'Department',
      createdBy: 'Admin',
      lastActive: '2h ago',
      isUserCreated: false
    },
    {
      id: 2,
      name: 'Alumni Network',
      description: 'Connect with alumni from our college',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
      followers: 2500,
      posts: 120,
      isFollowing: false,
      category: 'Community',
      createdBy: 'Alumni Association',
      lastActive: '1d ago',
      isUserCreated: false
    },
    {
      id: 3,
      name: 'Student Council',
      description: 'Official student council page',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
      followers: 800,
      posts: 30,
      isFollowing: true,
      category: 'Organization',
      createdBy: 'Student Body',
      lastActive: '5h ago',
      isUserCreated: false
    },
    {
      id: 4,
      name: 'My Study Group',
      description: 'Study group for Computer Science students',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
      followers: 50,
      posts: 15,
      isFollowing: true,
      category: 'Study Group',
      createdBy: 'You',
      lastActive: '1h ago',
      isUserCreated: true
    }
  ]);

  const [newPage, setNewPage] = useState({
    name: '',
    description: '',
    image: null,
    category: 'Department'
  });

  const categories = ['Department', 'Community', 'Organization', 'Club', 'Event'];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPage({ ...newPage, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePage = (e) => {
    e.preventDefault();
    if (newPage.name && newPage.description) {
      const page = {
        id: pages.length + 1,
        ...newPage,
        followers: 0,
        posts: 0,
        isFollowing: true,
        createdBy: 'You',
        lastActive: 'Just now',
        isUserCreated: true
      };
      setPages([page, ...pages]);
      setNewPage({ name: '', description: '', image: null, category: 'Department' });
      setShowCreatePage(false);
    }
  };

  const toggleFollow = (pageId) => {
    setPages(pages.map(page => 
      page.id === pageId 
        ? { ...page, isFollowing: !page.isFollowing, followers: page.isFollowing ? page.followers - 1 : page.followers + 1 }
        : page
    ));
  };

  const handleViewMore = (pageId) => {
    navigate(`/pages/details/${pageId}`);
  };

  const filteredPages = showUserPages 
    ? pages.filter(page => page.isUserCreated)
    : pages;

  return (
    <div className="pages-container">
      <div className="pages-header">
        <div className="header-content">
          <h1>Pages</h1>
          <p className="header-description">Discover and connect with college pages</p>
        </div>
        <div className="header-actions">
          <div className="page-filter">
            <button 
              className={`filter-button ${!showUserPages ? 'active' : ''}`}
              onClick={() => setShowUserPages(false)}
            >
              All Pages
            </button>
            <button 
              className={`filter-button ${showUserPages ? 'active' : ''}`}
              onClick={() => setShowUserPages(true)}
            >
              My Pages
            </button>
          </div>
          <button 
            className="create-page-button"
            onClick={() => setShowCreatePage(true)}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Create Page
          </button>
        </div>
      </div>

      {showCreatePage && (
        <div className="create-page-modal">
          <div className="create-page-content">
            <div className="modal-header">
              <h2>Create New Page</h2>
              <button 
                className="close-button"
                onClick={() => setShowCreatePage(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreatePage}>
              <div className="form-group">
                <label>Page Name</label>
                <input
                  type="text"
                  value={newPage.name}
                  onChange={(e) => setNewPage({ ...newPage, name: e.target.value })}
                  placeholder="Enter page name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newPage.category}
                  onChange={(e) => setNewPage({ ...newPage, category: e.target.value })}
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newPage.description}
                  onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
                  placeholder="Enter page description"
                  required
                />
              </div>
              <div className="form-group">
                <label>Page Image</label>
                <div className="image-upload-container">
                  {newPage.image ? (
                    <div className="image-preview">
                      <img src={newPage.image} alt="Preview" />
                      <button 
                        type="button" 
                        onClick={() => setNewPage({ ...newPage, image: null })}
                        className="remove-image"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="image-upload-button">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                      </svg>
                      <span>Upload Image</span>
                    </label>
                  )}
                </div>
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowCreatePage(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="create-button">
                  Create Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="pages-list">
        {filteredPages.map(page => (
          <div key={page.id} className="page-item">
            <div className="page-item-content">
              <div className="page-item-image">
                <img src={page.image} alt={page.name} />
                <span className="page-category">{page.category}</span>
              </div>
              <div className="page-item-info">
                <div className="page-header">
                  <h3 className="page-item-name">{page.name}</h3>
                  <span className="page-meta">
                    Created by {page.createdBy} • Last active {page.lastActive}
                  </span>
                </div>
                <p className="page-item-description">{page.description}</p>
                <div className="page-item-stats">
                  <div className="stat-item">
                    <span className="stat-value">{page.followers}</span>
                    <span className="stat-label">Followers</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{page.posts}</span>
                    <span className="stat-label">Posts</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="page-item-actions">
              <button 
                className={`follow-button ${page.isFollowing ? 'following' : ''}`}
                onClick={() => toggleFollow(page.id)}
              >
                {page.isFollowing ? 'Following' : 'Follow'}
              </button>
              <button 
                className="view-more-button"
                onClick={() => handleViewMore(page.id)}
              >
                View More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
