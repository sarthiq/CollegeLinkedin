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
        <header className="landing-header">
            <div className="header-left">
                <Link to="/" className="logo-link">
                    <h1 className="logo">
                        <span className="logo-text">Sarthi</span>
                        <span className="logo-q">Q</span>
                    </h1>
                </Link>
            </div>
            <div className="hamburger-menu" onClick={toggleMenu}>
                <div className={`hamburger-icon ${isMenuOpen ? 'open' : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div className={`header-right ${isMenuOpen ? 'open' : ''}`}>
                <nav className="header-nav">
                    <Link to="/dashboard" className="nav-link" onClick={toggleMenu}>
                        <div className="nav-icon-container">
                            <span className="nav-icon">🏠</span>
                            <span className="nav-text">Dashboard</span>
                        </div>
                    </Link>
                    <Link to="/" className="nav-link" onClick={toggleMenu}>
                        <div className="nav-icon-container">
                            <span className="nav-icon">🎓</span>
                            <span className="nav-text">Learning</span>
                        </div>
                    </Link>
                    <Link to="/" className="nav-link" onClick={toggleMenu}>
                        <div className="nav-icon-container">
                            <span className="nav-icon">💼</span>
                            <span className="nav-text">Internships</span>
                        </div>
                    </Link>
                    <Link to="/" className="nav-link" onClick={toggleMenu}>
                        <div className="nav-icon-container">
                            <span className="nav-icon">💡</span>
                            <span className="nav-text">Projects</span>
                        </div>
                    </Link>
                    <Link to="/" className="nav-link" onClick={toggleMenu}>
                        <div className="nav-icon-container">
                            <span className="nav-icon">👥</span>
                            <span className="nav-text">Community</span>
                        </div>
                    </Link>
                    <Link to="/" className="nav-link" onClick={toggleMenu}>
                        <div className="nav-icon-container">
                            <span className="nav-icon">📝</span>
                            <span className="nav-text">Blogs</span>
                        </div>
                    </Link>
                    <Link to="./pages" className="nav-link" onClick={toggleMenu}>
                        <div className="nav-icon-container">
                            <span className="nav-icon">📚</span>
                            <span className="nav-text">Pages</span>
                        </div>
                    </Link>
                </nav>
                {/* <nav className="nav-buttons">
                    <button onClick={handleJoinNow} className="nav-btn">Join now</button>
                    <button onClick={handleSignIn} className="nav-btn nav-btn-secondary">Sign in</button>
                </nav> */}
                
                {/* Profile Section with Dropdown */}
                <div className="profile-section">
                    <div className="profile-icon">
                        <span className="profile-avatar">👤</span>
                        <span className="profile-text">Profile</span>
                        <span className="dropdown-indicator">▼</span>
                    </div>
                    <div className="profile-dropdown">
                        <Link to="./profile" className="dropdown-item">
                            <span className="dropdown-icon">👤</span>
                            My Profile
                        </Link>
                        <Link to="./account-settings" className="dropdown-item">
                            <span className="dropdown-icon">⚙️</span>
                            Account Settings
                        </Link>
                        <button onClick={handleLogout} className="dropdown-item logout-btn">
                            <span className="dropdown-icon">🚪</span>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
        </header>
    );
}
