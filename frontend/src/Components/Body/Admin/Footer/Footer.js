import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer = ({ isLoggedIn }) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="admin-footer">
            <div className="admin-footer-content">
                <div className="admin-footer-section">
                    <div className="admin-footer-logo">
                        <Link to="/admin" className="admin-footer-logo-link">
                            <span className="admin-footer-logo-text">Sarthi</span>
                            <span className="admin-footer-logo-q">Q</span>
                        </Link>
                    </div>
                    <p className="admin-footer-description">
                        Empowering students with the tools and resources they need to succeed in their academic and professional journeys.
                    </p>
                </div>

                {isLoggedIn && (
                    <div className="admin-footer-links">
                        <div className="admin-footer-links-column">
                            <h3 className="admin-footer-links-title">Quick Links</h3>
                            <ul className="admin-footer-links-list">
                                <li>
                                    <Link to="/admin" className="admin-footer-link">Dashboard</Link>
                                </li>
                                <li>
                                    <Link to="/admin/users" className="admin-footer-link">Users</Link>
                                </li>
                                <li>
                                    <Link to="/admin/content" className="admin-footer-link">Content</Link>
                                </li>
                                <li>
                                    <Link to="/admin/settings" className="admin-footer-link">Settings</Link>
                                </li>
                            </ul>
                        </div>

                        <div className="admin-footer-links-column">
                            <h3 className="admin-footer-links-title">Support</h3>
                            <ul className="admin-footer-links-list">
                                <li>
                                    <Link to="/admin/help" className="admin-footer-link">Help Center</Link>
                                </li>
                                <li>
                                    <Link to="/admin/contact" className="admin-footer-link">Contact Us</Link>
                                </li>
                                <li>
                                    <Link to="/admin/faq" className="admin-footer-link">FAQ</Link>
                                </li>
                                <li>
                                    <Link to="/admin/feedback" className="admin-footer-link">Feedback</Link>
                                </li>
                            </ul>
                        </div>

                        <div className="admin-footer-links-column">
                            <h3 className="admin-footer-links-title">Legal</h3>
                            <ul className="admin-footer-links-list">
                                <li>
                                    <Link to="/admin/privacy" className="admin-footer-link">Privacy Policy</Link>
                                </li>
                                <li>
                                    <Link to="/admin/terms" className="admin-footer-link">Terms of Service</Link>
                                </li>
                                <li>
                                    <Link to="/admin/cookies" className="admin-footer-link">Cookie Policy</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            <div className="admin-footer-bottom">
                <div className="admin-footer-copyright">
                    © {currentYear} SarthiQ. All rights reserved.
                </div>
                <div className="admin-footer-social">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="admin-footer-social-link">
                        <i className="bi bi-facebook"></i>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="admin-footer-social-link">
                        <i className="bi bi-twitter"></i>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="admin-footer-social-link">
                        <i className="bi bi-linkedin"></i>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="admin-footer-social-link">
                        <i className="bi bi-instagram"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
};
