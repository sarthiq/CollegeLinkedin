import React, { useState } from 'react';
import './Landing.css';

const Landing = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login or signup logic here
    console.log('Form submitted', { email, password, firstName, lastName, isSignUp });
    
    // For demo purposes, just log in the user
    onLogin();
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="landing-container">
      <div className="landing-header">
        <div className="landing-logo">
          <h1>CollegeLinkedIn</h1>
        </div>
        <div className="landing-nav">
          <button className="nav-btn" onClick={() => setIsSignUp(true)}>Join now</button>
          <button className="nav-btn nav-btn-secondary" onClick={() => setIsSignUp(false)}>Sign in</button>
        </div>
      </div>

      <div className="landing-content">
        <div className="landing-left">
          <h1 className="landing-title">Welcome to your college professional community</h1>
          <div className="landing-form-container">
            <form onSubmit={handleSubmit} className="landing-form">
              {isSignUp && (
                <>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email or phone"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="form-submit-btn">
                {isSignUp ? 'Join' : 'Sign in'}
              </button>
            </form>
            <div className="form-divider">
              <span>or</span>
            </div>
            <button className="google-btn" onClick={onLogin}>
              <i className="fab fa-google"></i> Continue with Google
            </button>
          </div>
          <p className="form-toggle">
            {isSignUp ? 'Already on CollegeLinkedIn?' : "Don't have an account?"}{' '}
            <button className="toggle-btn" onClick={toggleForm}>
              {isSignUp ? 'Sign in' : 'Join now'}
            </button>
          </p>
        </div>
        <div className="landing-right">
          <div className="landing-image-container">
            <img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="College students collaborating"
              className="landing-image"
            />
            <div className="landing-image-overlay">
              <h2>Connect with your college community</h2>
              <p>Find classmates, join study groups, and discover opportunities</p>
            </div>
          </div>
          <div className="landing-features">
            <div className="feature">
              <i className="fas fa-user-graduate"></i>
              <h3>Connect with classmates</h3>
              <p>Find and connect with students in your major, classes, or clubs</p>
            </div>
            <div className="feature">
              <i className="fas fa-book-reader"></i>
              <h3>Join study groups</h3>
              <p>Collaborate on projects and share study materials</p>
            </div>
            <div className="feature">
              <i className="fas fa-briefcase"></i>
              <h3>Discover opportunities</h3>
              <p>Find internships, research positions, and campus jobs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="landing-footer">
        <div className="footer-logo">
          <h2>CollegeLinkedIn</h2>
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h4>General</h4>
            <ul>
              <li>Sign Up</li>
              <li>Help Center</li>
              <li>About</li>
              <li>Press</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>Developers</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Browse</h4>
            <ul>
              <li>Learning</li>
              <li>Jobs</li>
              <li>Salary</li>
              <li>Mobile</li>
              <li>Services</li>
              <li>Products</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Business Solutions</h4>
            <ul>
              <li>Talent</li>
              <li>Marketing</li>
              <li>Sales</li>
              <li>Learning</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Directories</h4>
            <ul>
              <li>Members</li>
              <li>Jobs</li>
              <li>Companies</li>
              <li>Salaries</li>
              <li>Featured</li>
              <li>Learning</li>
              <li>Posts</li>
              <li>Articles</li>
              <li>Schools</li>
              <li>News</li>
              <li>News Letters</li>
              <li>Services</li>
              <li>Interview Prep</li>
              <li>Find a Job</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>CollegeLinkedIn © 2023</p>
          </div>
          <div className="footer-legal">
            <ul>
              <li>About</li>
              <li>Accessibility</li>
              <li>Help Center</li>
              <li>Privacy & Terms</li>
              <li>Ad Choices</li>
              <li>Advertising</li>
              <li>Business Services</li>
              <li>Get the CollegeLinkedIn app</li>
              <li>More</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing; 