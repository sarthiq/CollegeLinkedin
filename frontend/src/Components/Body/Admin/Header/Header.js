import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './Header.css';
import { adminLogout } from '../../../../Store/Admin/auth';

export const Header = ({ isLoggedIn }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!location.hash.includes('#login')) {
            window.scrollTo(0, 0);
        }
    }, [location]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (!isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    };

    const handleNavClick = () => {
        setIsMenuOpen(false);
        document.body.style.overflow = 'auto';
    };

    const handleLogout = () => {
        dispatch(adminLogout());
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        handleNavClick();
    };

    return (
        <header className="admin-header">
            <div className="admin-header-left">
                <Link to="/admin" className="admin-logo-link">
                    <h1 className="admin-logo">
                        <span className="admin-logo-text">Sarthi</span>
                        <span className="admin-logo-subtext">Admin</span>
                    </h1>
                </Link>
            </div>

            {isLoggedIn ? (
                <>
                    <div className="admin-hamburger-menu" onClick={toggleMenu}>
                        <div className={`admin-hamburger-icon ${isMenuOpen ? 'open' : ''}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>

                    <div className={`admin-header-right ${isMenuOpen ? 'open' : ''}`}>
                        <nav className="admin-header-nav">
                            <Link to="/admin" className="admin-nav-link" onClick={handleNavClick}>
                                <div className="admin-nav-icon-container">
                                    <i className="bi bi-speedometer2"></i>
                                    <span className="admin-nav-text">Dashboard</span>
                                </div>
                            </Link>
                            <Link to="/admin/users" className="admin-nav-link" onClick={handleNavClick}>
                                <div className="admin-nav-icon-container">
                                    <i className="bi bi-people"></i>
                                    <span className="admin-nav-text">Users</span>
                                </div>
                            </Link>
                            <Link to="/admin/content" className="admin-nav-link" onClick={handleNavClick}>
                                <div className="admin-nav-icon-container">
                                    <i className="bi bi-file-earmark-text"></i>
                                    <span className="admin-nav-text">Content</span>
                                </div>
                            </Link>
                            <Link to="/admin/settings" className="admin-nav-link" onClick={handleNavClick}>
                                <div className="admin-nav-icon-container">
                                    <i className="bi bi-gear"></i>
                                    <span className="admin-nav-text">Settings</span>
                                </div>
                            </Link>
                        </nav>

                        <div className="admin-profile-section">
                            <div 
                                className="admin-profile-container"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                <div className="admin-profile-avatar">
                                    <i className="bi bi-person-circle"></i>
                                </div>
                                <div className="admin-profile-name">Admin</div>
                                <i className={`bi bi-chevron-down ${isProfileOpen ? 'open' : ''}`}></i>
                            </div>

                            {isProfileOpen && (
                                <div className="admin-profile-dropdown">
                                    <Link to="/admin/profile" className="admin-dropdown-item">
                                        <i className="bi bi-person"></i>
                                        <span>Profile</span>
                                    </Link>
                                    <div className="admin-dropdown-item" onClick={handleLogout}>
                                        <i className="bi bi-box-arrow-right"></i>
                                        <span>Logout</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="admin-header-right">
                    <nav className="admin-nav-buttons">
                        <Link to="/admin/login" className="admin-nav-btn">
                            Login
                        </Link>
                    </nav>
                </div>
            )}

            {isMenuOpen && <div className="admin-menu-overlay" onClick={toggleMenu}></div>}
        </header>
    );
};
