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
        navigate('/dashboard');
        handleNavClick();
    };

    const handleJoinNow = () => {
        dispatch(userLogin());
        dispatch(setUserAuthToken('dummy-token'));
        localStorage.setItem('token', 'dummy-token');
        navigate('/dashboard');
        handleNavClick();
    };

    return (
        <header className="landing-header">
            <div className="landing-header-left">
                <Link to="/" className="landing-logo-link">
                    <h1 className="landing-logo">
                        <span className="landing-logo-text">Sarthi</span>
                    </h1>
                </Link>
            </div>
            <div className="landing-hamburger-menu" onClick={toggleMenu}>
                <div className={`landing-hamburger-icon ${isMenuOpen ? 'open' : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div className={`landing-header-right ${isMenuOpen ? 'open' : ''}`}>
                <nav className="landing-header-nav">


                    <Link to="/landing/learning" className="landing-nav-link" onClick={handleNavClick}>
                        <div className="landing-nav-icon-container">
                            <span className="landing-nav-icon">🎓</span>
                            <span className="landing-nav-text">Learning</span>
                        </div>
                    </Link>
                    <Link to="/landing/internships" className="landing-nav-link" onClick={handleNavClick}>
                        <div className="landing-nav-icon-container">
                            <span className="landing-nav-icon">💼</span>
                            <span className="landing-nav-text">Internships</span>
                        </div>
                    </Link>
                    <Link to="/landing/projects" className="landing-nav-link" onClick={handleNavClick}>
                        <div className="landing-nav-icon-container">
                            <span className="landing-nav-icon">💡</span>
                            <span className="landing-nav-text">Projects</span>
                        </div>
                    </Link>
                    <Link to="/landing/community" className="landing-nav-link" onClick={handleNavClick}>
                        <div className="landing-nav-icon-container">
                            <span className="landing-nav-icon">👥</span>
                            <span className="landing-nav-text">Community</span>
                        </div>
                    </Link>
                    <Link to="/landing/blogs" className="landing-nav-link" onClick={handleNavClick}>
                        <div className="landing-nav-icon-container">
                            <span className="landing-nav-icon">📝</span>
                            <span className="landing-nav-text">Blogs</span>
                        </div>
                    </Link>
                    <Link to="/landing/pages" className="landing-nav-link" onClick={handleNavClick}>
                        <div className="landing-nav-icon-container">
                            <span className="landing-nav-icon">📚</span>
                            <span className="landing-nav-text">Pages</span>
                        </div>
                    </Link>
                    <a href="https://career.sarthiq.com" className="landing-nav-link" onClick={handleNavClick} target="_blank" rel="noopener noreferrer">
                        <div className="landing-nav-icon-container">
                            <span className="landing-nav-icon">🚀</span>
                            <span className="landing-nav-text">Know Thyself</span>
                        </div>
                    </a>
                    
                </nav>
                <nav className="landing-nav-buttons">
                    {isLoggedIn ? (
                        <Link to="/dashboard" className="landing-nav-btn" onClick={handleNavClick}>
                            Dashboard
                        </Link>
                    ) : (
                        <Link to="/landing#login" className="landing-nav-btn" onClick={handleNavClick}>
                            Login
                        </Link>
                    )}
                </nav>
            </div>
            {isMenuOpen && <div className="landing-menu-overlay" onClick={toggleMenu}></div>}
        </header>
    );
}
