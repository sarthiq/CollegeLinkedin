import React from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
import Header from '../Header/Header';

const Profile = ({ onLogout }) => {
  return (
    <>
      <Header onLogout={onLogout} />
      <div className="profile-container" style={{ marginTop: '72px' }}>
        <div className="profile-header">
          <div className="profile-cover">
            <div className="cover-image"></div>
            <div className="profile-picture">
              <img src="https://randomuser.me/api/portraits/men/4.jpg" alt="Profile" />
            </div>
          </div>
          <div className="profile-info">
            <h1>Your Name</h1>
            <p className="headline">Computer Science Student at University of Technology</p>
            <p className="location">San Francisco Bay Area • <Link to="/contact">Contact info</Link></p>
            <div className="profile-actions">
              <button className="primary-btn">Open to</button>
              <button className="secondary-btn">Add profile section</button>
              <button className="secondary-btn">More</button>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-left">
            <div className="card about">
              <h2>About</h2>
              <p>Passionate Computer Science student with a focus on machine learning and software development. Currently pursuing a Bachelor's degree at University of Technology.</p>
            </div>

            <div className="card experience">
              <h2>Experience</h2>
              <div className="experience-item">
                <img src="https://via.placeholder.com/48" alt="Company" className="company-logo" />
                <div className="experience-details">
                  <h3>Software Engineering Intern</h3>
                  <p className="company">Tech Company Inc.</p>
                  <p className="duration">Jun 2023 - Aug 2023 • 3 mos</p>
                  <p className="location">San Francisco, California</p>
                  <p className="description">Worked on developing and maintaining web applications using React and Node.js.</p>
                </div>
              </div>
            </div>

            <div className="card education">
              <h2>Education</h2>
              <div className="education-item">
                <img src="https://via.placeholder.com/48" alt="University" className="university-logo" />
                <div className="education-details">
                  <h3>University of Technology</h3>
                  <p className="degree">Bachelor of Science - BS, Computer Science</p>
                  <p className="duration">2021 - 2025</p>
                  <p className="activities">Activities and societies: Computer Science Club, Hackathon Team</p>
                </div>
              </div>
            </div>

            <div className="card skills">
              <h2>Skills</h2>
              <div className="skills-list">
                <button className="skill-tag">JavaScript</button>
                <button className="skill-tag">React</button>
                <button className="skill-tag">Node.js</button>
                <button className="skill-tag">Python</button>
                <button className="skill-tag">Machine Learning</button>
                <button className="skill-tag">Data Structures</button>
              </div>
            </div>
          </div>

          <div className="profile-right">
            <div className="card people-also-viewed">
              <h2>People also viewed</h2>
              <div className="people-list">
                <div className="person">
                  <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="Person" />
                  <div className="person-info">
                    <h3>Sarah Johnson</h3>
                    <p>Software Engineer at Google</p>
                  </div>
                </div>
                <div className="person">
                  <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="Person" />
                  <div className="person-info">
                    <h3>Michael Chen</h3>
                    <p>Data Scientist at Microsoft</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card people-you-may-know">
              <h2>People you may know</h2>
              <div className="people-list">
                <div className="person">
                  <img src="https://randomuser.me/api/portraits/women/3.jpg" alt="Person" />
                  <div className="person-info">
                    <h3>Emily Rodriguez</h3>
                    <p>Product Manager at Amazon</p>
                  </div>
                  <button className="connect-btn">Connect</button>
                </div>
                <div className="person">
                  <img src="https://randomuser.me/api/portraits/men/4.jpg" alt="Person" />
                  <div className="person-info">
                    <h3>David Wilson</h3>
                    <p>Full Stack Developer at Facebook</p>
                  </div>
                  <button className="connect-btn">Connect</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile; 