import React from 'react';
import './RefundPolicy.css';
import { FaEnvelope } from 'react-icons/fa';

export const RefundPolicy = () => {
    return (
        <div className="refund-policy-container">
            <h1 className="refund-policy-title">Refund Policy</h1>
            <p className="refund-policy-effective-date">Effective Date: 18/04/2025</p>
            <p className="refund-policy-intro">
                At SarthiQ, we aim to provide high-quality services that support students in their educational and career journeys. Your satisfaction is important to us. However, as our offerings are primarily digital in nature, we have structured our refund policy to ensure fairness and transparency for all users.
            </p>

            <div className="refund-policy-section">
                <h2 className="refund-policy-section-title">1. General Policy</h2>
                <ul className="refund-policy-list">
                    <li className="refund-policy-list-item">All purchases made on the SarthiQ platform are considered final.</li>
                    <li className="refund-policy-list-item">We do not offer refunds on:</li>
                    <ul className="refund-policy-sublist">
                        <li className="refund-policy-sublist-item">Digital assessments</li>
                        <li className="refund-policy-sublist-item">Subscription plans (monthly, quarterly, or annual)</li>
                        <li className="refund-policy-sublist-item">Project listing or promotion services</li>
                        <li className="refund-policy-sublist-item">Skill-building modules or mentorship sessions once accessed</li>
                    </ul>
                </ul>
            </div>

            <hr className="refund-policy-divider" />

            <div className="refund-policy-section">
                <h2 className="refund-policy-section-title">2. Eligibility for Refunds</h2>
                <p>Refunds may be considered only under the following circumstances:</p>
                <ul className="refund-policy-list">
                    <li className="refund-policy-list-item">Technical issues: If you were unable to access paid features due to a confirmed technical issue on our platform, and our support team was unable to resolve it within 7 business days.</li>
                    <li className="refund-policy-list-item">Duplicate payment: If you were accidentally charged more than once for the same product/service.</li>
                    <li className="refund-policy-list-item">Unauthorized transaction: If a purchase was made without your consent (subject to investigation and proof).</li>
                </ul>
            </div>

            <hr className="refund-policy-divider" />

            <div className="refund-policy-section">
                <h2 className="refund-policy-section-title">3. Request Process</h2>
                <p>To request a refund, please:</p>
                <ol className="refund-policy-list">
                    <li className="refund-policy-list-item">Email us at sarthiq@gmail.com within 7 days of the transaction.</li>
                    <li className="refund-policy-list-item">Include:</li>
                    <ul className="refund-policy-sublist">
                        <li className="refund-policy-sublist-item">Your full name and registered email</li>
                        <li className="refund-policy-sublist-item">Date and time of the transaction</li>
                        <li className="refund-policy-sublist-item">Description of the issue</li>
                        <li className="refund-policy-sublist-item">Screenshots or payment proof (if applicable)</li>
                    </ul>
                </ol>
                <p>We will respond within 10 business days to acknowledge your request and provide a resolution within 15 business days.</p>
            </div>

            <hr className="refund-policy-divider" />

            <div className="refund-policy-section">
                <h2 className="refund-policy-section-title">4. Subscription Cancellations</h2>
                <ul className="refund-policy-list">
                    <li className="refund-policy-list-item">You may cancel your subscription at any time from your account settings.</li>
                    <li className="refund-policy-list-item">Upon cancellation, you will retain access until the end of your current billing cycle.</li>
                    <li className="refund-policy-list-item">No pro-rated refunds will be issued for unused days.</li>
                </ul>
            </div>

            <hr className="refund-policy-divider" />

            <div className="refund-policy-section">
                <h2 className="refund-policy-section-title">5. Changes to the Refund Policy</h2>
                <p>SarthiQ reserves the right to amend this policy at any time. Updates will be posted on this page with a revised effective date.</p>
            </div>

            <div className="refund-policy-contact">
                <p>If you have questions about this policy, feel free to reach out to us at:</p>
                <a href="mailto:sarthiq@gmail.com" className="refund-policy-contact-link">
                    <span className="refund-policy-contact-icon">
                        <FaEnvelope />
                    </span>
                    sarthiq@gmail.com
                </a>
            </div>
        </div>
    );
};
