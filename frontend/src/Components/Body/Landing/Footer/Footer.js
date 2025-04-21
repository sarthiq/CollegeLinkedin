import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="landing-footer">
            <div className="footer-content">
                <div className="footer-logo">
                    <Link to="/">
                        <span className="logo-text">Sarthi</span>
                        <span className="logo-q">Q</span>
                    </Link>
                </div>
                <div className="footer-links">
                    <div className="footer-section">
                        <h3>General</h3>
                        <Link to="/landing">About</Link>
                        <Link to="/landing/blogs">Blogs</Link>
                        <Link to="/landing/community">Community</Link>
                    </div>
                    <div className="footer-section">
                        <h3>Browse</h3>
                        <Link to="/landing/learning">Learning</Link>
                        <Link to="/landing/projects">Projects</Link>
                        <Link to="/landing/internships">Internships</Link>
                    </div>
                    <div className="footer-section">
                        <h3>Legal</h3>
                        <Link to="/landing/privacy">Privacy Policy</Link>
                        <Link to="/landing/terms">Terms of Service</Link>
                        <Link to="/landing/refund">Refund Policy</Link>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} SarthiQ. All rights reserved.</p>
            </div>
        </footer>
    );
};
