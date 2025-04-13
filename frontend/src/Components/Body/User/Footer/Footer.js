import React from 'react';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="college-linkedin-footer">
      <div className="footer-container">
        <div className="footer-content">
          <p>© 2024 CollegeLinkedIn. All rights reserved.</p>
          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

