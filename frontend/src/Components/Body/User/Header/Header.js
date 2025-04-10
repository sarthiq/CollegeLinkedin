import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">
          <h1>SarthiQ</h1>
        </div>
        <div className="header-search">
          <form onSubmit={handleSearch}>
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
          <div className="nav-item" onClick={handleHomeClick}>
            <i className="fas fa-home"></i>
            <span>Home</span>
          </div>
          <div className="nav-item">
            <i className="fas fa-book"></i>
            <span>Articles</span>
          </div>
          <div className="nav-item">
            <i className="fas fa-users"></i>
            <span>People</span>
          </div>
          <div className="nav-item">
            <i className="fas fa-graduation-cap"></i>
            <span>Learning</span>
          </div>
          <div className="nav-item">
            <i className="fas fa-briefcase"></i>
            <span>Jobs</span>
          </div>
          <div className="nav-item">
            <i className="fas fa-gamepad"></i>
            <span>Games</span>
          </div>
          <div className="nav-item">
            <i className="fas fa-mobile-alt"></i>
            <span>Get the app</span>
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
                <div className="dropdown-item" onClick={handleProfileClick}>
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