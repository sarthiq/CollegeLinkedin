import React, { useState } from 'react';
import './LandingHome.css';
import { useDispatch } from 'react-redux';
import { userLogin, setUserAuthToken } from '../../../../Store/User/auth';
import { useNavigate } from 'react-router-dom';

export const LandingHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isJoinForm, setIsJoinForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    college: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    dispatch(userLogin());
    dispatch(setUserAuthToken('dummy-token'));
    localStorage.setItem('token', 'dummy-token');
    navigate('/home');
  };

  const handleJoinNow = (e) => {
    e.preventDefault();
    dispatch(userLogin());
    dispatch(setUserAuthToken('dummy-token'));
    localStorage.setItem('token', 'dummy-token');
    navigate('/home');
  };

  const toggleForm = () => {
    setIsJoinForm(!isJoinForm);
    setFormData({
      email: '',
      password: '',
      fullName: '',
      college: '',
    });
  };

  return (
    <main className="landing-main">
      <div className="landing-content">
        <div className="landing-left">
          <h1 className="landing-title">
            Welcome to the college community!
          </h1>
          <h2 className="landing-subtitle">
            A platform for students to Learn, Engage, Contribute, and Earn.
          </h2>
          <div className="auth-form">
            {isJoinForm ? (
              <form onSubmit={handleJoinNow}>
                <div className="form-group">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="college"
                    placeholder="College Name"
                    value={formData.college}
                    onChange={handleInputChange}
                    required
                  />
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
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password (6+ characters)"
                    value={formData.password}
                    onChange={handleInputChange}
                    minLength="6"
                    required
                  />
                </div>
                <button type="submit" className="sign-in-button">
                  Join Now
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignIn}>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
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
                </div>
                <button type="submit" className="sign-in-button">
                  Sign in
                </button>
              </form>
            )}
          </div>
          <p className="landing-agreement">
            By clicking Continue to join or sign in, you agree to CollegeLinkedIn's{' '}
            <a href="#">User Agreement</a>, <a href="#">Privacy Policy</a>, and{' '}
            <a href="#">Cookie Policy</a>.
          </p>
          <div className="join-now">
            <p>
              {isJoinForm ? (
                <>Already on CollegeLinkedIn? <a href="#" onClick={toggleForm}>Sign in</a></>
              ) : (
                <>New to CollegeLinkedIn? <a href="#" onClick={toggleForm}>Join now</a></>
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
                e.target.src = "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg";
              }}
            />
          </div>
        </div>
      </div>

      {/* Learning Lab Section */}
      <section className="landing-section learning-lab">
        <h2 className="section-title">Learning Lab</h2>
        <p className="section-description">
          Complement your academics learning with practical and future ready skills.
        </p>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>AI Literacy</h3>
            <p>AI for Designers, Marketing, Coding, Video & editing, etc.</p>
          </div>
          <div className="feature-card">
            <h3>Basic Communication</h3>
            <p>Basic learning modules, resume building, writing, etc.</p>
          </div>
          <div className="feature-card">
            <h3>Cases & Assignments</h3>
            <p>Field specific case studies and assignments to grow professionally.</p>
          </div>
        </div>
      </section>

      {/* Project Arena Section */}
      <section className="landing-section project-arena">
        <h2 className="section-title">Project Arena</h2>
        <p className="section-description">
          Use your academic learning into real-world problem solving and practical learning.
        </p>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Collaborations & tie-up</h3>
            <p>Collaboration with startups, NGOs, and other organizations for live projects for students.</p>
          </div>
          <div className="feature-card">
            <h3>Domain Specific Projects</h3>
            <p>Projects for all domains, engineering, business, law, arts, etc.</p>
          </div>
          <div className="feature-card">
            <h3>Past Projects</h3>
            <p>Past projects for students learning and reference.</p>
          </div>
        </div>
      </section>

      {/* Internships Section */}
      <section className="landing-section internships">
        <h2 className="section-title">Internships</h2>
        <p className="section-description">
          Use your learnings and skills to build your career by Interning with divers' startups.
        </p>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Internship</h3>
            <p>Collaboration with startups, NGOs, and other organizations for live projects for students.</p>
          </div>
          <div className="feature-card">
            <h3>Competition</h3>
            <p>Projects for all domains, engineering, business, law, arts, etc.</p>
          </div>
          <div className="feature-card">
            <h3>Past Projects</h3>
            <p>Past projects for students learning and reference.</p>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="landing-section community">
        <h2 className="section-title">Community</h2>
        <p className="section-description">
          Complement your learnings across domain, colleges and cultures to emerge a well-groomed professionals
        </p>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Inter/Intra college</h3>
            <p>Community across college for short term or long-term association</p>
          </div>
          <div className="feature-card">
            <h3>Interest, hobby, aspiration based</h3>
            <p>Be it coding, business, singing, performing art collab across colleges.</p>
          </div>
          <div className="feature-card">
            <h3>Collab on pro with students across colleges</h3>
            <p>If you have business idea collab with technical or business students to execute.</p>
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section className="landing-section blogs">
        <h2 className="section-title">Blogs</h2>
        <p className="section-description">
          Get lates updates on education, skills, industry and happing across campuses and industry to be updated.
        </p>
      </section>
    </main>
  );
}; 