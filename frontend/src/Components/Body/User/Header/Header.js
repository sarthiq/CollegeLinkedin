import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export const Header = () => {
  return (
    <header className="college-linkedin-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            CollegeLinkedIn
          </Link>
          <div className="search-container">
            <input type="text" placeholder="Search friends..." className="search-input" />
          </div>
        </div>
        
        <nav className="header-nav">
          <Link to="/" className="nav-item">
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Home</span>
          </Link>
          <Link to="/profile" className="nav-item">
            <span className="nav-icon">👤</span>
            <span className="nav-text">Profile</span>
          </Link>
          <Link to="/pages" className="nav-item">
            <span className="nav-icon">📄</span>
            <span className="nav-text">Pages</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

