import React from 'react';
import './TermsOfService.css';
import { FaEnvelope } from 'react-icons/fa';

export const TermsOfService = () => {
    return (
        <div className="terms-container">
            <h1 className="terms-title">Terms of Service</h1>
            <p className="terms-effective-date">Effective Date: 18/04/2025</p>
            <p className="terms-intro">
                Welcome to SarthiQ ("we," "our," "us," or "the Platform"), a web-based community where college students showcase portfolios, collaborate on interdisciplinary projects, and align with real-world opportunities. The Platform also enables startups, companies, and organizations to engage with students by offering internships, mentorships, and project opportunities.
                <br /><br />
                By accessing or using SarthiQ, you agree to be bound by these Terms of Service ("Terms"). If you do not agree with any part of the Terms, please refrain from using the Platform.
            </p>

            <div className="terms-section">
                <h2 className="terms-section-title">1. Eligibility</h2>
                <p>You may use SarthiQ if:</p>
                <ul className="terms-list">
                    <li className="terms-list-item">You are a college student, faculty member, startup, company representative, or educational institution;</li>
                    <li className="terms-list-item">You are at least 16 years old or have the required parental/guardian consent if under 18;</li>
                    <li className="terms-list-item">You comply with all applicable laws and these Terms.</li>
                </ul>
            </div>

            <hr className="terms-divider" />

            <div className="terms-section">
                <h2 className="terms-section-title">2. User Types and Accounts</h2>
                <p>SarthiQ supports the following types of users:</p>
                <ul className="terms-list">
                    <li className="terms-list-item">Students – to build and showcase portfolios, join teams, and participate in projects;</li>
                    <li className="terms-list-item">Educators/Institutions – to guide and support student learning and engagement;</li>
                    <li className="terms-list-item">Startups/Companies/Organizations – to post internship opportunities, projects, challenges, and collaborate with student talent.</li>
                </ul>
                <p>All users agree to:</p>
                <ul className="terms-list">
                    <li className="terms-list-item">Provide accurate and truthful information during account registration;</li>
                    <li className="terms-list-item">Keep account credentials confidential and secure;</li>
                    <li className="terms-list-item">Be responsible for all activities under their account.</li>
                </ul>
                <p>We reserve the right to suspend or terminate any account for misconduct, misrepresentation, or violation of these Terms.</p>
            </div>

            <hr className="terms-divider" />

            <div className="terms-section">
                <h2 className="terms-section-title">3. Platform Usage</h2>
                <p>As a user of SarthiQ, you agree to:</p>
                <ul className="terms-list">
                    <li className="terms-list-item">Use the Platform for educational, professional, or collaborative purposes;</li>
                    <li className="terms-list-item">Not post or promote any misleading, harmful, or offensive content;</li>
                    <li className="terms-list-item">Not impersonate others or engage in unethical recruitment, spam, or solicitation.</li>
                </ul>
                <p>Companies and startups must ensure that:</p>
                <ul className="terms-list">
                    <li className="terms-list-item">Internship or project postings are authentic, clearly described, and follow labor and internship laws applicable in your region;</li>
                    <li className="terms-list-item">You do not solicit payment from students to apply or participate;</li>
                    <li className="terms-list-item">Any communication or collaboration with students remains professional and in line with our community guidelines.</li>
                </ul>
            </div>

            <hr className="terms-divider" />

            <div className="terms-section">
                <h2 className="terms-section-title">4. Content and Ownership</h2>
                <p>You retain full rights to the content you post (e.g., projects, posts, internship details). However, by submitting content, you grant SarthiQ a non-exclusive, royalty-free, worldwide license to display, promote, or share your content on the Platform and associated social channels, solely for community-building and visibility.</p>
            </div>

            <hr className="terms-divider" />

            <div className="terms-section">
                <h2 className="terms-section-title">5. Intellectual Property</h2>
                <p>SarthiQ and its logos, features, user interface, and platform design are the intellectual property of SarthiQ and may not be copied or reused without permission.</p>
            </div>

            <hr className="terms-divider" />

            <div className="terms-section">
                <h2 className="terms-section-title">6. Visibility, Ranking, and Metrics</h2>
                <p>SarthiQ may rank or highlight individuals, teams, colleges, or companies based on engagement metrics (e.g., post reach, project collaboration, internship participation). These are dynamic and meant to encourage merit-based recognition—not academic or official performance measurement.</p>
            </div>

            <hr className="terms-divider" />

            <div className="terms-section">
                <h2 className="terms-section-title">7. Third-Party Services</h2>
                <p>SarthiQ may integrate with platforms like LinkedIn, Instagram, or GitHub. Use of third-party services is at your own risk and governed by their respective terms.</p>
            </div>

            <hr className="terms-divider" />

            <div className="terms-section">
                <h2 className="terms-section-title">8. Termination</h2>
                <p>We reserve the right to suspend or terminate any account for violations of these Terms, misuse of the Platform, or harmful conduct toward the community.</p>
            </div>

            <hr className="terms-divider" />

            <div className="terms-section">
                <h2 className="terms-section-title">9. Disclaimers</h2>
                <p>We do not guarantee:</p>
                <ul className="terms-list">
                    <li className="terms-list-item">Job or internship placement;</li>
                    <li className="terms-list-item">The accuracy of user-posted content;</li>
                    <li className="terms-list-item">Uninterrupted service or error-free operation.</li>
                </ul>
                <p>Use the Platform at your own discretion and risk.</p>
            </div>

            <hr className="terms-divider" />

            <div className="terms-section">
                <h2 className="terms-section-title">10. Limitation of Liability</h2>
                <p>SarthiQ is not liable for any direct, indirect, or incidental damages resulting from your use of the Platform or reliance on its content, including internships or projects posted by third parties.</p>
            </div>

            <hr className="terms-divider" />

            <div className="terms-section">
                <h2 className="terms-section-title">11. Changes to the Terms</h2>
                <p>We may update these Terms occasionally. Users will be notified via email or platform announcements. Continued use constitutes acceptance of the updated Terms.</p>
            </div>

            <hr className="terms-divider" />

            <div className="terms-section">
                <h2 className="terms-section-title">12. Governing Law</h2>
                <p>These Terms shall be governed and construed in accordance with the laws of India, with exclusive jurisdiction of the courts located in Lucknow, Uttar Pradesh. Any disputes arising from or relating to the use of the Platform shall be subject to the jurisdiction of these courts.</p>
            </div>

            <div className="terms-contact">
                <h2 className="terms-section-title">13. Contact Us</h2>
                <p>For questions, feedback, or concerns, contact us at:</p>
                <a href="mailto:sarthiq@gmail.com" className="terms-contact-link">
                    <span className="terms-contact-icon">
                        <FaEnvelope />
                    </span>
                    sarthiq@gmail.com
                </a>
            </div>
        </div>
    );
};
