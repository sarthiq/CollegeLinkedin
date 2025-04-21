import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin, setUserAuthToken } from '../../../../Store/User/auth';

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = useSelector((state) => state.userAuth.isLoggedIn);

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
        navigate('/dashboard');
        setIsMenuOpen(false);
    };

    const handleJoinNow = () => {
        dispatch(userLogin());
        dispatch(setUserAuthToken('dummy-token'));
        localStorage.setItem('token', 'dummy-token');
        navigate('/dashboard');
        setIsMenuOpen(false);
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
                    <Link to="/landing/learning" className="nav-link" onClick={toggleMenu}>
                        <div className="nav-icon-container">
                            <span className="nav-icon">🎓</span>
                            <span className="nav-text">Learning</span>
                        </div>
                    </Link>
                    <Link to="/landing/internships" className="nav-link" onClick={toggleMenu}>
                        <div className="nav-icon-container">
                            <span className="nav-icon">💼</span>
                            <span className="nav-text">Internships</span>
                        </div>
                    </Link>
                    <Link to="/landing/projects" className="nav-link" onClick={toggleMenu}>
                        <div className="nav-icon-container">
                            <span className="nav-icon">💡</span>
                            <span className="nav-text">Projects</span>
                        </div>
                    </Link>
                    <Link to="/landing/community" className="nav-link" onClick={toggleMenu}>
                        <div className="nav-icon-container">
                            <span className="nav-icon">👥</span>
                            <span className="nav-text">Community</span>
                        </div>
                    </Link>
                    <Link to="/landing/blogs" className="nav-link" onClick={toggleMenu}>
                        <div className="nav-icon-container">
                            <span className="nav-icon">📝</span>
                            <span className="nav-text">Blogs</span>
                        </div>
                    </Link>
                    <Link to="/landing/pages" className="nav-link" onClick={toggleMenu}>
                        <div className="nav-icon-container">
                            <span className="nav-icon">📚</span>
                            <span className="nav-text">Pages</span>
                        </div>
                    </Link>
                </nav>
                <nav className="nav-buttons">
                    {isLoggedIn ? (
                        <Link to="/dashboard" className="nav-btn" onClick={toggleMenu}>
                            Dashboard
                        </Link>
                    ) : (
                        <Link to="/landing#login" className="nav-btn" onClick={toggleMenu}>
                            Login
                        </Link>
                    )}
                </nav>
            </div>
            {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
        </header>
    );
}
