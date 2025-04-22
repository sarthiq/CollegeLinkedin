import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userLogin, setUserAuthToken, userLogOut } from '../../../../Store/User/auth';

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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

    const handleSignIn = () => {
        dispatch(userLogin());
        dispatch(setUserAuthToken('dummy-token'));
        localStorage.setItem('token', 'dummy-token');
        navigate('/home');
        handleNavClick();
    };

    const handleJoinNow = () => {
        dispatch(userLogin());
        dispatch(setUserAuthToken('dummy-token'));
        localStorage.setItem('token', 'dummy-token');
        navigate('/home');
        handleNavClick();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(setUserAuthToken(null));
        dispatch(userLogOut());
        navigate('/');
        handleNavClick();
    };

    return (
        <header className="dashboard-header">
            <div className="dashboard-header-left">
                <Link to="/" className="dashboard-logo-link">
                    <h1 className="dashboard-logo">
                        <span className="dashboard-logo-text">Sarthi</span>
                    </h1>
                </Link>
                <div className="dashboard-hamburger-menu" onClick={toggleMenu}>
                    <div className={`dashboard-hamburger-icon ${isMenuOpen ? 'open' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
            <div className={`dashboard-header-right ${isMenuOpen ? 'open' : ''}`}>
                <nav className="dashboard-header-nav">
                    <Link to="/dashboard" className="dashboard-nav-link" onClick={handleNavClick}>
                        <div className="dashboard-nav-icon-container">
                            <span className="dashboard-nav-icon">🏠</span>
                            <span className="dashboard-nav-text">Dashboard</span>
                        </div>
                    </Link>
                    <Link to="/" className="dashboard-nav-link" onClick={handleNavClick}>
                        <div className="dashboard-nav-icon-container">
                            <span className="dashboard-nav-icon">🎓</span>
                            <span className="dashboard-nav-text">Learning</span>
                        </div>
                    </Link>
                    <Link to="/" className="dashboard-nav-link" onClick={handleNavClick}>
                        <div className="dashboard-nav-icon-container">
                            <span className="dashboard-nav-icon">💼</span>
                            <span className="dashboard-nav-text">Internships</span>
                        </div>
                    </Link>
                    <Link to="/" className="dashboard-nav-link" onClick={handleNavClick}>
                        <div className="dashboard-nav-icon-container">
                            <span className="dashboard-nav-icon">💡</span>
                            <span className="dashboard-nav-text">Projects</span>
                        </div>
                    </Link>
                    <Link to="/" className="dashboard-nav-link" onClick={handleNavClick}>
                        <div className="dashboard-nav-icon-container">
                            <span className="dashboard-nav-icon">👥</span>
                            <span className="dashboard-nav-text">Community</span>
                        </div>
                    </Link>
                    <Link to="/" className="dashboard-nav-link" onClick={handleNavClick}>
                        <div className="dashboard-nav-icon-container">
                            <span className="dashboard-nav-icon">📝</span>
                            <span className="dashboard-nav-text">Blogs</span>
                        </div>
                    </Link>
                    <Link to="./pages" className="dashboard-nav-link" onClick={handleNavClick}>
                        <div className="dashboard-nav-icon-container">
                            <span className="dashboard-nav-icon">📚</span>
                            <span className="dashboard-nav-text">Pages</span>
                        </div>
                    </Link>
                </nav>
                
                <div className="dashboard-profile-section">
                    <div className="dashboard-profile-icon">
                        <span className="dashboard-profile-avatar">👤</span>
                        <span className="dashboard-profile-text">Profile</span>
                        <span className="dashboard-dropdown-indicator">▼</span>
                    </div>
                    <div className="dashboard-profile-dropdown">
                        <Link to="./profile" className="dashboard-dropdown-item" onClick={handleNavClick}>
                            <span className="dashboard-dropdown-icon">👤</span>
                            My Profile
                        </Link>
                        <Link to="./account-settings" className="dashboard-dropdown-item" onClick={handleNavClick}>
                            <span className="dashboard-dropdown-icon">⚙️</span>
                            Account Settings
                        </Link>
                        <button onClick={handleLogout} className="dashboard-dropdown-item dashboard-logout-btn">
                            <span className="dashboard-dropdown-icon">🚪</span>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && <div className="dashboard-menu-overlay" onClick={toggleMenu}></div>}
        </header>
    );
}
