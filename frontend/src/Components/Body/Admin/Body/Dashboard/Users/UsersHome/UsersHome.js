import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './UsersHome.css';
import { getUsersHandler, getUsersStatsHandler } from '../userApiHandler';

export const UsersHome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    todayUsers: 0,
    monthUsers: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsersStats();
    fetchUsers();
  }, [pagination.page, search]);

  const fetchUsersStats = async () => {
    try {
      const response = await getUsersStatsHandler({},setIsLoading, setError);
      if (response) {
        setStats(response.data);
      }
    } catch (error) {
      setError('Failed to fetch user statistics');
    }
  };

  const fetchUsers = async () => {
    try {
        const response = await getUsersHandler(
        {
            page: pagination.page,
            limit: pagination.limit,
            search: search
        },
        setIsLoading,
        setError,
      );
      if (response) {
        setUsers(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages
        }));
      }
    } catch (error) {
      setError('Failed to fetch users');
    }
  };
  console.log(users)
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleViewMore = (userId) => {
    navigate(`id/${userId}`);
  };

  if (error) {
    return (
      <div className="admin-users-error">
        <p>{error}</p>
        <button onClick={() => {
          setError(null);
          fetchUsersStats();
          fetchUsers();
        }}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="admin-users-container">
      {/* Stats Section */}
      <div className="admin-users-stats">
        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon">
            <i className="bi bi-people-fill"></i>
          </div>
          <div className="admin-users-stat-content">
            <h3>Total Users</h3>
            <div className="admin-users-stat-number">{stats.totalUsers}</div>
          </div>
        </div>
        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon">
            <i className="bi bi-person-plus-fill"></i>
          </div>
          <div className="admin-users-stat-content">
            <h3>Today's Users</h3>
            <div className="admin-users-stat-number">{stats.todayUsers}</div>
          </div>
        </div>
        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon">
            <i className="bi bi-graph-up"></i>
          </div>
          <div className="admin-users-stat-content">
            <h3>This Month</h3>
            <div className="admin-users-stat-number">{stats.monthUsers}</div>
          </div>
        </div>
      </div>

      {/* Search and User List Section */}
      <div className="admin-users-content">
        <div className="admin-users-header">
          <h2>User Management</h2>
          <form onSubmit={handleSearch} className="admin-users-search-form">
            <div className="admin-users-search-input">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="admin-users-search-button">
              Search
            </button>
          </form>
        </div>

        {isLoading ? (
          <div className="admin-users-loading">
            <div className="admin-users-spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <>
            <div className="admin-users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>College</th>
                    <th>Course</th>
                    <th>Joined Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="admin-users-info">
                          <img 
                            src={user.UserProfile?.profileUrl
                              ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${user.UserProfile?.profileUrl}`
                              : "/assets/Utils/male.png"} 
                            alt={user.name}
                            className="admin-users-avatar"
                          />
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.UserProfile?.collegeName || '-'}</td>
                      <td>{user.UserProfile?.courseName || '-'}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button 
                          className="admin-users-action-button view"
                          onClick={() => handleViewMore(user.id)}
                        >
                          <i className="bi bi-eye"></i> View More
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="admin-users-pagination">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={pagination.page === page ? 'active' : ''}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

