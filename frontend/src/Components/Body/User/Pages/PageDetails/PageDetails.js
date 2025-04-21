import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Feed } from "../../Common/Feed/Feed";
import {
  getPageByIdHandler,
  toggleFollowPageHandler,
  updatePageHandler,
  deletePageHandler,
} from "../pageApiHandler";
import "./PageDetails.css";

export const PageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState({
    id: null,
    name: "",
    description: "",
    image: "",
    followers: 0,
    posts: 0,
    isFollowing: false,
    createdBy: "",
    lastActive: "",
    isUserCreated: false,
  });
  const [userInfo, setUserInfo] = useState({
    name: "",
    image: "",
    isAdmin: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    image: null,
  });
  const imageInputRef = useRef(null);

  const [feeds, setFeeds] = useState([]);

  // Fetch page details on component mount
  useEffect(() => {
    fetchPageDetails();
  }, [id]);

  const fetchPageDetails = async () => {
    setIsLoading(true);
    setError(null);

   
      const response = await getPageByIdHandler({ id }, setIsLoading, (error) =>
        setError(error)
      );

      if (response && response.success) {
        const pageData = response.data.page;
        const userData = response.data.admin;

        
        
        setUserInfo({
          name: userData.name,
          image: userData.profileUrl
            ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${userData.profileUrl}`
            : "https://placehold.co/150",
          isAdmin: userData.isAdmin || false,
        });

        // Transform the page data to match our component's structure
        setPage({
          id: pageData.id,
          name: pageData.title,
          description: pageData.description || "",
          image: pageData.imageUrl
            ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${pageData.imageUrl}`
            : "https://placehold.co/300x200",
          followers: pageData.followers || 0,
          posts: pageData.posts || 0,
          isFollowing: response.data.isFollowing || false,
          createdBy: userData.name || "Admin",
          lastActive: pageData.updatedAt
            ? new Date(pageData.updatedAt).toLocaleDateString()
            : "Never",
          isUserCreated: pageData.UserId === localStorage.getItem("userId"),
        });

        // Initialize edit form with current page data
        setEditForm({
          title: pageData.title,
          description: pageData.description || "",
          image: null,
        });

        // For now, we'll use dummy feed data since the API doesn't provide it
        // In a real implementation, you would fetch this from an API
        setFeeds([
          {
            id: 1,
            user: {
              name: "John Doe",
              avatar: "https://randomuser.me/api/portraits/men/1.jpg",
              title: "Computer Science Student",
            },
            content: "Just completed my final year project!",
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
                text: "Congratulations!",
                timestamp: "1h ago",
              },
              {
                id: 2,
                user: {
                  name: "Bob Johnson",
                  avatar: "https://randomuser.me/api/portraits/men/2.jpg",
                },
                text: "Great work!",
                timestamp: "45m ago",
              },
            ],
            timestamp: "2h ago",
            showComments: false,
          },
        ]);
      }
   
  };

  const handlePostSubmit = (content, image, callback) => {
    // In a real implementation, this would call an API to create a post
    const newFeed = {
      id: feeds.length + 1,
      user: {
        name: "Current User",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        title: "Student",
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
  };

  const handleLike = (feedId) => {
    // In a real implementation, this would call an API to like a post
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
    // In a real implementation, this would call an API to comment on a post
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
                      name: "Current User",
                      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
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

  const toggleFollow = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await toggleFollowPageHandler(
        { id: page.id },
        setIsLoading,
        (error) => setError(error)
      );

      if (response && response.success) {
        // Update the page's follow status and follower count
        setPage({
          ...page,
          isFollowing: !page.isFollowing,
          followers: page.isFollowing ? page.followers - 1 : page.followers + 1,
        });
      } else {
        setError("Failed to update follow status");
      }
    } catch (err) {
      setError(err.message || "An error occurred while updating follow status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to current page data
    setEditForm({
      title: page.name,
      description: page.description,
      image: null,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm({
        ...editForm,
        image: file,
      });
    }
  };

  const handleUpdatePage = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("id", page.id);
      formData.append("title", editForm.title);
      formData.append("description", editForm.description);

      if (editForm.image) {
        formData.append("image", editForm.image);
      }

      const response = await updatePageHandler(
        formData,
        setIsUpdating,
        (error) => setError(error)
      );

      if (response && response.success) {
        // Update local state with new data
        setPage({
          ...page,
          name: editForm.title,
          description: editForm.description,
          // Image URL will be updated after a successful fetch
        });

        // Refresh page data to get updated image URL
        await fetchPageDetails();
        setIsEditing(false);
      } else {
        setError("Failed to update page");
      }
    } catch (err) {
      setError(err.message || "An error occurred while updating the page");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePage = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this page? This action cannot be undone."
      )
    ) {
      setIsDeleting(true);
      setError(null);

      try {
        const response = await deletePageHandler(
          { id: page.id },
          setIsDeleting,
          (error) => setError(error)
        );

        if (response && response.success) {
          // Navigate back to pages list
          navigate("/pages");
        } else {
          setError("Failed to delete page");
        }
      } catch (err) {
        setError(err.message || "An error occurred while deleting the page");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleBack = () => {
    navigate("/pages");
  };

  if (isLoading && !page.id) {
    return (
      <div className="page-details-loading-container">
        <div className="page-details-spinner"></div>
        <p>Loading page details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-details-error-container">
        <p>{error}</p>
        <button onClick={fetchPageDetails}>Try Again</button>
        <button onClick={handleBack}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="page-details-container">
      <div className="page-header">
        <div className="page-cover">
          <img src={page.image} alt={page.name} className="cover-image" />
        </div>
        <div className="page-info">
          <div className="page-profile-avatar">
            <img src={page.image} alt={page.name} />
          </div>
          <div className="page-profile-details">
            {isEditing ? (
              <form onSubmit={handleUpdatePage} className="page-edit-form">
                <div className="form-group">
                  <label>Page Name</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Page Image</label>
                  <div className="image-upload-container">
                    {editForm.image ? (
                      <div className="image-preview">
                        <img
                          src={
                            typeof editForm.image === "string"
                              ? editForm.image
                              : URL.createObjectURL(editForm.image)
                          }
                          alt="Preview"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setEditForm({ ...editForm, image: null })
                          }
                          className="remove-image"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <label className="image-upload-button">
                        <input
                          type="file"
                          ref={imageInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                          style={{ display: "none" }}
                        />
                        <svg
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          fill="currentColor"
                        >
                          <path d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                        </svg>
                        <span>Upload Image</span>
                      </label>
                    )}
                  </div>
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="save-button"
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
            ) : (
              <>
                <h1 className="page-profile-name">{page.name}</h1>
                <p className="page-profile-description">{page.description}</p>
                <div className="page-profile-meta">
                  <div className="page-user-info">
                    <div className="page-user-avatar">
                      <img src={userInfo.image} alt={userInfo.name} />
                    </div>
                    <span>Created by {userInfo.name}</span>
                  </div>
                </div>
                <div className="page-profile-stats">
                  <div className="page-stat-item">
                    <span className="page-stat-value">{page.followers}</span>
                    <span className="page-stat-label">Followers</span>
                  </div>
                  <div className="page-stat-item">
                    <span className="page-stat-value">{page.posts}</span>
                    <span className="page-stat-label">Posts</span>
                  </div>
                </div>
                {userInfo.isAdmin ? (
                  <div className="page-admin-actions">
                    <button
                      className="page-edit-button"
                      onClick={handleEditClick}
                      disabled={isUpdating || isDeleting}
                    >
                      Edit Page
                    </button>
                    <button
                      className="page-delete-button"
                      onClick={handleDeletePage}
                      disabled={isUpdating || isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <span className="page-spinner-small"></span>
                          Deleting...
                        </>
                      ) : (
                        "Delete Page"
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    className={`page-follow-button ${
                      page.isFollowing ? "following" : ""
                    }`}
                    onClick={toggleFollow}
                    disabled={isLoading}
                  >
                    {page.isFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="page-content">
        <Feed pageId={id} showCreatePost={page.isFollowing || userInfo.isAdmin} />
      </div>
    </div>
  );
};
