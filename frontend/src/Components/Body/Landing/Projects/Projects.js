import React from 'react';
import './Projects.css';
import { 
    FaCode, 
    FaUsers, 
    FaLightbulb, 
    FaChartLine, 
    FaHandshake, 
    FaGlobe, 
    FaTrophy,
    FaProjectDiagram,
    FaRocket,
    FaBrain,
    FaTools,
    FaGraduationCap
} from 'react-icons/fa';

export const Projects = () => {
    return (
        <div className="landing-projects-container">
            <div className="landing-projects-header">
                <h1 className="landing-projects-title">Projects & Research</h1>
                <p className="landing-projects-subtitle">
                    Showcase your work, collaborate with peers, and discover innovative 
                    projects across various domains. Build your portfolio while you learn.
                </p>
            </div>

            <div className="landing-projects-features">
                <div className="landing-projects-feature-card">
                    <div className="landing-projects-feature-icon">
                        <FaCode />
                    </div>
                    <h3 className="landing-projects-feature-title">Project Showcase</h3>
                    <p className="landing-projects-feature-description">
                        Display your academic and research projects to a global audience. 
                        Get feedback and recognition for your work.
                    </p>
                </div>

                <div className="landing-projects-feature-card">
                    <div className="landing-projects-feature-icon">
                        <FaUsers />
                    </div>
                    <h3 className="landing-projects-feature-title">Team Collaboration</h3>
                    <p className="landing-projects-feature-description">
                        Find team members, collaborate in real-time, and work together 
                        on innovative projects across disciplines.
                    </p>
                </div>

                <div className="landing-projects-feature-card">
                    <div className="landing-projects-feature-icon">
                        <FaLightbulb />
                    </div>
                    <h3 className="landing-projects-feature-title">Idea Exchange</h3>
                    <p className="landing-projects-feature-description">
                        Share your ideas, get inspired by others, and find opportunities 
                        to turn concepts into reality.
                    </p>
                </div>
            </div>

            <div className="landing-projects-categories">
                <h2 className="landing-projects-categories-title">Project Categories</h2>
                <div className="landing-projects-categories-grid">
                    <div className="landing-projects-category-item">
                        <div className="landing-projects-category-icon">
                            <FaProjectDiagram />
                        </div>
                        <h4 className="landing-projects-category-title">Research Projects</h4>
                        <p className="landing-projects-category-description">
                            Academic research and scientific studies
                        </p>
                    </div>
                    <div className="landing-projects-category-item">
                        <div className="landing-projects-category-icon">
                            <FaTools />
                        </div>
                        <h4 className="landing-projects-category-title">Technical Projects</h4>
                        <p className="landing-projects-category-description">
                            Software, hardware, and engineering projects
                        </p>
                    </div>
                    <div className="landing-projects-category-item">
                        <div className="landing-projects-category-icon">
                            <FaBrain />
                        </div>
                        <h4 className="landing-projects-category-title">Innovation Projects</h4>
                        <p className="landing-projects-category-description">
                            Creative solutions and innovative ideas
                        </p>
                    </div>
                    <div className="landing-projects-category-item">
                        <div className="landing-projects-category-icon">
                            <FaGraduationCap />
                        </div>
                        <h4 className="landing-projects-category-title">Academic Projects</h4>
                        <p className="landing-projects-category-description">
                            Course projects and academic assignments
                        </p>
                    </div>
                </div>
            </div>

            <div className="landing-projects-benefits">
                <h2 className="landing-projects-benefits-title">Why Showcase Your Projects?</h2>
                <div className="landing-projects-benefits-grid">
                    <div className="landing-projects-benefit-item">
                        <div className="landing-projects-benefit-icon">
                            <FaChartLine />
                        </div>
                        <p className="landing-projects-benefit-text">
                            Build a strong portfolio for future opportunities
                        </p>
                    </div>
                    <div className="landing-projects-benefit-item">
                        <div className="landing-projects-benefit-icon">
                            <FaHandshake />
                        </div>
                        <p className="landing-projects-benefit-text">
                            Connect with potential collaborators and mentors
                        </p>
                    </div>
                    <div className="landing-projects-benefit-item">
                        <div className="landing-projects-benefit-icon">
                            <FaGlobe />
                        </div>
                        <p className="landing-projects-benefit-text">
                            Gain visibility in the global academic community
                        </p>
                    </div>
                    <div className="landing-projects-benefit-item">
                        <div className="landing-projects-benefit-icon">
                            <FaTrophy />
                        </div>
                        <p className="landing-projects-benefit-text">
                            Get recognition for your work and achievements
                        </p>
                    </div>
                    <div className="landing-projects-benefit-item">
                        <div className="landing-projects-benefit-icon">
                            <FaRocket />
                        </div>
                        <p className="landing-projects-benefit-text">
                            Accelerate your learning through collaboration
                        </p>
                    </div>
                </div>
            </div>

            <div className="landing-projects-cta">
                <h2 className="landing-projects-cta-title">Ready to Showcase Your Work?</h2>
                <p className="landing-projects-cta-description">
                    Join thousands of students who are sharing their projects and 
                    building their portfolios on SarthiQ.
                </p>
                <a href="/dashboard" className="landing-projects-cta-button">
                    Start Showcasing
                </a>
            </div>
        </div>
    );
};
