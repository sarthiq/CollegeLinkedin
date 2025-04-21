import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SignIn.module.css';

export const SignIn = () => {
    const [formData, setFormData] = useState({
        emailOrPhone: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [isEmail, setIsEmail] = useState(true);

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

    const toggleInputType = () => {
        setIsEmail(!isEmail);
        setFormData(prevState => ({
            ...prevState,
            emailOrPhone: ''
        }));
        setErrors(prevState => ({
            ...prevState,
            emailOrPhone: ''
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.emailOrPhone.trim()) {
            newErrors.emailOrPhone = isEmail ? 'Email is required' : 'Phone number is required';
        } else if (isEmail && !/\S+@\S+\.\S+/.test(formData.emailOrPhone)) {
            newErrors.emailOrPhone = 'Please enter a valid email';
        } else if (!isEmail && !/^\d{10}$/.test(formData.emailOrPhone)) {
            newErrors.emailOrPhone = 'Please enter a valid 10-digit phone number';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
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
                    <h1 className={styles.leftTitle}>Welcome Back to Sarthiq</h1>
                    <p className={styles.leftSubtitle}>Sign in to connect with your college community and explore opportunities.</p>
                    
                    <ul className={styles.featureList}>
                        <li className={styles.featureItem}>
                            <span className={styles.featureIcon}>📱</span>
                            Access your personalized feed
                        </li>
                        <li className={styles.featureItem}>
                            <span className={styles.featureIcon}>💼</span>
                            View job recommendations
                        </li>
                        <li className={styles.featureItem}>
                            <span className={styles.featureIcon}>👥</span>
                            Connect with your network
                        </li>
                        <li className={styles.featureItem}>
                            <span className={styles.featureIcon}>📚</span>
                            Access learning resources
                        </li>
                        <li className={styles.featureItem}>
                            <span className={styles.featureIcon}>🔔</span>
                            Stay updated with notifications
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className={styles.rightSection}>
                <div className={styles.signInContainer}>
                    <h1 className={styles.signInTitle}>Sign In</h1>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="emailOrPhone">
                                {isEmail ? 'Email' : 'Phone Number'}
                            </label>
                            <input
                                className={styles.input}
                                type={isEmail ? 'email' : 'tel'}
                                id="emailOrPhone"
                                name="emailOrPhone"
                                value={formData.emailOrPhone}
                                onChange={handleChange}
                                placeholder={isEmail ? 'Enter your email' : 'Enter your phone number'}
                            />
                            {errors.emailOrPhone && <div className={styles.errorMessage}>{errors.emailOrPhone}</div>}
                            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                                <button 
                                    type="button" 
                                    onClick={toggleInputType}
                                    style={{ 
                                        background: 'none', 
                                        border: 'none', 
                                        color: '#0a66c2', 
                                        fontSize: '14px', 
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    {isEmail ? 'Use phone number instead' : 'Use email instead'}
                                </button>
                            </div>
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
                                placeholder="Enter your password"
                            />
                            {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}
                        </div>

                        <div className={styles.forgotPassword}>
                            <Link to="/auth/forgot-password">Forgot password?</Link>
                        </div>

                        <button type="submit" className={styles.submitButton}>
                            Sign In
                        </button>
                    </form>

                    <div className={styles.divider}></div>

                    {/* <div className={styles.socialSignIn}>
                        <div className={styles.socialSignInTitle}>Or sign in with</div>
                        <div className={styles.socialButtons}>
                            <button className={styles.socialButton}>
                                <span className={styles.socialIcon}>G</span>
                            </button>
                            <button className={styles.socialButton}>
                                <span className={styles.socialIcon}>f</span>
                            </button>
                            <button className={styles.socialButton}>
                                <span className={styles.socialIcon}>A</span>
                            </button>
                        </div>
                    </div> */}

                    <div className={styles.signUpLink}>
                        New to Sarthiq? <Link to="/auth/joinNow">Join now</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
