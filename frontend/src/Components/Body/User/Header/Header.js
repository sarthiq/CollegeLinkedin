import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserAuthToken, userLogOut } from '../../../../Store/User/auth';
import { socketService } from '../../../../services/socketService';
import { getUnreadMessagesCountHandler } from '../Messages/messagesApiHandler';
import 'bootstrap-icons/font/bootstrap-icons.css';

// New Badge Component
const NewBadge = () => {
  return (
    <div className="new-badge">
      New
    </div>
  );
};

// Message Badge Component
const MessageBadge = ({ count }) => {
  if (!count) return null;
  return (
    <div className="message-badge">
      {count}
    </div>
  );
};

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchText, setSearchText] = useState('');
    const token = useSelector(state => state.userAuth.token);

    // Fetch initial unread messages count
    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (!token) return;
            
            try {
                const response = await getUnreadMessagesCountHandler(
                    {},
                    () => {},
                    (error) => console.error('Error fetching unread count:', error)
                );
                
                if (response && response.success) {
                    setUnreadMessageCount(response.data.totalUnreadCount);
                }
            } catch (error) {
                console.error('Error fetching unread messages count:', error);
            }
        };

        fetchUnreadCount();
    }, [token]);

    useEffect(() => {
        if (!location.hash.includes('#login')) {
            window.scrollTo(0, 0);
        }
    }, [location]);

    // Socket event handlers for messages
    useEffect(() => {
        if (!token) return;

        const handleNewMessage = (message) => {
            if (location.pathname !== '/dashboard/messages') {
                setUnreadMessageCount(prev => prev + 1);
            }
        };

        const handleNewMessageNotification = (data) => {
            console.log("New message notification received:", data);
            if (location.pathname !== '/dashboard/messages') {
                setUnreadMessageCount(prev => prev + 1);
            }
        };

        const handleMessagesRead = () => {
            setUnreadMessageCount(0);
        };

        socketService.on('new_message', handleNewMessage);
        socketService.on('new_message_notification', handleNewMessageNotification);
        socketService.on('messages_read', handleMessagesRead);

        return () => {
            socketService.off('new_message', handleNewMessage);
            socketService.off('new_message_notification', handleNewMessageNotification);
            socketService.off('messages_read', handleMessagesRead);
        };
    }, [token, location.pathname]);

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
        localStorage.removeItem('token');
        dispatch(setUserAuthToken(null));
        dispatch(userLogOut());
        navigate('/');
        handleNavClick();
    };

    const handleSearchClick = () => {
        if (location.pathname !== '/dashboard/search') {
            navigate('/dashboard/search');
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchText.trim()) {
            navigate(`/dashboard/search?q=${encodeURIComponent(searchText.trim())}`);
        }
    };

    return (
        <header className="dashboard-header">
            <div className="dashboard-header-left">
                <Link to="/dashboard" className="dashboard-logo-link">
                    <h1 className="dashboard-logo">
                        <span className="dashboard-logo-text">Sarthi</span>
                    </h1>
                </Link>
                <div className="dashboard-search-container">
                    {location.pathname === '/dashboard/search' ? (
                        <form onSubmit={handleSearchSubmit} className="dashboard-search-form">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="dashboard-search-input"
                            />
                            <button type="submit" className="dashboard-search-button">
                                🔍
                            </button>
                        </form>
                    ) : (
                        <div 
                            className="dashboard-search-placeholder"
                            onClick={handleSearchClick}
                        >
                            🔍 Search...
                        </div>
                    )}
                </div>
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
                    {/* <Link to="/dashboard" className="dashboard-nav-link" onClick={handleNavClick}>
                        <div className="dashboard-nav-icon-container">
                            <span className="dashboard-nav-icon">🏠</span>
                            <span className="dashboard-nav-text">Dashboard</span>
                        </div>
                    </Link> */}
                    {/* <Link to="/" className="dashboard-nav-link" onClick={handleNavClick}>
                        <div className="dashboard-nav-icon-container">
                            <span className="dashboard-nav-icon">🎓</span>
                            <span className="dashboard-nav-text">Learning</span>
                        </div>
                    </Link> */}
                    <Link to="/dashboard/internships" className="dashboard-nav-link" onClick={handleNavClick}>
                        <div className="dashboard-nav-icon-container">
                            <i className="bi bi-briefcase"></i>
                            <span className="dashboard-nav-text">Internships</span>
                            <NewBadge />
                        </div>
                    </Link>
                    <Link to="/dashboard/projects" className="dashboard-nav-link" onClick={handleNavClick}>
                        <div className="dashboard-nav-icon-container">
                            <i className="bi bi-lightbulb"></i>
                            <span className="dashboard-nav-text">Projects</span>
                            <NewBadge />
                        </div>
                    </Link>
                    <Link to="/dashboard" className="dashboard-nav-link" onClick={handleNavClick}>
                        <div className="dashboard-nav-icon-container">
                            <i className="bi bi-people"></i>
                            <span className="dashboard-nav-text">Community</span>
                        </div>
                    </Link>
                    <Link to="/dashboard" className="dashboard-nav-link" onClick={handleNavClick}>
                        <div className="dashboard-nav-icon-container">
                            <i className="bi bi-pencil-square"></i>
                            <span className="dashboard-nav-text">Blogs</span>
                        </div>
                    </Link>
                    <Link to="./pages" className="dashboard-nav-link" onClick={handleNavClick}>
                        <div className="dashboard-nav-icon-container">
                            <i className="bi bi-book"></i>
                            <span className="dashboard-nav-text">Pages</span>
                            <NewBadge />
                        </div>
                    </Link>
                    <Link to="/dashboard/messages" className="dashboard-nav-link" onClick={handleNavClick}>
                        <div className="dashboard-nav-icon-container">
                            <i className="bi bi-chat-dots"></i>
                            <span className="dashboard-nav-text">Messages</span>
                            <MessageBadge count={unreadMessageCount} />
                        </div>
                    </Link>
                    <a href="https://career.sarthiq.com" className="dashboard-nav-link" onClick={handleNavClick} target="_blank" rel="noopener noreferrer">
                        <div className="dashboard-nav-icon-container">
                            <i className="bi bi-rocket-takeoff"></i>
                            <span className="dashboard-nav-text">Know Thyself</span>
                        </div>
                    </a>
                </nav>
                
                <div className="dashboard-profile-section">
                    <div className="dashboard-profile-icon">
                        <i className="bi bi-person-circle"></i>
                        <span className="dashboard-profile-text">Profile</span>
                        <i className="bi bi-chevron-down"></i>
                    </div>
                    <div className="dashboard-profile-dropdown">
                        <Link to="./profile" className="dashboard-dropdown-item" onClick={handleNavClick}>
                            <i className="bi bi-person"></i>
                            My Profile
                        </Link>
                        <Link to="./account-settings" className="dashboard-dropdown-item" onClick={handleNavClick}>
                            <i className="bi bi-gear"></i>
                            Account Settings
                        </Link>
                        <button onClick={handleLogout} className="dashboard-dropdown-item dashboard-logout-btn">
                            <i className="bi bi-box-arrow-right"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && <div className="dashboard-menu-overlay" onClick={toggleMenu}></div>}
        </header>
    );
}
