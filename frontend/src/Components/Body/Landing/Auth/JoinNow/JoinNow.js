import React, { useState } from 'react';
import styles from './JoinNow.module.css';
import { Link } from 'react-router-dom';
export const JoinNow = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        collegeName: '',
        collegeYear: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prevState => ({
                ...prevState,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (!formData.collegeName.trim()) {
            newErrors.collegeName = 'College name is required';
        }

        if (!formData.collegeYear.trim()) {
            newErrors.collegeYear = 'College year is required';
        } else if (!/^\d{4}$/.test(formData.collegeYear)) {
            newErrors.collegeYear = 'Please enter a valid 4-digit year';
        } else {
            const currentYear = new Date().getFullYear();
            const year = parseInt(formData.collegeYear);
            if (year < 2000 || year > currentYear + 4) {
                newErrors.collegeYear = 'Please enter a valid year between 2000 and ' + (currentYear + 4);
            }
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        
        if (Object.keys(newErrors).length === 0) {
            // Handle form submission here
            console.log('Form submitted:', formData);
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.leftSection}>
                <div className={styles.patternBackground}></div>
                <div className={styles.leftContent}>
                    <h1 className={styles.leftTitle}>Connect with Your College Community</h1>
                    <p className={styles.leftSubtitle}>Join Sarthiq to network with students, alumni, and professionals from your college.</p>
                    
                    <ul className={styles.featureList}>
                        <li className={styles.featureItem}>
                            <span className={styles.featureIcon}>🔍</span>
                            Discover internship and job opportunities
                        </li>
                        <li className={styles.featureItem}>
                            <span className={styles.featureIcon}>👥</span>
                            Connect with alumni and industry professionals
                        </li>
                        <li className={styles.featureItem}>
                            <span className={styles.featureIcon}>📚</span>
                            Share knowledge and resources with peers
                        </li>
                        <li className={styles.featureItem}>
                            <span className={styles.featureIcon}>🎓</span>
                            Build your professional network early
                        </li>
                        <li className={styles.featureItem}>
                            <span className={styles.featureIcon}>💼</span>
                            Get career guidance from experienced professionals
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className={styles.rightSection}>
                <div className={styles.joinNowContainer}>
                    <h1 className={styles.joinNowTitle}>Join Sarthiq</h1>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="name">Full Name</label>
                            <input
                                className={styles.input}
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                            />
                            {errors.name && <div className={styles.errorMessage}>{errors.name}</div>}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="email">Email</label>
                            <input
                                className={styles.input}
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                            />
                            {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="phone">Phone Number</label>
                            <input
                                className={styles.input}
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                            />
                            {errors.phone && <div className={styles.errorMessage}>{errors.phone}</div>}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="collegeName">College Name</label>
                            <input
                                className={styles.input}
                                type="text"
                                id="collegeName"
                                name="collegeName"
                                value={formData.collegeName}
                                onChange={handleChange}
                                placeholder="Enter your college name"
                            />
                            {errors.collegeName && <div className={styles.errorMessage}>{errors.collegeName}</div>}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="collegeYear">College Year (4 digits)</label>
                            <input
                                className={styles.input}
                                type="number"
                                id="collegeYear"
                                name="collegeYear"
                                value={formData.collegeYear}
                                onChange={handleChange}
                                placeholder="e.g., 2023"
                                min="2000"
                                max="2100"
                            />
                            {errors.collegeYear && <div className={styles.errorMessage}>{errors.collegeYear}</div>}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="password">Password</label>
                            <input
                                className={styles.input}
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                            />
                            {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}
                            <div className={styles.passwordRequirements}>
                                Password must be at least 8 characters long
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                className={styles.input}
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                            />
                            {errors.confirmPassword && <div className={styles.errorMessage}>{errors.confirmPassword}</div>}
                        </div>

                        <button type="submit" className={styles.submitButton}>
                            Join Now
                        </button>
                    </form>

                    <div className={styles.divider}></div>

                    <div className={styles.loginLink}>
                        Already have an account? <Link to="/auth/signIn">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
