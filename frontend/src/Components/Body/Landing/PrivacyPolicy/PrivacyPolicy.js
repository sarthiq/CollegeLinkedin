import React from 'react';
import './PrivacyPolicy.css';
import { FaEnvelope, FaGlobe } from 'react-icons/fa';

export const PrivacyPolicy = () => {
    return (
        <div className="privacy-policy-container">
            <h1 className="privacy-policy-title">Privacy Policy</h1>
            <p className="privacy-policy-effective-date">Effective Date: 18/04/2025</p>
            <p className="privacy-policy-intro">
                At SarthiQ, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services.
            </p>

            <div className="privacy-policy-section">
                <h2 className="privacy-policy-section-title">1. Information We Collect</h2>
                <p>We may collect the following types of information:</p>
                <ul className="privacy-policy-list">
                    <li className="privacy-policy-list-item">Personal Information: Name, email, phone number, college name, degree, year of study, etc.</li>
                    <li className="privacy-policy-list-item">Profile & Interests: Your chosen career interests, skills, projects, resume details, social links.</li>
                    <li className="privacy-policy-list-item">Usage Data: How you use our platform (pages visited, time spent, interactions, clicks).</li>
                    <li className="privacy-policy-list-item">Project Participation: Data related to assignments, tasks, internships, or team activities.</li>
                    <li className="privacy-policy-list-item">Communication Data: Messages, emails, or chats exchanged within the platform.</li>
                </ul>
            </div>

            <hr className="privacy-policy-divider" />

            <div className="privacy-policy-section">
                <h2 className="privacy-policy-section-title">2. How We Use Your Information</h2>
                <p>We use your data to:</p>
                <ul className="privacy-policy-list">
                    <li className="privacy-policy-list-item">Create and manage your student profile</li>
                    <li className="privacy-policy-list-item">Match you with projects, internships, and startup opportunities</li>
                    <li className="privacy-policy-list-item">Recommend skills, courses, and community groups</li>
                    <li className="privacy-policy-list-item">Help startups discover and connect with suitable student profiles</li>
                    <li className="privacy-policy-list-item">Improve and personalize your experience on Sarthiq</li>
                    <li className="privacy-policy-list-item">Communicate important updates and opportunities</li>
                </ul>
            </div>

            <hr className="privacy-policy-divider" />

            <div className="privacy-policy-section">
                <h2 className="privacy-policy-section-title">3. Data Sharing</h2>
                <p>We do not sell your data.</p>
                <p>We may share your information only with:</p>
                <ul className="privacy-policy-list">
                    <li className="privacy-policy-list-item">Startups or companies posting opportunities you apply to</li>
                    <li className="privacy-policy-list-item">Educational institutions for collaboration purposes</li>
                    <li className="privacy-policy-list-item">Third-party service providers (e.g., for email or hosting) under strict privacy terms</li>
                </ul>
            </div>

            <hr className="privacy-policy-divider" />

            <div className="privacy-policy-section">
                <h2 className="privacy-policy-section-title">4. Data Security</h2>
                <p>We use industry-standard security measures to protect your information from unauthorized access, misuse, or disclosure. However, no method of transmission over the internet is 100% secure.</p>
            </div>

            <hr className="privacy-policy-divider" />

            <div className="privacy-policy-section">
                <h2 className="privacy-policy-section-title">5. Your Rights</h2>
                <p>You can:</p>
                <ul className="privacy-policy-list">
                    <li className="privacy-policy-list-item">Access or update your profile at any time</li>
                    <li className="privacy-policy-list-item">Request deletion of your account and data</li>
                    <li className="privacy-policy-list-item">Opt out of marketing or notification emails</li>
                </ul>
                <p>To request changes, email us at: sarthiq@gmail.com</p>
            </div>

            <hr className="privacy-policy-divider" />

            <div className="privacy-policy-section">
                <h2 className="privacy-policy-section-title">6. Cookies</h2>
                <p>We use cookies to personalize your experience and understand how our platform is used. You can disable cookies through your browser settings if you prefer.</p>
            </div>

            <hr className="privacy-policy-divider" />

            <div className="privacy-policy-section">
                <h2 className="privacy-policy-section-title">7. Changes to This Policy</h2>
                <p>We may update this Privacy Policy occasionally. We'll notify you of major changes via email or through the platform.</p>
            </div>

            <div className="privacy-policy-contact">
                <h2 className="privacy-policy-contact-title">Contact Us</h2>
                <p className="privacy-policy-contact-info">If you have any questions or concerns about this policy, reach out to:</p>
                <a href="mailto:sarthiq@gmail.com" className="privacy-policy-contact-link">
                    <span className="privacy-policy-contact-icon">
                        <FaEnvelope />
                    </span>
                    sarthiq@gmail.com
                </a>
                <a href="https://www.sarthiq.com" target="_blank" rel="noopener noreferrer" className="privacy-policy-contact-link">
                    <span className="privacy-policy-contact-icon">
                        <FaGlobe />
                    </span>
                    https://www.sarthiq.com
                </a>
            </div>
        </div>
    );
};
