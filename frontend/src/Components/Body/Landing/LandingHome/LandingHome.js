import React, { useState, useEffect } from "react";
import "./LandingHome.css";
import { useDispatch } from "react-redux";
import { userLogin, setUserAuthToken } from "../../../../Store/User/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { loginHandler, signUpHandler } from "../Auth/authApiHandler";
import { Link } from "react-router-dom";

export const LandingHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isJoinForm, setIsJoinForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Handle hash-based navigation
  useEffect(() => {
    if (location.hash === "#login") {
      const landingTitle = document.getElementById("landing-title");
      if (landingTitle) {
        landingTitle.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash]);

  // Add intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all sections
    const sections = document.querySelectorAll('.sarthiq-community-section, .sarthiq-learning-section, .sarthiq-opportunities-section, .sarthiq-career-section');
    sections.forEach(section => {
      section.classList.add('fade-in');
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }

    // Clear API errors when user starts typing
    setApiError(null);
  };

  const validateForm = () => {
    const errors = {};

    if (isJoinForm) {
      if (!formData.fullName) errors.fullName = "Full name is required";
      if (!formData.email) errors.email = "Email is required";
      if (!formData.phoneNumber)
        errors.phoneNumber = "Phone number is required";
      if (formData.phoneNumber && formData.phoneNumber.length !== 10) {
        errors.phoneNumber = "Phone number must be 10 digits long";
      }
      
      
      if (!formData.password || formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    } else {
      if (!formData.emailOrPhone)
        errors.emailOrPhone = "Email or Phone is required";
      if (!formData.password) errors.password = "Password is required";
    }

    return errors;
  };

  // Function to show success message
  const showSuccess = (message) => {
    setApiSuccess(message);
    setApiError(null);
  };

  const clearMessages = () => {
    setApiError(null);
    setApiSuccess(null);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    clearMessages();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const loginData = {
      emailOrPhone: formData.emailOrPhone,
      password: formData.password,
    };

    // Pass handleApiError as the showAlert parameter
    const response = await loginHandler(loginData, setIsLoading, (error) => {
      setApiError(error);
    });

    if (response && response.token) {
      dispatch(userLogin());
      dispatch(setUserAuthToken(response.token));
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    }
  };

  const handleJoinNow = async (e) => {
    e.preventDefault();
    clearMessages();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const signUpData = {
      name: formData.fullName,
      email: formData.email,
      phone: formData.phoneNumber,
      password: formData.password,
    };

    // Pass handleApiError as the showAlert parameter
    const response = await signUpHandler(signUpData, setIsLoading, (error) => {
      setApiError(error);
    });

    if (response && response.message === "User created successfully") {
      showSuccess("Account created successfully! Please sign in.");
      setIsJoinForm(false);
      setFormData({
        ...formData,
        emailOrPhone: formData.email,
        password: "",
        confirmPassword: "",
      });
    }
  };

  const toggleForm = () => {
    setIsJoinForm(!isJoinForm);
    setFormErrors({});
    clearMessages();
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      emailOrPhone: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <main className="sarthiq-landing-main">
      {/* Hero Section */}
      <section className="sarthiq-hero-section">
        <div className="sarthiq-hero-content">
          <div className="sarthiq-hero-left">
            <div className="sarthiq-welcome-text">
              <h1 className="sarthiq-welcome-title">
                <span className="word">Welcome</span>
                <span className="word">to</span>
                <span className="word">the</span>
                <span className="word">#Student</span>
                <span className="word">Community!</span>
              </h1>
              <p className="sarthiq-welcome-subtitle">
                <span className="word">A</span>
                <span className="word">platform</span>
                <span className="word">for</span>
                <span className="word">students</span>
                <span className="word">to</span>
                <span className="word">Learn,</span>
                <span className="word">Engage,</span>
                <span className="word">Contribute,</span>
                <span className="word">and</span>
                <span className="word">Grow.</span>
              </p>
            </div>
          </div>
          <div className="sarthiq-hero-right">
            <div className="sarthiq-auth-container">
              <div className="sarthiq-auth-form">
                {isJoinForm ? (
                  <form onSubmit={handleJoinNow} className="sarthiq-join-form">
                    <div className="sarthiq-auth-header">
                      <h2>Create Your Account</h2>
                      <p>Join our community of students and start your journey</p>
                    </div>
                    {apiError && (
                      <div className="sarthiq-api-error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        <p>{apiError}</p>
                      </div>
                    )}
                    {apiSuccess && (
                      <div className="sarthiq-api-success-message">
                        <i className="fas fa-check-circle"></i>
                        <p>{apiSuccess}</p>
                      </div>
                    )}
                    <div className="sarthiq-form-group">
                      <div className="sarthiq-input-with-icon">
                        <i className="fas fa-user"></i>
                        <input
                          type="text"
                          name="fullName"
                          placeholder="Full Name"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          className="sarthiq-input"
                        />
                      </div>
                      {formErrors.fullName && (
                        <span className="sarthiq-error-message">
                          <i className="fas fa-exclamation-circle"></i>
                          {formErrors.fullName}
                        </span>
                      )}
                    </div>
                    <div className="sarthiq-form-row">
                      <div className="sarthiq-form-group">
                        <div className="sarthiq-input-with-icon">
                          <i className="fas fa-envelope"></i>
                          <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="sarthiq-input"
                          />
                        </div>
                        {formErrors.email && (
                          <span className="sarthiq-error-message">
                            <i className="fas fa-exclamation-circle"></i>
                            {formErrors.email}
                          </span>
                        )}
                      </div>
                      <div className="sarthiq-form-group">
                        <div className="sarthiq-input-with-icon">
                          <i className="fas fa-phone"></i>
                          <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            required
                            className="sarthiq-input"
                          />
                        </div>
                        {formErrors.phoneNumber && (
                          <span className="sarthiq-error-message">
                            <i className="fas fa-exclamation-circle"></i>
                            {formErrors.phoneNumber}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="sarthiq-form-row">
                      <div className="sarthiq-form-group">
                        <div className="sarthiq-input-with-icon">
                          <i className="fas fa-lock"></i>
                          <input
                            type="password"
                            name="password"
                            placeholder="Create Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            minLength="8"
                            required
                            className="sarthiq-input"
                          />
                        </div>
                        {formErrors.password && (
                          <span className="sarthiq-error-message">
                            <i className="fas fa-exclamation-circle"></i>
                            {formErrors.password}
                          </span>
                        )}
                      </div>
                      <div className="sarthiq-form-group">
                        <div className="sarthiq-input-with-icon">
                          <i className="fas fa-lock"></i>
                          <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            className="sarthiq-input"
                          />
                        </div>
                        {formErrors.confirmPassword && (
                          <span className="sarthiq-error-message">
                            <i className="fas fa-exclamation-circle"></i>
                            {formErrors.confirmPassword}
                          </span>
                        )}
                      </div>
                    </div>
                    <button type="submit" className="sarthiq-sign-in-button" disabled={isLoading}>
                      <i className="fas fa-user-plus"></i>
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </button>
                    <div className="sarthiq-form-footer">
                      <p>Already have an account? <a href="#" onClick={toggleForm}>Sign in</a></p>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSignIn} className="sarthiq-signin-form">
                    <div className="sarthiq-auth-header">
                      <h2>Welcome Back!</h2>
                      <p>Sign in to continue your learning journey</p>
                    </div>
                    {apiError && (
                      <div className="sarthiq-api-error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        <p>{apiError}</p>
                      </div>
                    )}
                    {apiSuccess && (
                      <div className="sarthiq-api-success-message">
                        <i className="fas fa-check-circle"></i>
                        <p>{apiSuccess}</p>
                      </div>
                    )}
                    <div className="sarthiq-form-group">
                      <div className="sarthiq-input-with-icon">
                        <i className="fas fa-envelope"></i>
                        <input
                          type="text"
                          name="emailOrPhone"
                          placeholder="Email or Phone Number"
                          value={formData.emailOrPhone}
                          onChange={handleInputChange}
                          required
                          className="sarthiq-input"
                        />
                      </div>
                      {formErrors.emailOrPhone && (
                        <span className="sarthiq-error-message">
                          <i className="fas fa-exclamation-circle"></i>
                          {formErrors.emailOrPhone}
                        </span>
                      )}
                    </div>
                    <div className="sarthiq-form-group">
                      <div className="sarthiq-input-with-icon">
                        <i className="fas fa-lock"></i>
                        <input
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className="sarthiq-input"
                        />
                      </div>
                      {formErrors.password && (
                        <span className="sarthiq-error-message">
                          <i className="fas fa-exclamation-circle"></i>
                          {formErrors.password}
                        </span>
                      )}
                    </div>
                    <button type="submit" className="sarthiq-sign-in-button" disabled={isLoading}>
                      <i className="fas fa-sign-in-alt"></i>
                      {isLoading ? "Signing in..." : "Sign in"}
                    </button>
                    <div className="sarthiq-form-footer">
                      <p>New to Sarthiq? <a href="#" onClick={toggleForm}>Join now</a></p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="sarthiq-community-section">
        <div className="sarthiq-section-header">
          <h2>Diverse and Vibrant Community</h2>
          <p>Get access to connect, collaborate and learn with any student across stream and domain.</p>
        </div>
        <div className="sarthiq-community-features">
          <div className="sarthiq-feature-card">
            <div className="sarthiq-feature-icon">🎓</div>
            <h3>Students Across Campuses</h3>
            <p>Connect with students from universities nationwide</p>
          </div>
          <div className="sarthiq-feature-card">
            <div className="sarthiq-feature-icon">📚</div>
            <h3>Students from all Streams</h3>
            <p>Interact with peers from diverse academic backgrounds</p>
          </div>
          <div className="sarthiq-feature-card">
            <div className="sarthiq-feature-icon">🌍</div>
            <h3>No Geographical Boundary</h3>
            <p>Connect with students globally without limitations</p>
          </div>
        </div>
      </section>

      {/* Learning Section */}
      <section className="sarthiq-learning-section">
        <div className="sarthiq-section-header">
          <h2>Learn and Build Together</h2>
          <p>Be part of an open, innovative and competitive environment.</p>
        </div>
        <div className="sarthiq-learning-features">
          <div className="sarthiq-feature-card">
            <div className="sarthiq-feature-icon">💡</div>
            <h3>Tech-Business-Arts Together</h3>
            <p>Learn, share and compete with others</p>
          </div>
          <div className="sarthiq-feature-card">
            <div className="sarthiq-feature-icon">🎨</div>
            <h3>Vibrant Students Culture</h3>
            <p>Be part of a unified student's community, explore unique students' culture across the country</p>
          </div>
          <div className="sarthiq-feature-card">
            <div className="sarthiq-feature-icon">🚀</div>
            <h3>Explore Opportunities Built Together</h3>
            <p>Collaborate on projects and discover new opportunities through collective learning</p>
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="sarthiq-opportunities-section">
        <div className="sarthiq-section-header">
          <h2>Get Noticed Across Campuses</h2>
          <p>Get your first chance to showcase your talent and get the right job opportunity.</p>
        </div>
        <div className="sarthiq-opportunities-features">
          <div className="sarthiq-feature-card">
            <div className="sarthiq-feature-icon">👥</div>
            <h3>Connect with Students</h3>
            <p>Build your professional network</p>
          </div>
          <div className="sarthiq-feature-card">
            <div className="sarthiq-feature-icon">🎯</div>
            <h3>Get Social-platform for your talent</h3>
            <p>Showcase your skills and achievements</p>
          </div>
          <div className="sarthiq-feature-card">
            <div className="sarthiq-feature-icon">💼</div>
            <h3>Get Opportunities</h3>
            <p>Access internships and job opportunities</p>
          </div>
        </div>
      </section>

      {/* Career Section */}
      <section className="sarthiq-career-section">
        <div className="sarthiq-section-header">
          <h2>Start Your Career Journey</h2>
          <p>Take the first step towards your professional success</p>
        </div>
        <div className="sarthiq-career-features">
          <div className="sarthiq-feature-card">
            <div className="sarthiq-feature-icon">🚀</div>
            <h3>Work on Live Projects</h3>
            <p>Gain hands-on experience with real-world projects</p>
          </div>
          <div className="sarthiq-feature-card">
            <div className="sarthiq-feature-icon">🎓</div>
            <h3>Get Internship Opportunities</h3>
            <p>Find the perfect internship to kickstart your career</p>
          </div>
          <div className="sarthiq-feature-card">
            <div className="sarthiq-feature-icon">💼</div>
            <h3>Find the Right Jobs</h3>
            <p>Discover job opportunities that match your skills</p>
          </div>
        </div>
      </section>
    </main>
  );
};
