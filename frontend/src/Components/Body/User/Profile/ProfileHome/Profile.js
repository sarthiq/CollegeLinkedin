import React, { useState, useEffect } from "react";
import { getProfileHandler } from "../profileApiHandler";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./Profile.css";
import { Feed } from "../../Common/Feed/Feed";

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
  });

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    const response = await getProfileHandler(
      { userId },
      setIsLoading,
      (error) => {
        setError(error);
      }
    );

    if (response && response.success) {
      const profileData = response.data;
      setProfile({
        name: profileData.User?.name || "",
        title: profileData.title || "",
        email: profileData.User?.email || "",
        phone: profileData.User?.phone || "",
        description: profileData.bio || "",
        followers: 0,
        following: 0,
        image: profileData.profileUrl
          ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${profileData.profileUrl}`
          : "/assets/Utils/male.png",
        coverImage: profileData.coverUrl
          ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${profileData.coverUrl}`
          : "https://placehold.co/1200x300",
        collegeName: profileData.collegeName || "",
        collegeYear: profileData.collegeYear || "",
        courseName: profileData.courseName || "",
      });
    }
  };

  const [feeds, setFeeds] = useState([
    {
      id: 1,
      user: {
        name: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        title: "Computer Science Student",
      },
      content: "Just completed my final year project on machine learning!",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      likes: [
        { id: 1, user: "Alice Smith" },
        { id: 2, user: "Bob Johnson" },
      ],
      comments: [
        {
          id: 1,
          user: {
            name: "Alice Smith",
            avatar: "https://randomuser.me/api/portraits/women/1.jpg",
          },
          text: "Great work!",
          timestamp: "1h ago",
        },
      ],
      timestamp: "2h ago",
      showComments: false,
    },
  ]);

  const handlePostSubmit = (content, image, callback) => {
    if (content.trim() || image) {
      const newFeed = {
        id: feeds.length + 1,
        user: {
          name: profile.name,
          avatar: profile.image,
          title: profile.title,
        },
        content,
        image,
        likes: [],
        comments: [],
        timestamp: "Just now",
        showComments: false,
      };
      setFeeds([newFeed, ...feeds]);
      callback();
    }
  };

  const handleLike = (feedId) => {
    setFeeds(
      feeds.map((feed) =>
        feed.id === feedId
          ? {
              ...feed,
              likes: [...feed.likes, { id: Date.now(), user: "Current User" }],
            }
          : feed
      )
    );
  };

  const handleComment = (feedId, commentText) => {
    if (commentText.trim()) {
      setFeeds(
        feeds.map((feed) =>
          feed.id === feedId
            ? {
                ...feed,
                comments: [
                  ...feed.comments,
                  {
                    id: Date.now(),
                    user: {
                      name: profile.name,
                      avatar: profile.image,
                    },
                    text: commentText,
                    timestamp: "Just now",
                  },
                ],
              }
            : feed
        )
      );
    }
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
          <button onClick={fetchProfile}>Try Again</button>
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
            <div className="profile-college-info">
              <span className="college-name">{profile.collegeName}</span>
              <span className="college-year">{profile.collegeYear}</span>
              {profile.courseName && (
                <span className="course-name">{profile.courseName}</span>
              )}
            </div>
            <div className="profile-stats">
              <div className="profile-stat-item">
                <span className="profile-stat-value">{profile.followers}</span>
                <span className="profile-stat-label">Followers</span>
              </div>
              <div className="profile-stat-item">
                <span className="profile-stat-value">{profile.following}</span>
                <span className="profile-stat-label">Following</span>
              </div>
            </div>
            {!userId && (
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
        <div className="profile-about">
          <h2>About</h2>
          <p className="profile-description">{profile.description}</p>
          <div className="profile-contact-info">
            <div className="profile-info-item">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <span>{profile.email}</span>
            </div>
            <div className="profile-info-item">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
              </svg>
              <span>{profile.phone}</span>
            </div>
          </div>
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
