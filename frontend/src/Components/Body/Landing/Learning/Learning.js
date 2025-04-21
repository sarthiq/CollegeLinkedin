import React from 'react';
import './Learning.css';
import { 
    FaBook, 
    FaLaptopCode, 
    FaUsers, 
    FaGraduationCap, 
    FaChartLine, 
    FaLightbulb, 
    FaGlobe, 
    FaClock,
    FaCertificate,
    FaProjectDiagram,
    FaBrain
} from 'react-icons/fa';

export const Learning = () => {
    return (
        <div className="landing-learning-container">
            <div className="landing-learning-header">
                <h1 className="landing-learning-title">Learning Resources</h1>
                <p className="landing-learning-subtitle">
                    Access a wide range of learning materials, courses, and resources to enhance 
                    your academic journey and professional development.
                </p>
            </div>

            <div className="landing-learning-features">
                <div className="landing-learning-feature-card">
                    <div className="landing-learning-feature-icon">
                        <FaBook />
                    </div>
                    <h3 className="landing-learning-feature-title">Course Materials</h3>
                    <p className="landing-learning-feature-description">
                        Access comprehensive course materials, lecture notes, and study 
                        resources shared by professors and fellow students.
                    </p>
                </div>

                <div className="landing-learning-feature-card">
                    <div className="landing-learning-feature-icon">
                        <FaLaptopCode />
                    </div>
                    <h3 className="landing-learning-feature-title">Online Learning</h3>
                    <p className="landing-learning-feature-description">
                        Engage with interactive online courses, video tutorials, and 
                        practical exercises to enhance your learning experience.
                    </p>
                </div>

                <div className="landing-learning-feature-card">
                    <div className="landing-learning-feature-icon">
                        <FaUsers />
                    </div>
                    <h3 className="landing-learning-feature-title">Peer Learning</h3>
                    <p className="landing-learning-feature-description">
                        Collaborate with peers, join study groups, and participate in 
                        knowledge-sharing sessions to learn together.
                    </p>
                </div>
            </div>

            <div className="landing-learning-resources">
                <h2 className="landing-learning-resources-title">Learning Resources</h2>
                <div className="landing-learning-resources-grid">
                    <div className="landing-learning-resource-item">
                        <div className="landing-learning-resource-icon">
                            <FaGraduationCap />
                        </div>
                        <h4 className="landing-learning-resource-title">Academic Courses</h4>
                        <p className="landing-learning-resource-description">
                            Access course materials, assignments, and study guides
                        </p>
                    </div>
                    <div className="landing-learning-resource-item">
                        <div className="landing-learning-resource-icon">
                            <FaProjectDiagram />
                        </div>
                        <h4 className="landing-learning-resource-title">Project Guides</h4>
                        <p className="landing-learning-resource-description">
                            Step-by-step guides for academic and research projects
                        </p>
                    </div>
                    <div className="landing-learning-resource-item">
                        <div className="landing-learning-resource-icon">
                            <FaCertificate />
                        </div>
                        <h4 className="landing-learning-resource-title">Certifications</h4>
                        <p className="landing-learning-resource-description">
                            Industry-recognized certification courses and materials
                        </p>
                    </div>
                    <div className="landing-learning-resource-item">
                        <div className="landing-learning-resource-icon">
                            <FaBrain />
                        </div>
                        <h4 className="landing-learning-resource-title">Skill Development</h4>
                        <p className="landing-learning-resource-description">
                            Resources for developing technical and soft skills
                        </p>
                    </div>
                </div>
            </div>

            <div className="landing-learning-benefits">
                <h2 className="landing-learning-benefits-title">Benefits of Learning on SarthiQ</h2>
                <div className="landing-learning-benefits-grid">
                    <div className="landing-learning-benefit-item">
                        <div className="landing-learning-benefit-icon">
                            <FaChartLine />
                        </div>
                        <p className="landing-learning-benefit-text">
                            Track your learning progress and achievements
                        </p>
                    </div>
                    <div className="landing-learning-benefit-item">
                        <div className="landing-learning-benefit-icon">
                            <FaLightbulb />
                        </div>
                        <p className="landing-learning-benefit-text">
                            Access to innovative learning methods and resources
                        </p>
                    </div>
                    <div className="landing-learning-benefit-item">
                        <div className="landing-learning-benefit-icon">
                            <FaGlobe />
                        </div>
                        <p className="landing-learning-benefit-text">
                            Learn from global experts and industry professionals
                        </p>
                    </div>
                    <div className="landing-learning-benefit-item">
                        <div className="landing-learning-benefit-icon">
                            <FaClock />
                        </div>
                        <p className="landing-learning-benefit-text">
                            Flexible learning schedules to fit your needs
                        </p>
                    </div>
                </div>
            </div>

            <div className="landing-learning-cta">
                <h2 className="landing-learning-cta-title">Ready to Enhance Your Learning?</h2>
                <p className="landing-learning-cta-description">
                    Join thousands of students who are expanding their knowledge and 
                    skills through SarthiQ's comprehensive learning resources.
                </p>
                <a href="/dashboard" className="landing-learning-cta-button">
                    Start Learning
                </a>
            </div>
        </div>
    );
};
