import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getFollowersHandler, getFollowingHandler, toggleFollowHandler } from "../followsApiHandler";
import "./FollowersOrFollowing.css";

export const FollowersOrFollowing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("userId");
  const type = searchParams.get("type"); // "followers" or "following"
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const fetchUsers = async (page = 1) => {
    try {
      setIsLoading(true);
      const handler = type === "followers" ? getFollowersHandler : getFollowingHandler;
      const requestData = { page, limit: pagination.limit };
      if (userId) requestData.userId = userId;
      
      const response = await handler(
        requestData,
        setIsLoading,
        setError
      );

      if (response && response.success) {
        setUsers(response.data[type]);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      setError("Error fetching users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (type) {
      fetchUsers();
    }
  }, [type, userId]);

  const handleFollowToggle = async (targetUserId) => {
    try {
      const response = await toggleFollowHandler(
        { userId: targetUserId },
        setIsLoading,
        setError
      );
      if (response && response.success) {
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === targetUserId 
              ? { ...user, isFollowing: !user.isFollowing }
              : user
          )
        );
      }
    } catch (error) {
      setError("Error toggling follow status");
    }
  };

  const handlePageChange = (newPage) => {
    fetchUsers(newPage);
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  if (!type) {
    return <div className="error">Type parameter is required</div>;
  }

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="followers-following-container">
      <div className="header">
        <button className="back-button" onClick={handleBackClick}>
          ← Back
        </button>
        <div className="title-container">
          <h2>{type === "followers" ? "Followers" : "Following"}</h2>
          <span className="count-badge">{pagination.total} {type}</span>
        </div>
      </div>
      
      <div className="users-list">
        {users.length === 0 ? (
          <div className="no-users">No {type} found</div>
        ) : (
          users.map(user => (
            <div key={user.id} className="user-card">
              <img 
                src={
                  user.UserProfile?.profileUrl
                    ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${user.UserProfile.profileUrl}`
                    : "/assets/Utils/male.png"
                }
                alt={user.name}
                className="user-avatar"
              />
              <div className="user-info">
                <h3>{user.name}</h3>
              </div>
              {type === "following" && (
                <button
                  className={`follow-button ${user.isFollowing ? 'unfollow' : 'follow'}`}
                  onClick={() => handleFollowToggle(user.id)}
                >
                  {user.isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {users.length > 0 && (
        <div className="pagination">
          <button
            disabled={!pagination.hasPrevPage}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
          >
            Previous
          </button>
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            disabled={!pagination.hasNextPage}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

