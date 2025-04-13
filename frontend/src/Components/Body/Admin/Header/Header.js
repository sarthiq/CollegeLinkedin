import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { FaUser, FaSignOutAlt, FaHome, FaUsers, FaUniversity, FaCog } from "react-icons/fa";

export const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    navigate("/admin/login");
  };

  return (
    <header className="admin-header">
      <div className="admin-header-container">
        <div className="admin-logo">
          <Link to="/admin">
            <h1>Sarthiq Admin</h1>
          </Link>
        </div>

        <nav className="admin-nav">
          <ul>
            <li>
              <Link to="/admin" className="nav-link">
                <FaHome className="nav-icon" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="nav-link">
                <FaUsers className="nav-icon" />
                Users
              </Link>
            </li>
            <li>
              <Link to="/admin/institutes" className="nav-link">
                <FaUniversity className="nav-icon" />
                Institutes
              </Link>
            </li>
            <li>
              <Link to="/admin/settings" className="nav-link">
                <FaCog className="nav-icon" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>

        <div className="admin-user-controls">
          <div className="admin-user-profile">
            <FaUser className="user-icon" />
            <span>Admin</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt className="logout-icon" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
