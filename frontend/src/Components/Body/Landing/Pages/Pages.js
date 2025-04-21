import React from 'react';
import './Pages.css';
import { FaUsers, FaProjectDiagram, FaBullhorn, FaChartLine, FaHandshake, FaLightbulb, FaRocket } from 'react-icons/fa';

export const Pages = () => {
    return (
        <div className="landing-pages-container">
            <div className="landing-pages-header">
                <h1 className="landing-pages-title">College Pages</h1>
                <p className="landing-pages-subtitle">
                    Create and manage your college's presence on SarthiQ. Showcase achievements, 
                    share opportunities, and connect with students across institutions.
                </p>
            </div>

            <div className="landing-pages-features">
                <div className="landing-pages-feature-card">
                    <div className="landing-pages-feature-icon">
                        <FaUsers />
                    </div>
                    <h3 className="landing-pages-feature-title">Community Building</h3>
                    <p className="landing-pages-feature-description">
                        Create a vibrant community around your college. Share updates, 
                        achievements, and foster collaboration among students and faculty.
                    </p>
                </div>

                <div className="landing-pages-feature-card">
                    <div className="landing-pages-feature-icon">
                        <FaProjectDiagram />
                    </div>
                    <h3 className="landing-pages-feature-title">Project Showcase</h3>
                    <p className="landing-pages-feature-description">
                        Highlight student projects, research work, and innovative 
                        initiatives. Attract potential collaborators and industry partners.
                    </p>
                </div>

                <div className="landing-pages-feature-card">
                    <div className="landing-pages-feature-icon">
                        <FaBullhorn />
                    </div>
                    <h3 className="landing-pages-feature-title">Opportunity Hub</h3>
                    <p className="landing-pages-feature-description">
                        Post internships, workshops, and events. Connect students with 
                        valuable learning and career opportunities.
                    </p>
                </div>
            </div>

            <div className="landing-pages-benefits">
                <h2 className="landing-pages-benefits-title">Why Create a College Page?</h2>
                <div className="landing-pages-benefits-grid">
                    <div className="landing-pages-benefit-item">
                        <div className="landing-pages-benefit-icon">
                            <FaChartLine />
                        </div>
                        <p className="landing-pages-benefit-text">
                            Increase visibility of your college's achievements and programs
                        </p>
                    </div>
                    <div className="landing-pages-benefit-item">
                        <div className="landing-pages-benefit-icon">
                            <FaHandshake />
                        </div>
                        <p className="landing-pages-benefit-text">
                            Connect with industry partners and potential employers
                        </p>
                    </div>
                    <div className="landing-pages-benefit-item">
                        <div className="landing-pages-benefit-icon">
                            <FaLightbulb />
                        </div>
                        <p className="landing-pages-benefit-text">
                            Showcase student innovation and research projects
                        </p>
                    </div>
                    <div className="landing-pages-benefit-item">
                        <div className="landing-pages-benefit-icon">
                            <FaRocket />
                        </div>
                        <p className="landing-pages-benefit-text">
                            Boost student engagement and participation in activities
                        </p>
                    </div>
                </div>
            </div>

            <div className="landing-pages-cta">
                <h2 className="landing-pages-cta-title">Ready to Create Your College Page?</h2>
                <p className="landing-pages-cta-description">
                    Join hundreds of colleges already showcasing their achievements 
                    and connecting with students on SarthiQ.
                </p>
                <a href="/dashboard" className="landing-pages-cta-button">
                    Get Started
                </a>
            </div>
        </div>
    );
};
