import React, { useState } from 'react';
import './Header.css';

const Header = ({ onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">
          <h1>CollegeLinkedIn</h1>
        </div>
        <div className="header-search">
          <form onSubmit={handleSearch}>
            <div className="search-icon">
              <i className="fas fa-search"></i>
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </div>

      <div className="header-right">
        <nav className="header-nav">
          <div className="nav-item active">
            <i className="fas fa-home"></i>
            <span>Home</span>
          </div>
          <div className="nav-item">
            <i className="fas fa-user-friends"></i>
            <span>My Network</span>
          </div>
          <div className="nav-item">
            <i className="fas fa-briefcase"></i>
            <span>Jobs</span>
          </div>
          <div className="nav-item">
            <i className="fas fa-comment-dots"></i>
            <span>Messaging</span>
          </div>
          <div className="nav-item">
            <i className="fas fa-bell"></i>
            <span>Notifications</span>
          </div>
          <div className="nav-item profile-menu" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <div className="profile-image">
              <img src="https://randomuser.me/api/portraits/men/4.jpg" alt="Profile" />
            </div>
            <span>Me</span>
            <i className="fas fa-caret-down"></i>
            
            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-profile">
                    <img src="https://randomuser.me/api/portraits/men/4.jpg" alt="Profile" />
                    <div className="dropdown-info">
                      <h3>Your Name</h3>
                      <p>See your profile</p>
                    </div>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item">
                  <i className="fas fa-user"></i>
                  <span>View Profile</span>
                </div>
                <div className="dropdown-item">
                  <i className="fas fa-cog"></i>
                  <span>Settings</span>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Sign Out</span>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 