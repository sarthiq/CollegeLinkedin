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
  const [signInMethod, setSignInMethod] = useState("email"); // 'email' or 'phone'
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    emailOrPhone: "",
    collegeName: "",
    courseName: "",
    collegeYear: "",
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
      navigate("/");
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
      collegeName: "",
      courseName: "",
      collegeYear: "",
      password: "",
      confirmPassword: "",
    });
  };

  const toggleSignInMethod = () => {
    setSignInMethod(signInMethod === "email" ? "phone" : "email");
    setFormErrors({});
    clearMessages();
  };

  return (
    <main className="landing-main">
      <div className="landing-content">
        <div className="landing-left">
          <h1 id="landing-title" className="landing-title">
            Welcome to the college community!
          </h1>
          <h2 className="landing-subtitle">
            A platform for students to Learn, Engage, Contribute, and Earn.
          </h2>
          <div id="login-section" className="auth-form">
            {/* API Error and Success Messages */}
            {apiError && (
              <div className="api-error-message">
                <p>{apiError}</p>
              </div>
            )}
            {apiSuccess && (
              <div className="api-success-message">
                <p>{apiSuccess}</p>
              </div>
            )}

            {isJoinForm ? (
              <form onSubmit={handleJoinNow}>
                <div className="form-group">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.fullName && (
                    <span className="error-message">{formErrors.fullName}</span>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.email && (
                    <span className="error-message">{formErrors.email}</span>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.phoneNumber && (
                    <span className="error-message">
                      {formErrors.phoneNumber}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    placeholder="Create a password (min. 8 characters)"
                    value={formData.password}
                    onChange={handleInputChange}
                    minLength="8"
                    required
                  />
                  {formErrors.password && (
                    <span className="error-message">{formErrors.password}</span>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.confirmPassword && (
                    <span className="error-message">
                      {formErrors.confirmPassword}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="sign-in-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Join Now"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignIn}>
                <div className="sign-in-toggle">
                  <button
                    type="button"
                    className={`toggle-btn ${
                      signInMethod === "email" ? "active" : ""
                    }`}
                    onClick={() => setSignInMethod("email")}
                  >
                    Sign in with Email
                  </button>
                  <button
                    type="button"
                    className={`toggle-btn ${
                      signInMethod === "phone" ? "active" : ""
                    }`}
                    onClick={() => setSignInMethod("phone")}
                  >
                    Sign in with Phone
                  </button>
                </div>
                <div className="form-group">
                  <input
                    type={signInMethod === "email" ? "email" : "tel"}
                    name="emailOrPhone"
                    placeholder={
                      signInMethod === "email" ? "Email" : "Phone Number"
                    }
                    value={formData.emailOrPhone}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.emailOrPhone && (
                    <span className="error-message">
                      {formErrors.emailOrPhone}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.password && (
                    <span className="error-message">{formErrors.password}</span>
                  )}
                </div>
                <button
                  type="submit"
                  className="sign-in-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Sign in"}
                </button>
              </form>
            )}
          </div>
          <p className="landing-agreement">
            By clicking Continue to join or sign in, you agree to Sarthiq's{" "}
            <Link to="/landing/terms">Terms of Service</Link>,{" "}
            <Link to="/landing/privacy">Privacy Policy</Link>, and{" "}
            <Link to="/landing/refund">Refund Policy</Link>.
          </p>
          <div className="join-now">
            <p>
              {isJoinForm ? (
                <>
                  Already on Sarthiq?{" "}
                  <a href="#" onClick={toggleForm}>
                    Sign in
                  </a>
                </>
              ) : (
                <>
                  New to Sarthiq?{" "}
                  <a href="#" onClick={toggleForm}>
                    Join now
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="landing-right">
          <div className="hero-image-container">
            <img
              src="https://images.pexels.com/photos/3182759/pexels-photo-3182759.jpeg"
              alt="Students collaborating on a tech project together"
              className="hero-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg";
              }}
            />
          </div>
        </div>
      </div>

      {/* Community Section */}
      <section className="landing-section community">
        <h2 className="section-title">Community</h2>
        <p className="section-description">
          Connect with peers across colleges and domains to grow together
        </p>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>College Network</h3>
            <p>
              Build lasting connections with students from various colleges.
              Create your professional network early.
            </p>
          </div>
          <div className="feature-card">
            <h3>Interest Groups</h3>
            <p>
              Join communities based on your interests - from coding to arts.
              Collaborate on passion projects.
            </p>
          </div>
          <div className="feature-card">
            <h3>Startup Collaboration</h3>
            <p>
              Find the perfect team for your startup idea. Connect with
              technical and business minds.
            </p>
          </div>
        </div>
      </section>

      {/* Learning Lab Section */}
      <section className="landing-section learning-lab">
        <h2 className="section-title">Learning Lab</h2>
        <p className="section-description">
          Enhance your academic journey with practical skills and future-ready
          knowledge
        </p>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>AI Literacy</h3>
            <p>
              Master AI tools for design, marketing, coding, and content
              creation. Stay ahead in the digital age.
            </p>
          </div>
          <div className="feature-card">
            <h3>Communication Skills</h3>
            <p>
              Build your professional identity with expert-guided resume
              building and communication modules.
            </p>
          </div>
          <div className="feature-card">
            <h3>Industry Projects</h3>
            <p>
              Tackle real-world case studies and assignments to develop
              practical expertise in your field.
            </p>
          </div>
        </div>
      </section>

      {/* Project Arena Section */}
      <section className="landing-section project-arena">
        <h2 className="section-title">Project Arena</h2>
        <p className="section-description">
          Transform classroom knowledge into real-world solutions through
          hands-on projects
        </p>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Industry Collaborations</h3>
            <p>
              Work on live projects with startups and NGOs. Build your portfolio
              while making an impact.
            </p>
          </div>
          <div className="feature-card">
            <h3>Domain Excellence</h3>
            <p>
              Choose from projects in engineering, business, law, arts, and
              more. Specialize in your field.
            </p>
          </div>
          <div className="feature-card">
            <h3>Learning Resources</h3>
            <p>
              Access a rich library of past projects and case studies. Learn
              from successful implementations.
            </p>
          </div>
        </div>
      </section>

      {/* Internships Section */}
      <section className="landing-section internships">
        <h2 className="section-title">Internships</h2>
        <p className="section-description">
          Kickstart your career with meaningful internships at innovative
          startups
        </p>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Startup Experience</h3>
            <p>
              Join dynamic startup teams. Gain hands-on experience in fast-paced
              environments.
            </p>
          </div>
          <div className="feature-card">
            <h3>Skill Challenges</h3>
            <p>
              Participate in competitions and challenges. Showcase your talents
              to potential employers.
            </p>
          </div>
          <div className="feature-card">
            <h3>Success Stories</h3>
            <p>
              Learn from successful internship experiences. Build your path to
              professional success.
            </p>
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section className="landing-section blogs">
        <h2 className="section-title">Blogs</h2>
        <p className="section-description">
          Stay informed with the latest trends in education, industry, and
          campus life
        </p>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Industry Insights</h3>
            <p>
              Get expert perspectives on career trends and industry
              developments.
            </p>
          </div>
          <div className="feature-card">
            <h3>Student Stories</h3>
            <p>
              Read inspiring stories from fellow students and their journey to
              success.
            </p>
          </div>
          <div className="feature-card">
            <h3>Campus Updates</h3>
            <p>
              Stay updated with the latest happenings across college campuses.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};
