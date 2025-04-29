import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProjectByIdHandler,
  updateProjectHandler,
  deleteProjectHandler,
  applyForCollaborationHandler,
  withdrawCollaborationHandler,
  updateCollaborationStatusHandler,
  sendCollaborationInvitationHandler,
  handleCollaborationRequest,
} from "../projectsApiHandler";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./ProjectDetails.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "image",
];

const statusOptions = ["pending", "accepted", "rejected"];

export const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState({
    imagesUrl: [],
    technologies: [],
    ProjectMembers: [],
    ProjectFeedbacks: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [tempInput, setTempInput] = useState({
    technology: "",
  });

  const [editData, setEditData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
    technologies: [],
    githubUrl: "",
    isSourceCodePublic: false,
    isPublic: false,
    existingImages: [],
    newImages: [],
  });

  const [applyData, setApplyData] = useState({
    role: "",
    type: "",
    description: "",
  });

  const [statusData, setStatusData] = useState({
    status: "",
    feedback: "",
  });

  const [selectedImagePopup, setSelectedImagePopup] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imagePopupRef = useRef(null);
  const [autoSlide, setAutoSlide] = useState(true);
  const [sliderInterval, setSliderInterval] = useState(null);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: "",
    role: "",
    type: "",
    description: "",
  });

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState({
    action: "",
    feedback: "",
  });

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getProjectByIdHandler(
        { id },
        setIsLoading,
        setError
      );
      if (response && response.success) {
        setProject({
          ...response.data,
          imagesUrl: response.data.imagesUrl || [],
          technologies: response.data.technologies || [],
          ProjectMembers: response.data.ProjectMembers || [],
          ProjectFeedbacks: response.data.ProjectFeedbacks || [],
        });
        setEditData({
          title: response.data.title || "",
          description: response.data.description || "",
          startDate: response.data.startDate || "",
          endDate: response.data.endDate || "",
          status: response.data.status || "",
          technologies: response.data.technologies || [],
          githubUrl: response.data.githubUrl || "",
          isSourceCodePublic: response.data.isSourceCodePublic || false,
          isPublic: response.data.isPublic || false,
          existingImages: response.data.imagesUrl || [],
          newImages: [],
        });
      }
    } catch (err) {
      setError(err.message || "Failed to fetch project details");
    }
  };

  const handleEditClick = () => {
    setEditData({
      title: project?.title || "",
      description: project?.description || "",
      startDate: project?.startDate || "",
      endDate: project?.endDate || "",
      status: project?.status || "",
      technologies: project?.technologies || [],
      githubUrl: project?.githubUrl || "",
      isSourceCodePublic: project?.isSourceCodePublic || false,
      isPublic: project?.isPublic || false,
      existingImages: project?.imagesUrl || [],
      newImages: [],
    });
    setShowEditModal(true);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setEditData((prev) => ({
        ...prev,
        newImages: [...prev.newImages, ...files],
      }));
    }
  };

  const removeImage = (index, isExisting) => {
    if (isExisting) {
      setEditData((prev) => ({
        ...prev,
        existingImages: prev.existingImages.filter((_, i) => i !== index),
      }));
    } else {
      setEditData((prev) => ({
        ...prev,
        newImages: prev.newImages.filter((_, i) => i !== index),
      }));
    }
  };

  const handleAddTechnology = () => {
    if (tempInput.technology && tempInput.technology.trim() !== "") {
      setEditData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, tempInput.technology.trim()],
      }));
      setTempInput((prev) => ({
        ...prev,
        technology: "",
      }));
    }
  };

  const handleRemoveTechnology = (index) => {
    setEditData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTechnology();
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();

    // Append all fields except images
    Object.keys(editData).forEach((key) => {
      if (key !== "existingImages" && key !== "newImages") {
        if (Array.isArray(editData[key])) {
          // For array fields, append each item separately
          editData[key].forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, editData[key]);
        }
      }
    });

    // Append existing images that weren't removed
    editData.existingImages.forEach((image, index) => {
      formData.append(`existingImages[${index}]`, image);
    });

    // Append new images
    editData.newImages.forEach((image, index) => {
      formData.append("image", image);
    });

    formData.append("id", id);

    const response = await updateProjectHandler(
      formData,
      setIsLoading,
      (error) => setError(error)
    );

    if (response && response.success) {
      setShowEditModal(false);
      fetchProjectDetails();
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        setIsLoading(true);
        setError(null);
        const response = await deleteProjectHandler(
          { id },
          setIsLoading,
          setError
        );
        if (response && response.success) {
          navigate("/dashboard/projects");
        }
      } catch (err) {
        setError(err.message || "Failed to delete project");
      }
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      const formData = new FormData();

      Object.keys(applyData).forEach((key) => {
        formData.append(key, applyData[key]);
      });

      formData.append("projectId", id);
      const response = await applyForCollaborationHandler(
        formData,
        setIsLoading,
        setError
      );
      if (response && response.success) {
        setShowApplyModal(false);
        fetchProjectDetails();
      }
    } catch (err) {
      setError(err.message || "Failed to apply for project");
    }
  };

  const handleWithdraw = async () => {
    if (window.confirm("Are you sure you want to withdraw your application?")) {
      try {
        setIsLoading(true);
        setError(null);
        const response = await withdrawCollaborationHandler(
          { projectId: id },
          setIsLoading,
          setError
        );
        if (response && response.success) {
          fetchProjectDetails();
        }
      } catch (err) {
        setError(err.message || "Failed to withdraw application");
      }
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      const response = await updateCollaborationStatusHandler(
        {
          projectId: id,
          userId: selectedMember.id,
          status: statusData.status,
          feedback: statusData.feedback,
        },
        setIsLoading,
        setError
      );

      if (response && response.success) {
        setShowStatusModal(false);
        fetchProjectDetails();
      }
    } catch (err) {
      setError(err.message || "Failed to update status");
    }
  };

  const handleImageClick = (images, index) => {
    setSelectedImagePopup(images);
    setCurrentImageIndex(index);
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleClosePopup = (e) => {
    if (
      e.target === imagePopupRef.current ||
      e.target.closest(".project-details-image-popup-close")
    ) {
      setSelectedImagePopup(null);
      setImageZoom(1);
      setImagePosition({ x: 0, y: 0 });
      setCurrentImageIndex(0);
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? project.imagesUrl.length - 1 : prev - 1
    );
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === project.imagesUrl.length - 1 ? 0 : prev + 1
    );
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setImageZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setImageZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleMouseDown = (e) => {
    if (imageZoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && imageZoom > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Auto slide functionality
  useEffect(() => {
    if (autoSlide && project?.imagesUrl?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === project.imagesUrl.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      setSliderInterval(interval);
      return () => clearInterval(interval);
    }
  }, [autoSlide, project?.imagesUrl]);

  const toggleAutoSlide = () => {
    setAutoSlide((prev) => !prev);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      const formData = new FormData();
      Object.keys(inviteData).forEach((key) => {
        formData.append(key, inviteData[key]);
      });
      formData.append("projectId", id);

      const response = await sendCollaborationInvitationHandler(
        formData,
        setIsLoading,
        setError
      );

      if (response && response.success) {
        setShowInviteModal(false);
        setInviteData({
          email: "",
          role: "",
          type: "",
          description: "",
        });
        fetchProjectDetails();
      }
    } catch (err) {
      setError(err.message || "Failed to send invitation");
      setIsLoading(false); // Reset loading state on error
    }
  };

  const handleCollaborationRequest = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      const response = await handleCollaborationRequest(
        {
          projectId: id,
          userId: project?.projectMember?.UserId,
          action: requestData.action,
        },
        setIsLoading,
        setError
      );
      if (response && response.success) {
        setShowRequestModal(false);
        setRequestData({
          action: "",
          feedback: "",
        });
        fetchProjectDetails();
      }
    } catch (err) {
      setError(err.message || "Failed to handle collaboration request");
    }
  };

  if (isLoading) {
    return (
      <div className="project-details-container">
        <div className="project-details-loading">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-details-container">
        <div className="project-details-error-message">
          <p>Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="project-details-container">

       {/* Error Message Section - Moved here */}
       {error && (
        <div className="project-details-error-message">
          <p>{error}</p>
          <button className="project-details-try-again-button" onClick={fetchProjectDetails}>Try Again</button>
        </div>
      )}


      {/* Header Section */}
      <div className="project-details-header">
        <div className="project-details-header-content">
          <h1>{project?.title || "Loading..."}</h1>
          <p className="project-details-creator-name">{project?.User?.name || ""}</p>
        </div>
        <div className="project-details-header-actions">
          {project?.isUserCreated ? (
            <>
              <button className="project-details-edit-button" onClick={handleEditClick}>
                Edit Project
              </button>
              <button className="project-details-delete-button" onClick={handleDeleteProject}>
                Delete Project
              </button>
              <button className="project-details-members-button" onClick={() => setShowMembersModal(true)}>
                View Members
              </button>
              <button className="project-details-invite-button" onClick={() => setShowInviteModal(true)}>
                Invite Collaborator
              </button>
            </>
          ) : project?.projectMember ? (
            <>
              <button className="project-details-status-button" onClick={() => setShowStatusModal(true)}>
                View Application Status
              </button>
              <button className="project-details-withdraw-button" onClick={handleWithdraw}>
                Withdraw Application
              </button>
              {project?.projectMember?.status === "requested" && (
                <button className="project-details-request-button" onClick={() => setShowRequestModal(true)}>
                  Handle Collaboration Request
                </button>
              )}
            </>
          ) : (
            <button className="project-details-apply-button" onClick={() => setShowApplyModal(true)}>
              Apply Now
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="project-details-content">
        <div className="project-details-images">
          <div className="project-details-image-slider">
            {(project?.imagesUrl || []).map((image, index) => (
              <div
                key={index}
                className={`project-details-slider-image ${
                  index === currentImageIndex ? "active" : ""
                }`}
                onClick={() => handleImageClick(project.imagesUrl, index)}
              >
                <img
                  src={`${process.env.REACT_APP_REMOTE_ADDRESS}/${image}`}
                  alt={`Project ${index + 1}`}
                />
              </div>
            ))}
            {(project?.imagesUrl || []).length > 1 && (
              <>
                <button className="project-details-slider-nav prev" onClick={handlePrevImage}>
                  &lt;
                </button>
                <button className="project-details-slider-nav next" onClick={handleNextImage}>
                  &gt;
                </button>
                <div className="project-details-slider-controls">
                  <button
                    className={`project-details-auto-slide-toggle ${autoSlide ? "active" : ""}`}
                    onClick={toggleAutoSlide}
                  >
                    {autoSlide ? "⏸️" : "▶️"}
                  </button>
                  <div className="project-details-slider-dots">
                    {(project?.imagesUrl || []).map((_, index) => (
                      <button
                        key={index}
                        className={`project-details-dot ${
                          index === currentImageIndex ? "active" : ""
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="project-details-info">
          <div className="project-details-info-section">
            <h2>About the Project</h2>
            <div
              className="project-details-description"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          </div>

          <div className="project-details-info-grid">
            <div className="project-details-info-item">
              <span className="project-details-label">Start Date:</span>
              <span className="project-details-value">
                {new Date(project.startDate).toLocaleDateString()}
              </span>
            </div>
            {project.endDate && (
              <div className="project-details-info-item">
                <span className="project-details-label">End Date:</span>
                <span className="project-details-value">
                  {new Date(project.endDate).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="project-details-info-item">
              <span className="project-details-label">Status:</span>
              <span className="project-details-value">{project.status}</span>
            </div>
            {project.githubUrl && (
              <div className="project-details-info-item">
                <span className="project-details-label">GitHub:</span>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-details-github-link"
                >
                  View Repository
                </a>
              </div>
            )}
            <div className="project-details-info-item">
              <span className="project-details-label">Source Code:</span>
              <span className="project-details-value">
                {project.isSourceCodePublic ? "Public" : "Private"}
              </span>
            </div>
            <div className="project-details-info-item">
              <span className="project-details-label">Project Visibility:</span>
              <span className="project-details-value">
                {project.isPublic ? "Public" : "Private"}
              </span>
            </div>
          </div>

          <div className="project-details-info-section">
            <h2>Technologies Used</h2>
            <div className="project-details-technologies-list">
              {(project?.technologies || []).map((tech, index) => (
                <span key={index} className="project-details-tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="project-details-info-section">
            <h2>Project Members</h2>
            <div className="project-details-members-list">
              {(project?.ProjectMembers || []).map((member) => (
                <div key={member.id} className="project-details-member-card">
                  <img
                    src={
                      member.User?.UserProfile?.profileUrl
                        ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${member.User?.UserProfile?.profileUrl}`
                        : "/assets/Utils/male.png"
                    }
                    alt={member.User?.name}
                    className="project-details-member-profile"
                  />
                  <div className="project-details-member-info">
                    <h3>{member.User?.name}</h3>
                    <p>{member.role}</p>
                    <p className={`project-details-status-badge ${member.status}`}>
                      {member.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="project-details-info-section">
            <h2>Project Feedback</h2>
            <div className="project-details-feedback-list">
              {(project?.ProjectFeedbacks || []).map((feedback) => (
                <div key={feedback.id} className="project-details-feedback-card">
                  <div className="project-details-feedback-header">
                    <img
                      src={
                        feedback.User?.UserProfile?.profileUrl
                          ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${feedback.User?.UserProfile?.profileUrl}`
                          : "/assets/Utils/male.png"
                      }
                      alt={feedback.User?.name}
                      className="project-details-feedback-profile"
                    />
                    <div className="project-details-feedback-info">
                      <h3>{feedback.User?.name}</h3>
                      <p className="project-details-feedback-date">
                        {new Date(feedback.feedbackDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="project-details-feedback-rating">
                      {Array.from({ length: feedback.rating }).map((_, i) => (
                        <span key={i} className="project-details-star">★</span>
                      ))}
                    </div>
                  </div>
                  <p className="project-details-feedback-comment">
                    {feedback.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

     
      {/* Edit Modal */}
      {showEditModal && (
        <div className="project-details-modal">
          <div className="project-details-modal-content project-details-edit-modal">
            <div className="project-details-modal-header">
              <h2>Edit Project</h2>
              <button className="project-details-close-button" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            {error && (
              <div className="project-details-error-message">
                <p>{error}</p>
              </div>
            )}
            <form onSubmit={handleUpdateProject}>
              <div className="project-details-form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  placeholder="Enter project title"
                  required
                />
              </div>
              <div className="project-details-form-group">
                <label>Description</label>
                <ReactQuill
                  value={editData.description}
                  onChange={(value) =>
                    setEditData({ ...editData, description: value })
                  }
                  modules={modules}
                  formats={formats}
                  placeholder="Enter project description"
                />
              </div>
              <div className="project-details-form-row">
                <div className="project-details-form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={editData.startDate}
                    onChange={(e) =>
                      setEditData({ ...editData, startDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="project-details-form-group">
                  <label>End Date (Optional)</label>
                  <input
                    type="date"
                    value={editData.endDate}
                    onChange={(e) =>
                      setEditData({ ...editData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="project-details-form-group">
                <label>Status</label>
                <select
                  value={editData.status}
                  onChange={(e) =>
                    setEditData({ ...editData, status: e.target.value })
                  }
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="project-details-form-group">
                <label>Technologies</label>
                <div className="project-details-array-input-container">
                  <div className="project-details-array-input-field">
                    <input
                      type="text"
                      value={tempInput.technology}
                      onChange={(e) =>
                        setTempInput({ ...tempInput, technology: e.target.value })
                      }
                      onKeyPress={handleKeyPress}
                      placeholder="Add technology and press Enter"
                    />
                    <button
                      type="button"
                      className="project-details-add-item-button"
                      onClick={handleAddTechnology}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                  <div className="project-details-array-items-list">
                    {(editData?.technologies || []).map((item, index) => (
                      <div key={index} className="project-details-array-item">
                        <span>{item}</span>
                        <button
                          type="button"
                          className="project-details-remove-item-button"
                          onClick={() => handleRemoveTechnology(index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="project-details-form-group">
                <label>GitHub URL (Optional)</label>
                <input
                  type="url"
                  value={editData.githubUrl}
                  onChange={(e) =>
                    setEditData({ ...editData, githubUrl: e.target.value })
                  }
                  placeholder="Enter GitHub repository URL"
                />
              </div>
              <div className="project-details-form-row">
                <div className="project-details-form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={editData.isSourceCodePublic}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          isSourceCodePublic: e.target.checked,
                        })
                      }
                    />
                    Source Code Public
                  </label>
                </div>
                <div className="project-details-form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={editData.isPublic}
                      onChange={(e) =>
                        setEditData({ ...editData, isPublic: e.target.checked })
                      }
                    />
                    Project Public
                  </label>
                </div>
              </div>
              <div className="project-details-form-group">
                <label>Images</label>
                <div className="project-details-image-upload-container">
                  {/* Existing Images */}
                  {(editData?.existingImages || []).map((image, index) => (
                    <div key={`existing-${index}`} className="project-details-image-preview">
                      <img
                        src={`${process.env.REACT_APP_REMOTE_ADDRESS}/${image}`}
                        alt={`Existing ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, true)}
                        className="project-details-remove-image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {/* New Images */}
                  {(editData?.newImages || []).map((image, index) => (
                    <div key={`new-${index}`} className="project-details-image-preview">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, false)}
                        className="project-details-remove-image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <label className="project-details-image-upload-button">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      multiple
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
                    <span>Upload Images</span>
                  </label>
                </div>
              </div>
              <div className="project-details-form-actions">
                <button
                  type="button"
                  className="project-details-cancel-button"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="project-details-update-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="project-details-modal">
          <div className="project-details-modal-content project-details-apply-modal">
            <div className="project-details-modal-header">
              <h2>Apply for Project</h2>
              <button className="project-details-close-button" onClick={() => setShowApplyModal(false)}>×</button>
            </div>
            <form onSubmit={handleApply}>
              <div className="project-details-form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={applyData.role}
                  onChange={(e) =>
                    setApplyData({ ...applyData, role: e.target.value })
                  }
                  placeholder="Enter your role in the project"
                  required
                />
              </div>
              <div className="project-details-form-group">
                <label>Type</label>
                <input
                  type="text"
                  value={applyData.type}
                  onChange={(e) =>
                    setApplyData({ ...applyData, type: e.target.value })
                  }
                  placeholder="Enter your type of contribution"
                  required
                />
              </div>
              <div className="project-details-form-group">
                <label>Description</label>
                <textarea
                  value={applyData.description}
                  onChange={(e) =>
                    setApplyData({ ...applyData, description: e.target.value })
                  }
                  placeholder="Describe your skills and experience"
                  required
                />
              </div>
              <div className="project-details-form-actions">
                <button
                  type="button"
                  className="project-details-cancel-button"
                  onClick={() => setShowApplyModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="project-details-submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Members Modal */}
      {showMembersModal && (
        <div className="project-details-modal">
          <div className="project-details-modal-content project-details-members-modal">
            <div className="project-details-modal-header">
              <h2>Project Members</h2>
              <button className="project-details-close-button" onClick={() => setShowMembersModal(false)}>×</button>
            </div>
            <div className="project-details-members-list">
              {(project?.ProjectMembers || []).map((member) => (
                <div key={member.id} className="project-details-member-card">
                  <div className="project-details-member-info">
                    <img
                      src={
                        member.User?.UserProfile?.profileUrl
                          ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${member.User?.UserProfile?.profileUrl}`
                          : "/assets/Utils/male.png"
                      }
                      alt={member.User?.name}
                      className="project-details-member-profile"
                    />
                    <div className="project-details-member-details">
                      <h3>{member.User?.name}</h3>
                      <p>{member.User?.email}</p>
                      <p className={`project-details-status-badge ${member.status}`}>
                        {member.status}
                      </p>
                    </div>
                  </div>

                  <div className="project-details-member-application">
                    <div className="project-details-detail-row">
                      <span className="project-details-detail-label">Role:</span>
                      <span className="project-details-detail-value">
                        {member.role || "Not specified"}
                      </span>
                    </div>
                    <div className="project-details-detail-row">
                      <span className="project-details-detail-label">Type:</span>
                      <span className="project-details-detail-value">
                        {member.type || "Not specified"}
                      </span>
                    </div>
                    <div className="project-details-detail-row">
                      <span className="project-details-detail-label">Description:</span>
                      <span className="project-details-detail-value">
                        {member.description || "Not specified"}
                      </span>
                    </div>
                    <div className="project-details-detail-row">
                      <span className="project-details-detail-label">Joined At:</span>
                      <span className="project-details-detail-value">
                        {new Date(member.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="project-details-member-actions">
                    <button
                      className="project-details-update-status-button"
                      onClick={() => {
                        setSelectedMember(member);
                        setStatusData({
                          status: member.status,
                          feedback: "",
                        });
                        setShowStatusModal(true);
                      }}
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="project-details-modal">
          <div className="project-details-modal-content project-details-status-modal">
            <div className="project-details-modal-header">
              <h2>
                {project?.isUserCreated
                  ? `Update Status for ${selectedMember?.User?.name}`
                  : "Your Application Status"}
              </h2>
              <button className="project-details-close-button" onClick={() => setShowStatusModal(false)}>×</button>
            </div>

            {!project?.isUserCreated && (
              <div className="project-details-application-details">
                <div className="project-details-detail-row">
                  <span className="project-details-detail-label">Role:</span>
                  <span className="project-details-detail-value">
                    {project?.projectMember?.role || "Not specified"}
                  </span>
                </div>
                <div className="project-details-detail-row">
                  <span className="project-details-detail-label">Type:</span>
                  <span className="project-details-detail-value">
                    {project?.projectMember?.type || "Not specified"}
                  </span>
                </div>
                <div className="project-details-detail-row">
                  <span className="project-details-detail-label">Description:</span>
                  <span className="project-details-detail-value">
                    {project?.projectMember?.description || "Not specified"}
                  </span>
                </div>
                <div className="project-details-detail-row">
                  <span className="project-details-detail-label">Applied At:</span>
                  <span className="project-details-detail-value">
                    {new Date(project?.projectMember?.joinDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="project-details-detail-row">
                  <span className="project-details-detail-label">Current Status:</span>
                  <span className={`project-details-status-badge ${project?.projectMember?.status}`}>
                    {project?.projectMember?.status}
                  </span>
                </div>
              </div>
            )}

            {project?.isUserCreated && (
              <form onSubmit={handleUpdateStatus}>
                <div className="project-details-form-group">
                  <label>Status</label>
                  <select
                    value={statusData.status}
                    onChange={(e) =>
                      setStatusData({ ...statusData, status: e.target.value })
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="project-details-form-group">
                  <label>Feedback</label>
                  <textarea
                    value={statusData.feedback}
                    onChange={(e) =>
                      setStatusData({ ...statusData, feedback: e.target.value })
                    }
                    placeholder="Enter feedback (optional)"
                  />
                </div>
                <div className="project-details-form-actions">
                  <button type="submit" className="project-details-update-button">
                    Update Status
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {selectedImagePopup && (
        <div className="project-details-image-popup" ref={imagePopupRef} onClick={handleClosePopup}>
          <div className="project-details-image-popup-content">
            <button className="project-details-image-popup-close">×</button>
            <button
              className="project-details-image-popup-nav prev"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
            >
              ←
            </button>
            <button
              className="project-details-image-popup-nav next"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
            >
              →
            </button>
            <div className="project-details-image-popup-counter">
              {currentImageIndex + 1} / {selectedImagePopup.length}
            </div>
            <img
              src={`${process.env.REACT_APP_REMOTE_ADDRESS}/${selectedImagePopup[currentImageIndex]}`}
              alt="Full size"
              style={{
                transform: `scale(${imageZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                cursor: imageZoom > 1 ? "move" : "default",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            <div className="project-details-image-popup-zoom-controls">
              <button className="project-details-zoom-button" onClick={handleZoomIn}>+</button>
              <button className="project-details-zoom-button" onClick={handleZoomOut}>-</button>
            </div>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div className="project-details-modal">
          <div className="project-details-modal-content project-details-invite-modal">
            <div className="project-details-modal-header">
              <h2>Invite Collaborator</h2>
              <button className="project-details-close-button" onClick={() => setShowInviteModal(false)}>×</button>
            </div>
            {error && (
              <div className="project-details-error-message">
                <p>{error}</p>
              </div>
            )}
            <form onSubmit={handleInvite}>
              <div className="project-details-form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={inviteData.email}
                  onChange={(e) =>
                    setInviteData({ ...inviteData, email: e.target.value })
                  }
                  placeholder="Enter collaborator's email"
                  required
                />
              </div>
              <div className="project-details-form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={inviteData.role}
                  onChange={(e) =>
                    setInviteData({ ...inviteData, role: e.target.value })
                  }
                  placeholder="Enter role in the project"
                  required
                />
              </div>
              <div className="project-details-form-group">
                <label>Type</label>
                <input
                  type="text"
                  value={inviteData.type}
                  onChange={(e) =>
                    setInviteData({ ...inviteData, type: e.target.value })
                  }
                  placeholder="Enter type of contribution"
                  required
                />
              </div>
              <div className="project-details-form-group">
                <label>Description</label>
                <textarea
                  value={inviteData.description}
                  onChange={(e) =>
                    setInviteData({ ...inviteData, description: e.target.value })
                  }
                  placeholder="Describe the collaboration details"
                  required
                />
              </div>
              <div className="project-details-form-actions">
                <button
                  type="button"
                  className="project-details-cancel-button"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="project-details-submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRequestModal && (
        <div className="project-details-modal">
          <div className="project-details-modal-content project-details-request-modal">
            <div className="project-details-modal-header">
              <h2>Handle Collaboration Request</h2>
              <button className="project-details-close-button" onClick={() => setShowRequestModal(false)}>×</button>
            </div>
            {error && (
              <div className="project-details-error-message">
                <p>{error}</p>
              </div>
            )}
            <form onSubmit={handleCollaborationRequest}>
              <div className="project-details-form-group">
                <label>Action</label>
                <select
                  value={requestData.action}
                  onChange={(e) =>
                    setRequestData({ ...requestData, action: e.target.value })
                  }
                  required
                >
                  <option value="">Select an action</option>
                  <option value="accept">Accept</option>
                  <option value="reject">Reject</option>
                </select>
              </div>
              <div className="project-details-form-group">
                <label>Feedback (Optional)</label>
                <textarea
                  value={requestData.feedback}
                  onChange={(e) =>
                    setRequestData({ ...requestData, feedback: e.target.value })
                  }
                  placeholder="Enter feedback for the collaboration request"
                />
              </div>
              <div className="project-details-form-actions">
                <button
                  type="button"
                  className="project-details-cancel-button"
                  onClick={() => setShowRequestModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="project-details-submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

