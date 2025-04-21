import React from 'react';
import './Community.css';
import { 
    FaUsers, 
    FaComments, 
    FaHandshake, 
    FaGlobe, 
    FaLightbulb, 
    FaGraduationCap,
    FaUserFriends,
    FaBook,
    FaBrain,
    FaRocket,
    FaChartLine,
    FaHeart
} from 'react-icons/fa';

export const Community = () => {
    return (
        <div className="landing-community-container">
            <div className="landing-community-header">
                <h1 className="landing-community-title">Community & Networking</h1>
                <p className="landing-community-subtitle">
                    Connect with like-minded students, share knowledge, and build 
                    meaningful relationships that last beyond your academic journey.
                </p>
            </div>

            <div className="landing-community-features">
                <div className="landing-community-feature-card">
                    <div className="landing-community-feature-icon">
                        <FaUsers />
                    </div>
                    <h3 className="landing-community-feature-title">Student Network</h3>
                    <p className="landing-community-feature-description">
                        Connect with students from diverse backgrounds and disciplines. 
                        Share experiences and learn from each other's perspectives.
                    </p>
                </div>

                <div className="landing-community-feature-card">
                    <div className="landing-community-feature-icon">
                        <FaComments />
                    </div>
                    <h3 className="landing-community-feature-title">Discussion Forums</h3>
                    <p className="landing-community-feature-description">
                        Engage in meaningful discussions, ask questions, and share 
                        insights on various academic and professional topics.
                    </p>
                </div>

                <div className="landing-community-feature-card">
                    <div className="landing-community-feature-icon">
                        <FaHandshake />
                    </div>
                    <h3 className="landing-community-feature-title">Mentorship</h3>
                    <p className="landing-community-feature-description">
                        Find mentors who can guide you through your academic journey 
                        and help you make informed career decisions.
                    </p>
                </div>
            </div>

            <div className="landing-community-groups">
                <h2 className="landing-community-groups-title">Community Groups</h2>
                <div className="landing-community-groups-grid">
                    <div className="landing-community-group-item">
                        <div className="landing-community-group-icon">
                            <FaUserFriends />
                        </div>
                        <h4 className="landing-community-group-title">Study Groups</h4>
                        <p className="landing-community-group-description">
                            Collaborate with peers on academic subjects
                        </p>
                    </div>
                    <div className="landing-community-group-item">
                        <div className="landing-community-group-icon">
                            <FaBook />
                        </div>
                        <h4 className="landing-community-group-title">Research Circles</h4>
                        <p className="landing-community-group-description">
                            Share and discuss research findings
                        </p>
                    </div>
                    <div className="landing-community-group-item">
                        <div className="landing-community-group-icon">
                            <FaBrain />
                        </div>
                        <h4 className="landing-community-group-title">Innovation Hubs</h4>
                        <p className="landing-community-group-description">
                            Brainstorm and develop new ideas
                        </p>
                    </div>
                    <div className="landing-community-group-item">
                        <div className="landing-community-group-icon">
                            <FaGraduationCap />
                        </div>
                        <h4 className="landing-community-group-title">Career Development</h4>
                        <p className="landing-community-group-description">
                            Prepare for professional opportunities
                        </p>
                    </div>
                </div>
            </div>

            <div className="landing-community-benefits">
                <h2 className="landing-community-benefits-title">Why Join Our Community?</h2>
                <div className="landing-community-benefits-grid">
                    <div className="landing-community-benefit-item">
                        <div className="landing-community-benefit-icon">
                            <FaGlobe />
                        </div>
                        <p className="landing-community-benefit-text">
                            Expand your professional network globally
                        </p>
                    </div>
                    <div className="landing-community-benefit-item">
                        <div className="landing-community-benefit-icon">
                            <FaLightbulb />
                        </div>
                        <p className="landing-community-benefit-text">
                            Gain new perspectives and insights
                        </p>
                    </div>
                    <div className="landing-community-benefit-item">
                        <div className="landing-community-benefit-icon">
                            <FaRocket />
                        </div>
                        <p className="landing-community-benefit-text">
                            Accelerate your learning journey
                        </p>
                    </div>
                    <div className="landing-community-benefit-item">
                        <div className="landing-community-benefit-icon">
                            <FaChartLine />
                        </div>
                        <p className="landing-community-benefit-text">
                            Enhance your career prospects
                        </p>
                    </div>
                    <div className="landing-community-benefit-item">
                        <div className="landing-community-benefit-icon">
                            <FaHeart />
                        </div>
                        <p className="landing-community-benefit-text">
                            Build lasting friendships and connections
                        </p>
                    </div>
                </div>
            </div>

            <div className="landing-community-cta">
                <h2 className="landing-community-cta-title">Ready to Join Our Community?</h2>
                <p className="landing-community-cta-description">
                    Connect with thousands of students who are learning, growing, 
                    and succeeding together on SarthiQ.
                </p>
                <a href="/dashboard" className="landing-community-cta-button">
                    Join Now
                </a>
            </div>
        </div>
    );
};
