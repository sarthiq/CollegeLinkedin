import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaSchool, FaBook, FaGraduationCap, FaUserGraduate, FaBrain, FaUserFriends, FaLightbulb } from "react-icons/fa";
import "./UsersDetails.css";

// Dummy data for demonstration
const dummyUserDetails = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+91 98765 43210",
  profilePicture: "https://placehold.co/150",
  school: "St. Mary's High School",
  section: "A",
  course: "Science",
  class: "12th",
  iqResult: {
    score: 120,
    label: "Above Average",
    date: "2024-03-15"
  },
  personalityResult: {
    openness: 85,
    neuroticism: 45,
    extraversion: 75,
    agreeableness: 80,
    conscientiousness: 70,
    date: "2024-03-14"
  },
  interestResult: {
    primary: "Technology",
    secondary: "Science",
    tertiary: "Mathematics",
    date: "2024-03-13"
  }
};

export const UsersDetails = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(dummyUserDetails);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would typically make an API call to update the user data
  };

  return (
    <div className="users-container">
      <div className="users-details-container">
        <div className="user-profile-header">
          <img
            src={userData.profilePicture}
            alt={userData.name}
            className="profile-picture"
          />
          <div className="user-info">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="edit-form">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                  />
                </div>
                <button type="submit" className="edit-profile-btn">
                  Save Changes
                </button>
              </form>
            ) : (
              <>
                <h2>{userData.name}</h2>
                <p><FaEnvelope /> {userData.email}</p>
                <p><FaPhone /> {userData.phone}</p>
                <button
                  className="edit-profile-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        <div className="user-details-section">
          <h3 className="section-title">
            <FaGraduationCap />
            Academic Information
          </h3>
          <div className="details-grid">
            <div className="detail-item">
              <label>School</label>
              <p>{userData.school}</p>
            </div>
            <div className="detail-item">
              <label>Section</label>
              <p>{userData.section}</p>
            </div>
            <div className="detail-item">
              <label>Course</label>
              <p>{userData.course}</p>
            </div>
            <div className="detail-item">
              <label>Class</label>
              <p>{userData.class}</p>
            </div>
          </div>
        </div>

        <div className="results-section">
          <div className="result-card">
            <h3>
              <FaBrain />
              IQ Test Results
            </h3>
            <div className="result-content">
              <div className="result-item">
                <label>Score</label>
                <p>{userData.iqResult.score}</p>
              </div>
              <div className="result-item">
                <label>Label</label>
                <p>{userData.iqResult.label}</p>
              </div>
              <div className="result-item">
                <label>Date</label>
                <p>{userData.iqResult.date}</p>
              </div>
            </div>
          </div>

          <div className="result-card">
            <h3>
              <FaUserFriends />
              Personality Test Results
            </h3>
            <div className="result-content">
              <div className="result-item">
                <label>Openness</label>
                <p>{userData.personalityResult.openness}%</p>
              </div>
              <div className="result-item">
                <label>Neuroticism</label>
                <p>{userData.personalityResult.neuroticism}%</p>
              </div>
              <div className="result-item">
                <label>Extraversion</label>
                <p>{userData.personalityResult.extraversion}%</p>
              </div>
              <div className="result-item">
                <label>Agreeableness</label>
                <p>{userData.personalityResult.agreeableness}%</p>
              </div>
              <div className="result-item">
                <label>Conscientiousness</label>
                <p>{userData.personalityResult.conscientiousness}%</p>
              </div>
              <div className="result-item">
                <label>Date</label>
                <p>{userData.personalityResult.date}</p>
              </div>
            </div>
          </div>

          <div className="result-card">
            <h3>
              <FaLightbulb />
              Interest Test Results
            </h3>
            <div className="result-content">
              <div className="result-item">
                <label>Primary Interest</label>
                <p>{userData.interestResult.primary}</p>
              </div>
              <div className="result-item">
                <label>Secondary Interest</label>
                <p>{userData.interestResult.secondary}</p>
              </div>
              <div className="result-item">
                <label>Tertiary Interest</label>
                <p>{userData.interestResult.tertiary}</p>
              </div>
              <div className="result-item">
                <label>Date</label>
                <p>{userData.interestResult.date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

