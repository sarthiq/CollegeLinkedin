import React from 'react';
import './Blogs.css';
import { 
    FaPenAlt, 
    FaBookReader, 
    FaShareAlt, 
    FaSearch, 
    FaTags, 
    FaComments,
    FaLightbulb,
    FaChartLine,
    FaGraduationCap,
    FaRocket,
    FaHeart,
    FaBook
} from 'react-icons/fa';

export const Blogs = () => {
    return (
        <div className="landing-blogs-container">
            <div className="landing-blogs-header">
                <h1 className="landing-blogs-title">Blogs & Articles</h1>
                <p className="landing-blogs-subtitle">
                    Discover insightful articles, share your knowledge, and engage with 
                    thought-provoking content from the student community.
                </p>
            </div>

            <div className="landing-blogs-features">
                <div className="landing-blogs-feature-card">
                    <div className="landing-blogs-feature-icon">
                        <FaPenAlt />
                    </div>
                    <h3 className="landing-blogs-feature-title">Write & Share</h3>
                    <p className="landing-blogs-feature-description">
                        Share your academic insights, research findings, and personal 
                        experiences with a community of engaged readers.
                    </p>
                </div>

                <div className="landing-blogs-feature-card">
                    <div className="landing-blogs-feature-icon">
                        <FaBookReader />
                    </div>
                    <h3 className="landing-blogs-feature-title">Read & Learn</h3>
                    <p className="landing-blogs-feature-description">
                        Access a diverse collection of articles covering academic topics, 
                        career advice, and student life experiences.
                    </p>
                </div>

                <div className="landing-blogs-feature-card">
                    <div className="landing-blogs-feature-icon">
                        <FaShareAlt />
                    </div>
                    <h3 className="landing-blogs-feature-title">Engage & Discuss</h3>
                    <p className="landing-blogs-feature-description">
                        Participate in meaningful discussions, share feedback, and 
                        connect with authors and fellow readers.
                    </p>
                </div>
            </div>

            <div className="landing-blogs-categories">
                <h2 className="landing-blogs-categories-title">Popular Categories</h2>
                <div className="landing-blogs-categories-grid">
                    <div className="landing-blogs-category-item">
                        <div className="landing-blogs-category-icon">
                            <FaSearch />
                        </div>
                        <h4 className="landing-blogs-category-title">Research Insights</h4>
                        <p className="landing-blogs-category-description">
                            Academic research and findings
                        </p>
                    </div>
                    <div className="landing-blogs-category-item">
                        <div className="landing-blogs-category-icon">
                            <FaTags />
                        </div>
                        <h4 className="landing-blogs-category-title">Study Tips</h4>
                        <p className="landing-blogs-category-description">
                            Effective learning strategies
                        </p>
                    </div>
                    <div className="landing-blogs-category-item">
                        <div className="landing-blogs-category-icon">
                            <FaComments />
                        </div>
                        <h4 className="landing-blogs-category-title">Student Stories</h4>
                        <p className="landing-blogs-category-description">
                            Personal experiences and journeys
                        </p>
                    </div>
                    <div className="landing-blogs-category-item">
                        <div className="landing-blogs-category-icon">
                            <FaBook />
                        </div>
                        <h4 className="landing-blogs-category-title">Career Guidance</h4>
                        <p className="landing-blogs-category-description">
                            Professional development advice
                        </p>
                    </div>
                </div>
            </div>

            <div className="landing-blogs-benefits">
                <h2 className="landing-blogs-benefits-title">Why Write on SarthiQ?</h2>
                <div className="landing-blogs-benefits-grid">
                    <div className="landing-blogs-benefit-item">
                        <div className="landing-blogs-benefit-icon">
                            <FaLightbulb />
                        </div>
                        <p className="landing-blogs-benefit-text">
                            Share your knowledge and expertise
                        </p>
                    </div>
                    <div className="landing-blogs-benefit-item">
                        <div className="landing-blogs-benefit-icon">
                            <FaChartLine />
                        </div>
                        <p className="landing-blogs-benefit-text">
                            Build your academic portfolio
                        </p>
                    </div>
                    <div className="landing-blogs-benefit-item">
                        <div className="landing-blogs-benefit-icon">
                            <FaGraduationCap />
                        </div>
                        <p className="landing-blogs-benefit-text">
                            Enhance your writing skills
                        </p>
                    </div>
                    <div className="landing-blogs-benefit-item">
                        <div className="landing-blogs-benefit-icon">
                            <FaRocket />
                        </div>
                        <p className="landing-blogs-benefit-text">
                            Grow your professional network
                        </p>
                    </div>
                    <div className="landing-blogs-benefit-item">
                        <div className="landing-blogs-benefit-icon">
                            <FaHeart />
                        </div>
                        <p className="landing-blogs-benefit-text">
                            Make a positive impact on others
                        </p>
                    </div>
                </div>
            </div>

            <div className="landing-blogs-cta">
                <h2 className="landing-blogs-cta-title">Ready to Start Writing?</h2>
                <p className="landing-blogs-cta-description">
                    Join our community of student writers and share your unique 
                    perspective with thousands of readers.
                </p>
                <a href="/dashboard" className="landing-blogs-cta-button">
                    Start Writing
                </a>
            </div>
        </div>
    );
};

  