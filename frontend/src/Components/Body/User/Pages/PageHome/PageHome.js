import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPagesHandler, createPageHandler, toggleFollowPageHandler } from '../pageApiHandler';
import './PageHome.css';

export const PageHome = () => {
  const navigate = useNavigate();
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [showUserPages, setShowUserPages] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pages, setPages] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });

  const [newPage, setNewPage] = useState({
    title: 'title',
    description: 'description',
    image: null,
    category: 'Department'
  });

  const categories = ['Department', 'Community', 'Organization', 'Club', 'Event'];

  // Fetch pages on component mount and when filters change
  useEffect(() => {
    fetchPages();
  }, [showUserPages, pagination.currentPage]);

  const fetchPages = async () => {
    
      
      setError(null);
      
      const response = await getAllPagesHandler(
        { 
          page: pagination.currentPage, 
          limit: pagination.limit, 
          userPages: showUserPages 
        }, 
        setIsLoading, 
        (error) => setError(error)
      );
      
      if (response && response.success) {
        const { pages, pagination } = response.data;
        
        // Transform the pages data to match our component's structure
        const transformedPages = pages.map(page => ({
          id: page.id,
          name: page.title,
          description: page.description || '',
          image: page.imageUrl 
            ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${page.imageUrl}` 
            : 'https://placehold.co/300x200',
          followers: page.followers || 0,
          posts: page.posts || 0,
          isFollowing: page.isFollowing || false,
          category: page.category || 'Department',
          createdBy: page.User?.name || 'Admin',
          lastActive: page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : 'Never',
          isUserCreated: page.UserId === localStorage.getItem('userId')
        }));
        
        setPages(transformedPages);
        setPagination(pagination);
      } 
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPage({ ...newPage, image: file });
    }
  };

  const handleCreatePage = async (e) => {
    e.preventDefault();
    if (newPage.title && newPage.description) {
      try {
        setIsLoading(true);
        
        const formData = new FormData();
        formData.append('title', newPage.title);
        formData.append('description', newPage.description);
        formData.append('category', newPage.category);
        
        if (newPage.image) {
          formData.append('image', newPage.image);
        }
        
        const response = await createPageHandler(
          formData, 
          setIsLoading, 
          (error) => setError(error)
        );
        
        if (response && response.success) {
          // Refresh the pages list
          fetchPages();
          
          // Reset form and close modal
          setNewPage({ title: '', description: '', image: null, category: 'Department' });
          setShowCreatePage(false);
        } else {
          setError('Failed to create page');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while creating the page');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleFollow = async (pageId) => {
    try {
      setIsLoading(true);
      
      const response = await toggleFollowPageHandler(
        { id: pageId }, 
        setIsLoading, 
        (error) => setError(error)
      );
      
      if (response && response.success) {
        // Update the page's follow status and follower count
        setPages(pages.map(page => 
          page.id === pageId 
            ? { 
                ...page, 
                isFollowing: !page.isFollowing, 
                followers: page.followers
              }
            : page
        ));
      } else {
        setError('Failed to update follow status');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while updating follow status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewMore = (pageId) => {
    navigate(`/pages/details/${pageId}`);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const filteredPages = pages;

  
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

      {error && (
        <div className="pages-error-message">
          <p>{error}</p>
          <button onClick={fetchPages}>Try Again</button>
        </div>
      )}

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
                  value={newPage.title}
                  onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
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
                      <img src={typeof newPage.image === 'string' ? newPage.image : URL.createObjectURL(newPage.image)} alt="Preview" />
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
                <button 
                  type="submit" 
                  className="create-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading && pages.length === 0 ? (
        <div className="pages-loading-container">
          <div className="pages-spinner"></div>
          <p>Loading pages...</p>
        </div>
      ) : (
        <>
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
                  {/* <button 
                    className={`follow-button ${page.isFollowing ? 'following' : ''}`}
                    onClick={() => toggleFollow(page.id)}
                    disabled={isLoading}
                  >
                    {page.isFollowing ? 'Following' : 'Follow'}
                  </button> */}
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
          
          {pagination.totalPages > 1 && (
            <div className="pages-pagination">
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
