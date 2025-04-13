import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="admin-footer">
      <div className="admin-footer-container">
        <div className="admin-footer-content">
          <div className="admin-footer-section">
            <h3>About Sarthiq</h3>
            <p>
              Your comprehensive platform for exploring and managing professional institutes
              across India. Empowering education seekers with informed choices.
            </p>
          </div>

          <div className="admin-footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/admin">Dashboard</Link>
              </li>
              <li>
                <Link to="/admin/users">Users</Link>
              </li>
              <li>
                <Link to="/admin/institutes">Institutes</Link>
              </li>
              <li>
                <Link to="/admin/settings">Settings</Link>
              </li>
            </ul>
          </div>

          <div className="admin-footer-section">
            <h3>Contact Us</h3>
            <ul>
              <li>Email: admin@sarthiq.com</li>
              <li>Phone: +91 1234567890</li>
              <li>Address: New Delhi, India</li>
            </ul>
          </div>

          <div className="admin-footer-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#" className="social-link">
                <FaFacebook />
              </a>
              <a href="#" className="social-link">
                <FaTwitter />
              </a>
              <a href="#" className="social-link">
                <FaLinkedin />
              </a>
              <a href="#" className="social-link">
                <FaGithub />
              </a>
            </div>
          </div>
        </div>

        <div className="admin-footer-bottom">
          <p>&copy; {new Date().getFullYear()} Sarthiq. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
