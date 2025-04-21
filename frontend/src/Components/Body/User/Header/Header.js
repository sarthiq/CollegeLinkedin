import React, { useState, useRef, useEffect } from 'react';
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
        // Don't scroll to top if it's the login link
        if (!location.hash.includes('#login')) {
            window.scrollTo(0, 0);
        }
    }, [location]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSignIn = () => {
        dispatch(userLogin());
        dispatch(setUserAuthToken('dummy-token'));
        localStorage.setItem('token', 'dummy-token');
        navigate('/home');
        setIsMenuOpen(false);
    };

    const handleJoinNow = () => {
        dispatch(userLogin());
        dispatch(setUserAuthToken('dummy-token'));
        localStorage.setItem('token', 'dummy-token');
        navigate('/home');
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        // Clear user data from localStorage
        localStorage.removeItem('token');
        // Reset auth state
        dispatch(setUserAuthToken(null));
        dispatch(userLogOut());
        // Navigate to home page
        navigate('/');
    };

    return (
        <header className="dashboard-header">
            <div className="dashboard-header-left">
                <Link to="/" className="dashboard-logo-link">
                    <h1 className="dashboard-logo">
                        <span className="dashboard-logo-text">Sarthi</span>
                        <span className="dashboard-logo-q">Q</span>
                    </h1>
                </Link>
            </div>
            <div className="dashboard-hamburger-menu" onClick={toggleMenu}>
                <div className={`dashboard-hamburger-icon ${isMenuOpen ? 'open' : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div className={`dashboard-header-right ${isMenuOpen ? 'open' : ''}`}>
                <nav className="dashboard-header-nav">
                    <Link to="/dashboard" className="dashboard-nav-link" onClick={toggleMenu}>
                        <div className="dashboard-nav-icon-container">
                            <span className="dashboard-nav-icon">🏠</span>
                            <span className="dashboard-nav-text">Dashboard</span>
                        </div>
                    </Link>
                    <Link to="/" className="dashboard-nav-link" onClick={toggleMenu}>
                        <div className="dashboard-nav-icon-container">
                            <span className="dashboard-nav-icon">🎓</span>
                            <span className="dashboard-nav-text">Learning</span>
                        </div>
                    </Link>
                    <Link to="/" className="dashboard-nav-link" onClick={toggleMenu}>
                        <div className="dashboard-nav-icon-container">
                            <span className="dashboard-nav-icon">💼</span>
                            <span className="dashboard-nav-text">Internships</span>
                        </div>
                    </Link>
                    <Link to="/" className="dashboard-nav-link" onClick={toggleMenu}>
                        <div className="dashboard-nav-icon-container">
                            <span className="dashboard-nav-icon">💡</span>
                            <span className="dashboard-nav-text">Projects</span>
                        </div>
                    </Link>
                    <Link to="/" className="dashboard-nav-link" onClick={toggleMenu}>
                        <div className="dashboard-nav-icon-container">
                            <span className="dashboard-nav-icon">👥</span>
                            <span className="dashboard-nav-text">Community</span>
                        </div>
                    </Link>
                    <Link to="/" className="dashboard-nav-link" onClick={toggleMenu}>
                        <div className="dashboard-nav-icon-container">
                            <span className="dashboard-nav-icon">📝</span>
                            <span className="dashboard-nav-text">Blogs</span>
                        </div>
                    </Link>
                    <Link to="./pages" className="dashboard-nav-link" onClick={toggleMenu}>
                        <div className="dashboard-nav-icon-container">
                            <span className="dashboard-nav-icon">📚</span>
                            <span className="dashboard-nav-text">Pages</span>
                        </div>
                    </Link>
                </nav>
                {/* <nav className="dashboard-nav-buttons">
                    <button onClick={handleJoinNow} className="dashboard-nav-btn">Join now</button>
                    <button onClick={handleSignIn} className="dashboard-nav-btn dashboard-nav-btn-secondary">Sign in</button>
                </nav> */}
                
                {/* Profile Section with Dropdown */}
                <div className="dashboard-profile-section">
                    <div className="dashboard-profile-icon">
                        <span className="dashboard-profile-avatar">👤</span>
                        <span className="dashboard-profile-text">Profile</span>
                        <span className="dashboard-dropdown-indicator">▼</span>
                    </div>
                    <div className="dashboard-profile-dropdown">
                        <Link to="./profile" className="dashboard-dropdown-item">
                            <span className="dashboard-dropdown-icon">👤</span>
                            My Profile
                        </Link>
                        <Link to="./account-settings" className="dashboard-dropdown-item">
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
