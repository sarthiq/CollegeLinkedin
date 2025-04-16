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
                        <Link to="/about">About</Link>
                        <Link to="/blogs">Blogs</Link>
                        <Link to="/community">Community</Link>
                    </div>
                    <div className="footer-section">
                        <h3>Browse</h3>
                        <Link to="/learning">Learning</Link>
                        <Link to="/projects">Projects</Link>
                        <Link to="/internships">Internships</Link>
                    </div>
                    <div className="footer-section">
                        <h3>Legal</h3>
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/cookie">Cookie Policy</Link>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} SarthiQ. All rights reserved.</p>
            </div>
        </footer>
    );
};
