import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfileHandler, updateProfileHandler } from "../profileApiHandler";
import { updateInterestsHandler, getInterestsHandler } from "../interestsApiHandler";
import {  getAchievementsHandler, addAchievementsHandler, deleteAchievementsHandler } from "../achievmentsApiHandler";
import {  getEducationHandler, addEducationHandler, deleteEducationHandler } from "../educationApiHandler";
import {  getExperienceHandler, addExperienceHandler, deleteExperienceHandler } from "../experienceApiHandler";
import {  getSkillsHandler, addSkillsHandler, deleteSkillsHandler } from "../skillsApiHandler";
import "./EditProfile.css";

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const EditProfile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Basic Profile State
  const [basicProfile, setBasicProfile] = useState({
    name: "",
    title: "",
    description: "",
    collegeName: "",
    collegeYear: "",
    courseName: "",
    image: "",
    coverImage: "",
  });

  const coverImageInputRef = useRef(null);
  const profileImageInputRef = useRef(null);

  // Interests State
  const [interests, setInterests] = useState({
    preferredJobTypes: [],
    preferredLocations: [],
    preferredIndustries: [],
    preferredRoles: [],
    workMode: "",
    expectedSalary: "",
    currentSalary: "",
  });

  // Achievements State
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({
    title: "",
    description: "",
    date: "",
    issuer: "",
    image: null,
  });

  // Education State
  const [education, setEducation] = useState([]);
  const [newEducation, setNewEducation] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    grade: "",
    description: "",
  });

  // Experience State
  const [experience, setExperience] = useState([]);
  const [newExperience, setNewExperience] = useState({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
    location: "",
    employmentType: "",
  });

  // Skills State
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: "",
    yearsOfExperience: "",
    category: "",
  });

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      // Fetch basic profile
      const profileData = await getProfileHandler({}, setIsLoading, setError);
      if (profileData && profileData.success) {
        setBasicProfile({
          name: profileData.data.User?.name || "",
          title: profileData.data.title || "",
          description: profileData.data.bio || "",
          collegeName: profileData.data.collegeName || "",
          collegeYear: profileData.data.collegeYear || "",
          courseName: profileData.data.courseName || "",
          image: profileData.data.profileUrl
            ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${profileData.data.profileUrl}`
            : "/assets/Utils/male.png",
          coverImage: profileData.data.coverUrl
            ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${profileData.data.coverUrl}`
            : "https://placehold.co/1200x300",
        });
      }

      // Fetch interests
      const interestsData = await getInterestsHandler({}, setIsLoading, setError);
      if (interestsData) setInterests(interestsData);

      // Fetch achievements
      const achievementsData = await getAchievementsHandler({}, setIsLoading, setError);
      if (achievementsData) setAchievements(achievementsData);

      // Fetch education
      const educationData = await getEducationHandler({}, setIsLoading, setError);
      if (educationData) setEducation(educationData);

      // Fetch experience
      const experienceData = await getExperienceHandler({}, setIsLoading, setError);
      if (experienceData) setExperience(experienceData);

      // Fetch skills
      const skillsData = await getSkillsHandler({}, setIsLoading, setError);
      if (skillsData) setSkills(skillsData);
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBasicProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      const formData = new FormData();
      Object.entries(basicProfile).forEach(([key, value]) => {
        if (key !== 'image' && key !== 'coverImage') {
          formData.append(key, value);
        }
      });

      if (profileImageInputRef.current.files.length > 0) {
        formData.append("image", profileImageInputRef.current.files[0]);
      }

      if (coverImageInputRef.current.files.length > 0) {
        formData.append("coverImage", coverImageInputRef.current.files[0]);
      }

      const response = await updateProfileHandler(formData, setIsUpdating, setError);
      if (response && response.success) {
        await fetchAllData();
        navigate("/profile");
      }
    } catch (error) {
      setError("Error updating profile");
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBasicProfile(prev => ({
          ...prev,
          coverImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBasicProfile(prev => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInterestsUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await updateInterestsHandler(interests, setIsLoading, setError);
    } catch (error) {
      setError("Error updating interests");
    }
  };

  const handleAchievementAdd = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData();
      Object.entries(newAchievement).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      await addAchievementsHandler(formData, setIsLoading, setError);
      setNewAchievement({
        title: "",
        description: "",
        date: "",
        issuer: "",
        image: null,
      });
      fetchAllData();
    } catch (error) {
      setError("Error adding achievement");
    }
  };

  const handleEducationAdd = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await addEducationHandler(newEducation, setIsLoading, setError);
      setNewEducation({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        grade: "",
        description: "",
      });
      fetchAllData();
    } catch (error) {
      setError("Error adding education");
    }
  };

  const handleExperienceAdd = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await addExperienceHandler(newExperience, setIsLoading, setError);
      setNewExperience({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
        location: "",
        employmentType: "",
      });
      fetchAllData();
    } catch (error) {
      setError("Error adding experience");
    }
  };

  const handleSkillAdd = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await addSkillsHandler(newSkill, setIsLoading, setError);
      setNewSkill({
        name: "",
        level: "",
        yearsOfExperience: "",
        category: "",
      });
      fetchAllData();
    } catch (error) {
      setError("Error adding skill");
    }
  };

  if (isLoading) {
    return (
      <div className="edit-profile-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-wrapper">
        <div className="edit-profile-sidebar">
          <div className="edit-profile-sidebar-profile">
            <div className="edit-profile-sidebar-profile-image">
              <img src={basicProfile.image} alt="Profile" />
            </div>
            <h3 className="edit-profile-sidebar-profile-name">{basicProfile.name}</h3>
            <p className="edit-profile-sidebar-profile-title">{basicProfile.title}</p>
          </div>
          <button
            className={`edit-profile-sidebar-btn ${activeSection === "basic" ? "active" : ""}`}
            onClick={() => setActiveSection("basic")}
          >
            <i className="fas fa-user"></i>
            Basic Profile
          </button>
          <button
            className={`edit-profile-sidebar-btn ${activeSection === "interests" ? "active" : ""}`}
            onClick={() => setActiveSection("interests")}
          >
            <i className="fas fa-heart"></i>
            Interests
          </button>
          <button
            className={`edit-profile-sidebar-btn ${activeSection === "achievements" ? "active" : ""}`}
            onClick={() => setActiveSection("achievements")}
          >
            <i className="fas fa-trophy"></i>
            Achievements
          </button>
          <button
            className={`edit-profile-sidebar-btn ${activeSection === "education" ? "active" : ""}`}
            onClick={() => setActiveSection("education")}
          >
            <i className="fas fa-graduation-cap"></i>
            Education
          </button>
          <button
            className={`edit-profile-sidebar-btn ${activeSection === "experience" ? "active" : ""}`}
            onClick={() => setActiveSection("experience")}
          >
            <i className="fas fa-briefcase"></i>
            Experience
          </button>
          <button
            className={`edit-profile-sidebar-btn ${activeSection === "skills" ? "active" : ""}`}
            onClick={() => setActiveSection("skills")}
          >
            <i className="fas fa-code"></i>
            Skills
          </button>
        </div>

        <div className="edit-profile-content">
          {error && <div className="edit-profile-error">{error}</div>}
          
          {activeSection === "basic" && (
            <div className="edit-profile-section">
              <h2 className="edit-profile-section-title">Basic Profile</h2>
              <form onSubmit={handleBasicProfileUpdate} className="edit-profile-form">
                <div className="edit-profile-images">
                  <div className="edit-profile-cover-image">
                    <img src={basicProfile.coverImage} alt="Cover" />
                    <button
                      type="button"
                      className="edit-profile-edit-cover-button"
                      onClick={() => coverImageInputRef.current.click()}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                      </svg>
                    </button>
                    <input
                      type="file"
                      ref={coverImageInputRef}
                      onChange={handleCoverImageChange}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                  </div>
                  <div className="edit-profile-image-container">
                    <img src={basicProfile.image} alt="Profile" />
                    <button
                      type="button"
                      className="edit-profile-edit-image-button"
                      onClick={() => profileImageInputRef.current.click()}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                      </svg>
                    </button>
                    <input
                      type="file"
                      ref={profileImageInputRef}
                      onChange={handleProfileImageChange}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
                <div className="edit-profile-form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={basicProfile.name}
                    onChange={(e) => setBasicProfile({ ...basicProfile, name: e.target.value })}
                    required
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={basicProfile.title}
                    onChange={(e) => setBasicProfile({ ...basicProfile, title: e.target.value })}
                    required
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Description</label>
                  <textarea
                    value={basicProfile.description}
                    onChange={(e) => setBasicProfile({ ...basicProfile, description: e.target.value })}
                    required
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>College Name</label>
                  <input
                    type="text"
                    value={basicProfile.collegeName}
                    onChange={(e) => setBasicProfile({ ...basicProfile, collegeName: e.target.value })}
                    required
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>College Year</label>
                  <input
                    type="text"
                    value={basicProfile.collegeYear}
                    onChange={(e) => setBasicProfile({ ...basicProfile, collegeYear: e.target.value })}
                    required
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Course Name</label>
                  <input
                    type="text"
                    value={basicProfile.courseName}
                    onChange={(e) => setBasicProfile({ ...basicProfile, courseName: e.target.value })}
                  />
                </div>
                <div className="edit-profile-form-actions">
                  <button
                    type="button"
                    className="edit-profile-cancel-button"
                    onClick={() => navigate("/profile")}
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="edit-profile-save-button"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <span className="spinner-small"></span>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeSection === "interests" && (
            <div className="edit-profile-section">
              <h2 className="edit-profile-section-title">Interests</h2>
              <form onSubmit={handleInterestsUpdate} className="edit-profile-form">
                <div className="edit-profile-form-group">
                  <label>Preferred Job Types</label>
                  <input
                    type="text"
                    value={interests.preferredJobTypes}
                    onChange={(e) => setInterests({ ...interests, preferredJobTypes: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Preferred Locations</label>
                  <input
                    type="text"
                    value={interests.preferredLocations}
                    onChange={(e) => setInterests({ ...interests, preferredLocations: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Preferred Industries</label>
                  <input
                    type="text"
                    value={interests.preferredIndustries}
                    onChange={(e) => setInterests({ ...interests, preferredIndustries: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Preferred Roles</label>
                  <input
                    type="text"
                    value={interests.preferredRoles}
                    onChange={(e) => setInterests({ ...interests, preferredRoles: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Work Mode</label>
                  <input
                    type="text"
                    value={interests.workMode}
                    onChange={(e) => setInterests({ ...interests, workMode: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Expected Salary</label>
                  <input
                    type="text"
                    value={interests.expectedSalary}
                    onChange={(e) => setInterests({ ...interests, expectedSalary: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Current Salary</label>
                  <input
                    type="text"
                    value={interests.currentSalary}
                    onChange={(e) => setInterests({ ...interests, currentSalary: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <button type="submit" className="edit-profile-save-button" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {activeSection === "achievements" && (
            <div className="edit-profile-section">
              <h2 className="edit-profile-section-title">Achievements</h2>
              <form onSubmit={handleAchievementAdd} className="edit-profile-form">
                <div className="edit-profile-form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={newAchievement.title}
                    onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Description</label>
                  <textarea
                    value={newAchievement.description}
                    onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newAchievement.date}
                    onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Issuer</label>
                  <input
                    type="text"
                    value={newAchievement.issuer}
                    onChange={(e) => setNewAchievement({ ...newAchievement, issuer: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Image</label>
                  <input
                    type="file"
                    onChange={(e) => setNewAchievement({ ...newAchievement, image: e.target.files[0] })}
                    className="edit-profile-input"
                  />
                </div>
                <button type="submit" className="edit-profile-add-button" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Achievement"}
                </button>
              </form>

              <div className="edit-profile-achievements">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="edit-profile-achievement-card">
                    <div className="edit-profile-achievement-actions">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            setIsLoading(true);
                            await deleteAchievementsHandler({ id: achievement.id }, setIsLoading, setError);
                            fetchAllData();
                          } catch (error) {
                            setError("Error deleting achievement");
                          }
                        }}
                        className="edit-profile-delete-button"
                        disabled={isLoading}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    <h3>{achievement.title}</h3>
                    <p>{achievement.description}</p>
                    <p className="date">
                      <i className="fas fa-calendar"></i>
                      {formatDate(achievement.date)}
                    </p>
                    <p>Issuer: {achievement.issuer}</p>
                    {achievement.imageUrl && (
                      <div className="edit-profile-achievement-image">
                        <img src={`${process.env.REACT_APP_REMOTE_ADDRESS}/${achievement.imageUrl}`} alt={achievement.title} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "education" && (
            <div className="edit-profile-section">
              <h2 className="edit-profile-section-title">Education</h2>
              <form onSubmit={handleEducationAdd} className="edit-profile-form">
                <div className="edit-profile-form-group">
                  <label>Institution</label>
                  <input
                    type="text"
                    value={newEducation.institution}
                    onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Degree</label>
                  <input
                    type="text"
                    value={newEducation.degree}
                    onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Field of Study</label>
                  <input
                    type="text"
                    value={newEducation.fieldOfStudy}
                    onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={newEducation.startDate}
                    onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={newEducation.endDate}
                    onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Grade</label>
                  <input
                    type="text"
                    value={newEducation.grade}
                    onChange={(e) => setNewEducation({ ...newEducation, grade: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Description</label>
                  <textarea
                    value={newEducation.description}
                    onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <button type="submit" className="edit-profile-add-button" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Education"}
                </button>
              </form>

              <div className="edit-profile-education">
                {education.map((edu) => (
                  <div key={edu.id} className="edit-profile-education-card">
                    <div className="edit-profile-education-actions">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            setIsLoading(true);
                            await deleteEducationHandler({ id: edu.id }, setIsLoading, setError);
                            fetchAllData();
                          } catch (error) {
                            setError("Error deleting education");
                          }
                        }}
                        className="edit-profile-delete-button"
                        disabled={isLoading}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    <div className="edit-profile-education-content">
                      <h3 className="edit-profile-education-institution">{edu.institution}</h3>
                      <div className="edit-profile-education-details">
                        <p className="edit-profile-education-degree">
                          <i className="fas fa-graduation-cap"></i>
                          {edu.degree}
                        </p>
                        <p className="edit-profile-education-field">
                          <i className="fas fa-book"></i>
                          {edu.fieldOfStudy}
                        </p>
                        <p className="edit-profile-education-duration">
                          <i className="fas fa-calendar"></i>
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </p>
                        <p className="edit-profile-education-grade">
                          <i className="fas fa-star"></i>
                          Grade: {edu.grade}
                        </p>
                      </div>
                      {edu.description && (
                        <p className="edit-profile-education-description">
                          <i className="fas fa-info-circle"></i>
                          {edu.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "experience" && (
            <div className="edit-profile-section">
              <h2 className="edit-profile-section-title">Experience</h2>
              <form onSubmit={handleExperienceAdd} className="edit-profile-form">
                <div className="edit-profile-form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    value={newExperience.company}
                    onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    value={newExperience.position}
                    onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={newExperience.startDate}
                    onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={newExperience.endDate}
                    onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={newExperience.location}
                    onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Employment Type</label>
                  <input
                    type="text"
                    value={newExperience.employmentType}
                    onChange={(e) => setNewExperience({ ...newExperience, employmentType: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Description</label>
                  <textarea
                    value={newExperience.description}
                    onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <button type="submit" className="edit-profile-add-button" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Experience"}
                </button>
              </form>

              <div className="edit-profile-experience">
                {experience.map((exp) => (
                  <div key={exp.id} className="edit-profile-experience-card">
                    <div className="edit-profile-experience-actions">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            setIsLoading(true);
                            await deleteExperienceHandler({ id: exp.id }, setIsLoading, setError);
                            fetchAllData();
                          } catch (error) {
                            setError("Error deleting experience");
                          }
                        }}
                        className="edit-profile-delete-button"
                        disabled={isLoading}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    <h3>{exp.company}</h3>
                    <p>Position: {exp.position}</p>
                    <p className="duration">
                      <i className="fas fa-calendar"></i>
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </p>
                    <p>Location: {exp.location}</p>
                    <p>Type: {exp.employmentType}</p>
                    <p>{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "skills" && (
            <div className="edit-profile-section">
              <h2 className="edit-profile-section-title">Skills</h2>
              <form onSubmit={handleSkillAdd} className="edit-profile-form">
                <div className="edit-profile-form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Level</label>
                  <input
                    type="text"
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Years of Experience</label>
                  <input
                    type="text"
                    value={newSkill.yearsOfExperience}
                    onChange={(e) => setNewSkill({ ...newSkill, yearsOfExperience: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <div className="edit-profile-form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    className="edit-profile-input"
                  />
                </div>
                <button type="submit" className="edit-profile-add-button" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Skill"}
                </button>
              </form>

              <div className="edit-profile-skills">
                {skills.map((skill) => (
                  <div key={skill.id} className="edit-profile-skill-card">
                    <div className="edit-profile-skill-actions">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            setIsLoading(true);
                            await deleteSkillsHandler({ id: skill.id }, setIsLoading, setError);
                            fetchAllData();
                          } catch (error) {
                            setError("Error deleting skill");
                          }
                        }}
                        className="edit-profile-delete-button"
                        disabled={isLoading}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    <h3>{skill.name}</h3>
                    <p className="level">
                      <i className="fas fa-star"></i>
                      Level: {skill.level}
                    </p>
                    <p>Experience: {skill.yearsOfExperience} years</p>
                    <p>Category: {skill.category}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

