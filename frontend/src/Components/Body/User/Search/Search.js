import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchHandler } from './searchApiHandler';
import './Search.css';

export const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState('user');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchText(query);
      performSearch(query, searchType, 1);
    }
  }, [searchParams]);

  const performSearch = async (text, type, page) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await searchHandler(
        {
          searchText: text,
          type,
          page,
          limit: pagination.limit
        },
        setIsLoading,
        setError
      );

      if (response && response.success) {
        setResults(response.data);
        setPagination(response.pagination);
      }
    } catch (err) {
      setError('Failed to perform search');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/dashboard/search?q=${encodeURIComponent(searchText.trim())}`);
    }
  };

  const handleTypeChange = (type) => {
    setSearchType(type);
    if (searchText.trim()) {
      performSearch(searchText, type, 1);
    }
  };

  const handlePageChange = (newPage) => {
    performSearch(searchText, searchType, newPage);
  };

  const renderUserResults = () => (
    <div className="search-results-grid">
      {results.map((user) => (
        <div
          key={user.id}
          className="search-user-card"
          onClick={() => navigate(`/dashboard/profile?userId=${user.id}`)}
        >
          <img
            src={user.UserProfile?.profileUrl 
              ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${user.UserProfile.profileUrl}`
              : "/assets/Utils/male.png"
            }
            alt={user.name}
            className="search-user-avatar"
          />
          <div className="search-user-info">
            <h3 className="search-user-name">{user.name}</h3>
            <p className="search-user-title">{user.UserProfile?.title || ''}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFeedResults = () => (
    <div className="search-results-list">
      {results.map((feed) => (
        <div
          key={feed.id}
          className="search-feed-card"
          onClick={() => navigate(`/dashboard/feed/${feed.id}`)}
        >
          <div className="search-feed-header">
            <div className="search-feed-user">
              <img
                src={feed.User?.UserProfile?.profileUrl
                  ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${feed.User.UserProfile.profileUrl}`
                  : "/assets/Utils/male.png"
                }
                alt={feed.User?.name}
                className="search-feed-user-avatar"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/dashboard/profile?userId=${feed.User?.id}`);
                }}
              />
              <div className="search-feed-user-info">
                <span className="search-feed-username">{feed.User?.name}</span>
                <span className="search-feed-user-title">{feed.User?.UserProfile?.title || ''}</span>
              </div>
            </div>
            <span className="search-feed-date">
              {new Date(feed.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="search-feed-content">
            <div dangerouslySetInnerHTML={{ __html: feed.feedData.content }} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderProjectResults = () => (
    <div className="search-results-grid">
      {results.map((project) => (
        <div
          key={project.id}
          className="search-project-card"
          onClick={() => navigate(`/dashboard/projects/id/${project.id}`)}
        >
          <div className="search-project-header">
            <div className="search-project-user">
              <img
                src={project.User?.UserProfile?.profileUrl
                  ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${project.User.UserProfile.profileUrl}`
                  : "/assets/Utils/male.png"
                }
                alt={project.User?.name}
                className="search-project-user-avatar"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/dashboard/profile?userId=${project.User?.id}`);
                }}
              />
              <div className="search-project-user-info">
                <span className="search-project-username">{project.User?.name}</span>
                <span className="search-project-user-title">{project.User?.UserProfile?.title || ''}</span>
              </div>
            </div>
          </div>
          <h3 className="search-project-title">{project.title}</h3>
          <p className="search-project-description">{project.description}</p>
          <div className="search-project-tech">
            {project.technologies?.map((tech, index) => (
              <span key={index} className="search-project-tech-tag">
                {tech}
              </span>
            ))}
          </div>
          <div className="search-project-meta">
            <span className="search-project-date">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderInternshipResults = () => (
    <div className="search-results-grid">
      {results.map((internship) => (
        <div
          key={internship.id}
          className="search-internship-card"
          onClick={() => navigate(`/dashboard/internships/id/${internship.id}`)}
        >
          <div className="search-internship-header">
            <div className="search-internship-user">
              <img
                src={internship.User?.UserProfile?.profileUrl
                  ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${internship.User.UserProfile.profileUrl}`
                  : "/assets/Utils/male.png"
                }
                alt={internship.User?.name}
                className="search-internship-user-avatar"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/dashboard/profile?userId=${internship.User?.id}`);
                }}
              />
              <div className="search-internship-user-info">
                <span className="search-internship-username">{internship.User?.name}</span>
                <span className="search-internship-user-title">{internship.User?.UserProfile?.title || ''}</span>
              </div>
            </div>
          </div>
          <h3 className="search-internship-title">{internship.title}</h3>
          <div className="search-internship-details">
            <p className="search-internship-company">{internship.companyName}</p>
            <p className="search-internship-role">{internship.role}</p>
            <p className="search-internship-location">{internship.location}</p>
          </div>
          <div className="search-internship-meta">
            <span className="search-internship-date">
              {new Date(internship.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderResults = () => {
    switch (searchType) {
      case 'user':
        return renderUserResults();
      case 'feed':
        return renderFeedResults();
      case 'project':
        return renderProjectResults();
      case 'internship':
        return renderInternshipResults();
      default:
        return null;
    }
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <form onSubmit={handleSearch} className="search-form">
          {/* <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button> */}
        </form>
        <div className="search-type-selector">
          <button
            className={`search-type-btn ${searchType === 'user' ? 'active' : ''}`}
            onClick={() => handleTypeChange('user')}
          >
            People
          </button>
          <button
            className={`search-type-btn ${searchType === 'feed' ? 'active' : ''}`}
            onClick={() => handleTypeChange('feed')}
          >
            Posts
          </button>
          <button
            className={`search-type-btn ${searchType === 'project' ? 'active' : ''}`}
            onClick={() => handleTypeChange('project')}
          >
            Projects
          </button>
          <button
            className={`search-type-btn ${searchType === 'internship' ? 'active' : ''}`}
            onClick={() => handleTypeChange('internship')}
          >
            Internships
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="search-loading">
          <div className="search-spinner"></div>
          <p>Searching...</p>
        </div>
      ) : error ? (
        <div className="search-error">
          <p>{error}</p>
          <button onClick={() => performSearch(searchText, searchType, pagination.page)}>
            Try Again
          </button>
        </div>
      ) : results.length === 0 ? (
        <div className="search-no-results">
          <p>No results found</p>
        </div>
      ) : (
        <>
          <div className="search-results">
            {renderResults()}
          </div>
          {pagination.total > pagination.limit && (
            <div className="search-pagination">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </button>
              <span>Page {pagination.page}</span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page * pagination.limit >= pagination.total}
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

