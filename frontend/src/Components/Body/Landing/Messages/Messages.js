import React from 'react';
import './Messages.css';
import { 
    FaComments, 
    FaUserFriends, 
    FaNetworkWired, 
    FaChartLine, 
    FaHandshake, 
    FaLightbulb, 
    FaGlobe,
    FaRocket,
    FaBrain,
    FaTools,
    FaGraduationCap
} from 'react-icons/fa';

export const Messages = () => {
    return (
        <div className="landing-messages-container">
            <div className="landing-messages-header">
                <h1 className="landing-messages-title">Connect & Collaborate</h1>
                <p className="landing-messages-subtitle">
                    Stay connected with your peers, mentors, and industry professionals. 
                    Share ideas, discuss projects, and build meaningful relationships.
                </p>
            </div>

            <div className="landing-messages-features">
                <div className="landing-messages-feature-card">
                    <div className="landing-messages-feature-icon">
                        <FaComments />
                    </div>
                    <h3 className="landing-messages-feature-title">Real-time Messaging</h3>
                    <p className="landing-messages-feature-description">
                        Chat instantly with your connections. Share files, code snippets, 
                        and collaborate on projects in real-time.
                    </p>
                </div>

                <div className="landing-messages-feature-card">
                    <div className="landing-messages-feature-icon">
                        <FaUserFriends />
                    </div>
                    <h3 className="landing-messages-feature-title">Group Conversations</h3>
                    <p className="landing-messages-feature-description">
                        Create groups for your projects, study sessions, or interest 
                        communities. Stay organized and connected.
                    </p>
                </div>

                <div className="landing-messages-feature-card">
                    <div className="landing-messages-feature-icon">
                        <FaNetworkWired />
                    </div>
                    <h3 className="landing-messages-feature-title">Professional Networking</h3>
                    <p className="landing-messages-feature-description">
                        Connect with industry experts, alumni, and potential mentors. 
                        Build your professional network.
                    </p>
                </div>
            </div>

            <div className="landing-messages-categories">
                <h2 className="landing-messages-categories-title">Communication Features</h2>
                <div className="landing-messages-categories-grid">
                    <div className="landing-messages-category-item">
                        <div className="landing-messages-category-icon">
                            <FaBrain />
                        </div>
                        <h4 className="landing-messages-category-title">Smart Notifications</h4>
                        <p className="landing-messages-category-description">
                            Get notified about important messages and updates
                        </p>
                    </div>
                    <div className="landing-messages-category-item">
                        <div className="landing-messages-category-icon">
                            <FaTools />
                        </div>
                        <h4 className="landing-messages-category-title">Rich Media Support</h4>
                        <p className="landing-messages-category-description">
                            Share code, images, and documents seamlessly
                        </p>
                    </div>
                    <div className="landing-messages-category-item">
                        <div className="landing-messages-category-icon">
                            <FaGraduationCap />
                        </div>
                        <h4 className="landing-messages-category-title">Academic Collaboration</h4>
                        <p className="landing-messages-category-description">
                            Work on assignments and projects together
                        </p>
                    </div>
                </div>
            </div>

            <div className="landing-messages-benefits">
                <h2 className="landing-messages-benefits-title">Why Use Our Messaging Platform?</h2>
                <div className="landing-messages-benefits-grid">
                    <div className="landing-messages-benefit-item">
                        <div className="landing-messages-benefit-icon">
                            <FaChartLine />
                        </div>
                        <p className="landing-messages-benefit-text">
                            Enhance your learning through peer discussions
                        </p>
                    </div>
                    <div className="landing-messages-benefit-item">
                        <div className="landing-messages-benefit-icon">
                            <FaHandshake />
                        </div>
                        <p className="landing-messages-benefit-text">
                            Build strong professional relationships
                        </p>
                    </div>
                    <div className="landing-messages-benefit-item">
                        <div className="landing-messages-benefit-icon">
                            <FaGlobe />
                        </div>
                        <p className="landing-messages-benefit-text">
                            Connect with students worldwide
                        </p>
                    </div>
                    <div className="landing-messages-benefit-item">
                        <div className="landing-messages-benefit-icon">
                            <FaRocket />
                        </div>
                        <p className="landing-messages-benefit-text">
                            Accelerate your career growth
                        </p>
                    </div>
                </div>
            </div>

            <div className="landing-messages-cta">
                <h2 className="landing-messages-cta-title">Ready to Start Connecting?</h2>
                <p className="landing-messages-cta-description">
                    Join thousands of students who are building their networks and 
                    collaborating on SarthiQ.
                </p>
                <a href="/dashboard" className="landing-messages-cta-button">
                    Start Messaging
                </a>
            </div>
        </div>
    );
};
