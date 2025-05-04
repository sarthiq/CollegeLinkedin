import React, { useState, useEffect } from "react";
import { getProfileHandler } from "../profileApiHandler";
import { toggleFollowHandler } from "../followsApiHandler";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Feed } from "../../Common/Feed/Feed";
import "./Profile.css";

export const Profile = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("userId");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    description: "",
    followers: 0,
    following: 0,
    image: "",
    coverImage: "",
    collegeName: "",
    collegeYear: "",
    courseName: "",
    isUserProfile: false, 
    isFollowing: false,
  });
  const [interests, setInterests] = useState({
    preferredJobTypes: [],
    preferredLocations: [],
    preferredIndustries: [],
    preferredRoles: [],
    workMode: "",
    expectedSalary: "",
    currentSalary: "",
  });
  const [achievements, setAchievements] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, [userId]);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      // Fetch basic profile
      const profileData = await getProfileHandler(
        { userId },
        setIsLoading,
        setError
      );
      if (profileData && profileData.success) {
        setProfile({
          name: profileData.data.User?.name || "",
          email:profileData.data.User?.email||"",
          title: profileData.data.title || "",
          description: profileData.data.bio || "",
          collegeName: profileData.data.collegeName || "",
          collegeYear: profileData.data.collegeYear || "",
          courseName: profileData.data.courseName || "",
          followers: profileData.data.followers || 0,
          following: profileData.data.following || 0,
          image: profileData.data.profileUrl
            ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${profileData.data.profileUrl}`
            : "/assets/Utils/male.png",
          coverImage: profileData.data.coverUrl
            ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${profileData.data.coverUrl}`
            : "https://placehold.co/1200x300",
          isUserProfile: profileData.data.isUserProfile || false,
          isFollowing: profileData.data.isFollowing || false,
        });

        setInterests(profileData.data.otherInfo.interests[0]);
        setAchievements(profileData.data.otherInfo.achievments);
        setEducation(profileData.data.otherInfo.education);
        setExperience(profileData.data.otherInfo.experience);
        setSkills(profileData.data.otherInfo.skills);

        //console.log(profileData.data.otherInfo);
      }

      // // Fetch interests
      // const interestsData = await getInterestsHandler({ userId }, setIsLoading, setError);
      // if (interestsData) setInterests(interestsData);

      // // Fetch achievements
      // const achievementsData = await getAchievementsHandler({ userId }, setIsLoading, setError);
      // if (achievementsData) setAchievements(achievementsData);

      // // Fetch education
      // const educationData = await getEducationHandler({ userId }, setIsLoading, setError);
      // if (educationData) setEducation(educationData);

      // // Fetch experience
      // const experienceData = await getExperienceHandler({ userId }, setIsLoading, setError);
      // if (experienceData) setExperience(experienceData);

      // // Fetch skills
      // const skillsData = await getSkillsHandler({ userId }, setIsLoading, setError);
      // if (skillsData) setSkills(skillsData);
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      const response = await toggleFollowHandler(
        { userId },
        setIsLoading,
        setError
      );
      if (response && response.success) {
        setProfile(prev => ({
          ...prev,
          isFollowing: !prev.isFollowing,
          followers: response.data.targetUser.followers
        }));
      }
    } catch (error) {
      setError("Error toggling follow status");
    }
  };

  const handleFollowersClick = () => {
    const queryParams = new URLSearchParams();
    if (userId) queryParams.set('userId', userId);
    queryParams.set('type', 'followers');
    navigate(`./followersOrFollowing?${queryParams.toString()}`);
  };

  const handleFollowingClick = () => {
    const queryParams = new URLSearchParams();
    if (userId) queryParams.set('userId', userId);
    queryParams.set('type', 'following');
    navigate(`./followersOrFollowing?${queryParams.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {error && (
        <div className="profile-error">
          <p>{error}</p>
          <button onClick={fetchAllData}>Try Again</button>
        </div>
      )}

      <div className="profile-header">
        <div className="profile-cover-image">
          <img src={profile.coverImage} alt="Cover" />
        </div>
        <div className="profile-info">
          <div className="profile-image-container">
            <img src={profile.image} alt={profile.name} />
          </div>
          <div className="profile-details">
            <h1>{profile.name}</h1>
            <p className="title">{profile.title}</p>
            <p className="email">{profile.email}</p>
            <div className="profile-college-info">
              <span className="college-name">{profile.collegeName}</span>
              <span className="college-year">{profile.collegeYear}</span>
              {profile.courseName && (
                <span className="course-name">{profile.courseName}</span>
              )}
            </div>
            <div className="profile-stats">
              <div className="profile-stat-item" onClick={handleFollowersClick} style={{ cursor: 'pointer' }}>
                <span className="profile-stat-value">{profile.followers}</span>
                <span className="profile-stat-label">Followers</span>
              </div>
              <div className="profile-stat-item" onClick={handleFollowingClick} style={{ cursor: 'pointer' }}>
                <span className="profile-stat-value">{profile.following}</span>
                <span className="profile-stat-label">Following</span>
              </div>
            </div>
            {!profile.isUserProfile && (
              <div className="profile-actions">
                <button
                  className={`profile-follow-button ${profile.isFollowing ? 'unfollow' : 'follow'}`}
                  onClick={handleFollowToggle}
                >
                  {profile.isFollowing ? 'Unfollow' : 'Follow'}
                </button>
                <button
                  className="profile-message-button"
                  onClick={() => navigate(`/dashboard/messages/${userId}`)}
                >
                  Message
                </button>
              </div>
            )}
            {profile.isUserProfile && (
              <button
                className="profile-edit-button"
                onClick={() => navigate("./edit")}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-left-panel">
          <div className="profile-section">
            <h2>About</h2>
            <p className="profile-description">{profile.description}</p>
          </div>

          {/* Interests Section */}
          {interests && (
            <div className="profile-section">
              <h2>Interests</h2>
              <div className="profile-interests">
                {interests.preferredJobTypes && (
                  <div className="profile-interest-group">
                    <h3>Preferred Job Types</h3>
                    <div className="profile-interest-tags">
                      {Array.isArray(interests.preferredJobTypes) ? (
                        interests.preferredJobTypes.map((type, index) => (
                          <span key={index} className="profile-interest-tag">
                            {type}
                          </span>
                        ))
                      ) : (
                        <span className="profile-interest-tag">
                          {interests.preferredJobTypes}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {interests.preferredLocations && (
                  <div className="profile-interest-group">
                    <h3>Preferred Locations</h3>
                    <div className="profile-interest-tags">
                      {Array.isArray(interests.preferredLocations) ? (
                        interests.preferredLocations.map((location, index) => (
                          <span key={index} className="profile-interest-tag">
                            {location}
                          </span>
                        ))
                      ) : (
                        <span className="profile-interest-tag">
                          {interests.preferredLocations}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {interests.preferredIndustries && (
                  <div className="profile-interest-group">
                    <h3>Preferred Industries</h3>
                    <div className="profile-interest-tags">
                      {Array.isArray(interests.preferredIndustries) ? (
                        interests.preferredIndustries.map((industry, index) => (
                          <span key={index} className="profile-interest-tag">
                            {industry}
                          </span>
                        ))
                      ) : (
                        <span className="profile-interest-tag">
                          {interests.preferredIndustries}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {interests.preferredRoles && (
                  <div className="profile-interest-group">
                    <h3>Preferred Roles</h3>
                    <div className="profile-interest-tags">
                      {Array.isArray(interests.preferredRoles) ? (
                        interests.preferredRoles.map((role, index) => (
                          <span key={index} className="profile-interest-tag">
                            {role}
                          </span>
                        ))
                      ) : (
                        <span className="profile-interest-tag">
                          {interests.preferredRoles}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {interests.workMode && (
                  <div className="profile-interest-group">
                    <h3>Work Mode</h3>
                    <p>{interests.workMode}</p>
                  </div>
                )}
                {interests.expectedSalary && (
                  <div className="profile-interest-group">
                    <h3>Expected Salary</h3>
                    <p>{interests.expectedSalary}</p>
                  </div>
                )}
                {interests.currentSalary && (
                  <div className="profile-interest-group">
                    <h3>Current Salary</h3>
                    <p>{interests.currentSalary}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Achievements Section */}
          {achievements.length > 0 && (
            <div className="profile-section">
              <h2>Achievements</h2>
              <div className="profile-achievements">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="profile-achievement-card"
                  >
                    <h3>{achievement.title}</h3>
                    <p>{achievement.description}</p>
                    <p className="date">
                      <i className="fas fa-calendar"></i>
                      {new Date(achievement.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p>Issuer: {achievement.issuer}</p>
                    {achievement.imageUrl && (
                      <div className="profile-achievement-image">
                        <img
                          src={`${process.env.REACT_APP_REMOTE_ADDRESS}/${achievement.imageUrl}`}
                          alt={achievement.title}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {education.length > 0 && (
            <div className="profile-section">
              <h2>Education</h2>
              <div className="profile-education">
                {education.map((edu) => (
                  <div key={edu.id} className="profile-education-card">
                    <h3>{edu.institution}</h3>
                    <p className="degree">
                      <i className="fas fa-graduation-cap"></i>
                      {edu.degree}
                    </p>
                    <p className="field">
                      <i className="fas fa-book"></i>
                      {edu.fieldOfStudy}
                    </p>
                    <p className="duration">
                      <i className="fas fa-calendar"></i>
                      {new Date(edu.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}{" "}
                      -{" "}
                      {new Date(edu.endDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                    <p className="grade">
                      <i className="fas fa-star"></i>
                      Grade: {edu.grade}
                    </p>
                    {edu.description && (
                      <p className="description">
                        <i className="fas fa-info-circle"></i>
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience Section */}
          {experience.length > 0 && (
            <div className="profile-section">
              <h2>Experience</h2>
              <div className="profile-experience">
                {experience.map((exp) => (
                  <div key={exp.id} className="profile-experience-card">
                    <h3>{exp.company}</h3>
                    <p className="position">
                      <i className="fas fa-briefcase"></i>
                      {exp.position}
                    </p>
                    <p className="duration">
                      <i className="fas fa-calendar"></i>
                      {new Date(exp.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}{" "}
                      -{" "}
                      {new Date(exp.endDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                    <p className="location">
                      <i className="fas fa-map-marker-alt"></i>
                      {exp.location}
                    </p>
                    <p className="type">
                      <i className="fas fa-clock"></i>
                      {exp.employmentType}
                    </p>
                    {exp.description && (
                      <p className="description">
                        <i className="fas fa-info-circle"></i>
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {skills.length > 0 && (
            <div className="profile-section">
              <h2>Skills</h2>
              <div className="profile-skills">
                {skills.map((skill) => (
                  <div key={skill.id} className="profile-skill-card">
                    <h3>{skill.name}</h3>
                    <p className="level">
                      <i className="fas fa-star"></i>
                      Level: {skill.level}
                    </p>
                    <p className="experience">
                      <i className="fas fa-clock"></i>
                      Experience: {skill.yearsOfExperience} years
                    </p>
                    <p className="category">
                      <i className="fas fa-tag"></i>
                      Category: {skill.category}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="profile-feeds">
          <Feed
            usersFeed={!userId}
            othersUserId={userId}
            showCreatePost={!userId}
          />
        </div>
      </div>
    </div>
  );
};
