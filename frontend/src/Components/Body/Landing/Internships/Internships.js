import React from 'react';
import './Internships.css';
import { 
    FaBriefcase, 
    FaGraduationCap, 
    FaNetworkWired, 
    FaChartLine, 
    FaHandshake, 
    FaLightbulb, 
    FaUserTie, 
    FaGlobe 
} from 'react-icons/fa';

export const Internships = () => {
    return (
        <div className="landing-internships-container">
            <div className="landing-internships-header">
                <h1 className="landing-internships-title">Internships & Career Opportunities</h1>
                <p className="landing-internships-subtitle">
                    Connect with top companies and startups for internships, research projects, 
                    and full-time opportunities. Build your career while you study.
                </p>
            </div>

            <div className="landing-internships-features">
                <div className="landing-internships-feature-card">
                    <div className="landing-internships-feature-icon">
                        <FaBriefcase />
                    </div>
                    <h3 className="landing-internships-feature-title">Industry Experience</h3>
                    <p className="landing-internships-feature-description">
                        Gain hands-on experience with real-world projects and industry 
                        challenges. Work alongside professionals and build your portfolio.
                    </p>
                </div>

                <div className="landing-internships-feature-card">
                    <div className="landing-internships-feature-icon">
                        <FaGraduationCap />
                    </div>
                    <h3 className="landing-internships-feature-title">Academic Credit</h3>
                    <p className="landing-internships-feature-description">
                        Many internships can count towards your academic credits. 
                        Get practical experience while fulfilling your degree requirements.
                    </p>
                </div>

                <div className="landing-internships-feature-card">
                    <div className="landing-internships-feature-icon">
                        <FaNetworkWired />
                    </div>
                    <h3 className="landing-internships-feature-title">Professional Network</h3>
                    <p className="landing-internships-feature-description">
                        Build valuable connections with industry professionals, 
                        mentors, and potential future employers.
                    </p>
                </div>
            </div>

            <div className="landing-internships-stats">
                <h2 className="landing-internships-stats-title">Why Internships Matter</h2>
                <div className="landing-internships-stats-grid">
                    <div className="landing-internships-stat-item">
                        <div className="landing-internships-stat-number">70%</div>
                        <div className="landing-internships-stat-label">
                            of interns receive full-time job offers
                        </div>
                    </div>
                    <div className="landing-internships-stat-item">
                        <div className="landing-internships-stat-number">3x</div>
                        <div className="landing-internships-stat-label">
                            higher chance of getting hired
                        </div>
                    </div>
                    <div className="landing-internships-stat-item">
                        <div className="landing-internships-stat-number">85%</div>
                        <div className="landing-internships-stat-label">
                            of employers prefer candidates with internship experience
                        </div>
                    </div>
                </div>
            </div>

            <div className="landing-internships-benefits">
                <h2 className="landing-internships-benefits-title">Benefits of Internships</h2>
                <div className="landing-internships-benefits-grid">
                    <div className="landing-internships-benefit-item">
                        <div className="landing-internships-benefit-icon">
                            <FaChartLine />
                        </div>
                        <p className="landing-internships-benefit-text">
                            Develop practical skills and industry knowledge
                        </p>
                    </div>
                    <div className="landing-internships-benefit-item">
                        <div className="landing-internships-benefit-icon">
                            <FaHandshake />
                        </div>
                        <p className="landing-internships-benefit-text">
                            Build professional relationships and network
                        </p>
                    </div>
                    <div className="landing-internships-benefit-item">
                        <div className="landing-internships-benefit-icon">
                            <FaLightbulb />
                        </div>
                        <p className="landing-internships-benefit-text">
                            Explore different career paths and industries
                        </p>
                    </div>
                    <div className="landing-internships-benefit-item">
                        <div className="landing-internships-benefit-icon">
                            <FaUserTie />
                        </div>
                        <p className="landing-internships-benefit-text">
                            Enhance your resume and professional profile
                        </p>
                    </div>
                    <div className="landing-internships-benefit-item">
                        <div className="landing-internships-benefit-icon">
                            <FaGlobe />
                        </div>
                        <p className="landing-internships-benefit-text">
                            Gain exposure to global work environments
                        </p>
                    </div>
                </div>
            </div>

            <div className="landing-internships-cta">
                <h2 className="landing-internships-cta-title">Ready to Start Your Career Journey?</h2>
                <p className="landing-internships-cta-description">
                    Join thousands of students who have found their dream internships 
                    and kickstarted their careers through SarthiQ.
                </p>
                <a href="/dashboard" className="landing-internships-cta-button">
                    Explore Opportunities
                </a>
            </div>
        </div>
    );
};
