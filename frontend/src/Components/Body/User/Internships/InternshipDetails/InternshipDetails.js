import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getInternshipByIdHandler, 
  updateInternshipHandler, 
  deleteInternshipHandler,
  applyForInternshipHandler,
  withdrawInternshipHandler,
  updateUserStatusHandler
} from '../internshipsApiHandler';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './InternshipDetails.css';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ]
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'image'
];

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance'];
const categories = ['Technology', 'Business', 'Design', 'Marketing', 'Other'];
const experienceLevels = ['Entry Level', 'Intermediate', 'Expert'];

export const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState({
    imagesUrl: [],
    responsibilities: [],
    requirements: [],
    perksOrBenefits: [],
    skills: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [tempInput, setTempInput] = useState({
    responsibility: '',
    requirement: '',
    perk: '',
    skill: ''
  });

  const [editData, setEditData] = useState({
    title: '',
    companyName: '',
    description: '',
    role: '',
    responsibilities: [],
    requirements: [],
    perksOrBenefits: [],
    otherDetails: '',
    location: '',
    jobType: '',
    remote: false,
    salary: '',
    duration: '',
    skills: [],
    deadline: '',
    status: 'active',
    category: '',
    experienceLevel: '',
    existingImages: [],
    newImages: []
  });

  const [applyData, setApplyData] = useState({
    noticePeriod: '',
    currentSalary: '',
    expectedSalary: '',
    availability: '',
    coverLetter: '',
    resume: null
  });

  const [statusData, setStatusData] = useState({
    status: 'pending',
    feedback: ''
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

  useEffect(() => {
    fetchInternshipDetails();
  }, [id]);

  const fetchInternshipDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getInternshipByIdHandler({ id }, setIsLoading, setError);
      if (response && response.success) {
        setInternship({
          ...response.data,
          imagesUrl: response.data.imagesUrl || [],
          responsibilities: response.data.responsibilities || [],
          requirements: response.data.requirements || [],
          perksOrBenefits: response.data.perksOrBenefits || [],
          skills: response.data.skills || []
        });
        setEditData({
          title: response.data.title || '',
          companyName: response.data.companyName || '',
          description: response.data.description || '',
          role: response.data.role || '',
          responsibilities: response.data.responsibilities || [],
          requirements: response.data.requirements || [],
          perksOrBenefits: response.data.perksOrBenefits || [],
          otherDetails: response.data.otherDetails || '',
          location: response.data.location || '',
          jobType: response.data.jobType || '',
          remote: response.data.remote || false,
          salary: response.data.salary || '',
          duration: response.data.duration || '',
          skills: response.data.skills || [],
          deadline: response.data.deadline || '',
          status: response.data.status || 'active',
          category: response.data.category || '',
          experienceLevel: response.data.experienceLevel || '',
          existingImages: response.data.imagesUrl || [],
          newImages: []
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch internship details');
    }
  };

  const handleEditClick = () => {
    setEditData({
      title: internship?.title || '',
      companyName: internship?.companyName || '',
      description: internship?.description || '',
      role: internship?.role || '',
      responsibilities: internship?.responsibilities || [],
      requirements: internship?.requirements || [],
      perksOrBenefits: internship?.perksOrBenefits || [],
      otherDetails: internship?.otherDetails || '',
      location: internship?.location || '',
      jobType: internship?.jobType || '',
      remote: internship?.remote || false,
      salary: internship?.salary || '',
      duration: internship?.duration || '',
      skills: internship?.skills || [],
      deadline: internship?.deadline || '',
      status: internship?.status || 'active',
      category: internship?.category || '',
      experienceLevel: internship?.experienceLevel || '',
      existingImages: internship?.imagesUrl || [],
      newImages: []
    });
    setShowEditModal(true);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setEditData(prev => ({
        ...prev,
        newImages: [...prev.newImages, ...files]
      }));
    }
  };

  const removeImage = (index, isExisting) => {
    if (isExisting) {
      setEditData(prev => ({
        ...prev,
        existingImages: prev.existingImages.filter((_, i) => i !== index)
      }));
    } else {
      setEditData(prev => ({
        ...prev,
        newImages: prev.newImages.filter((_, i) => i !== index)
      }));
    }
  };

  const handleAddItem = (field) => {
    const inputField = field === 'responsibilities' ? 'responsibility' :
                      field === 'requirements' ? 'requirement' :
                      field === 'perksOrBenefits' ? 'perk' :
                      'skill';

    if (tempInput[inputField] && tempInput[inputField].trim() !== '') {
      setEditData(prev => ({
        ...prev,
        [field]: [...prev[field], tempInput[inputField].trim()]
      }));
      setTempInput(prev => ({
        ...prev,
        [inputField]: ''
      }));
    }
  };

  const handleRemoveItem = (field, index) => {
    setEditData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem(field);
    }
  };

  const handleUpdateInternship = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    
    // Append all fields except images
    Object.keys(editData).forEach(key => {
      if (key !== 'existingImages' && key !== 'newImages') {
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
      formData.append('image', image);
    });

    formData.append('id', id);

    const response = await updateInternshipHandler(
      formData,
      setIsLoading,
      (error) => setError(error)
    );

    if (response && response.success) {
      setShowEditModal(false);
      fetchInternshipDetails();
    }
  };

  const handleDeleteInternship = async () => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      try {
        setIsLoading(true);
        setError(null);
        const response = await deleteInternshipHandler({ id }, setIsLoading, setError);
        if (response && response.success) {
          navigate('/dashboard/internships');
        }
      } catch (err) {
        setError(err.message || 'Failed to delete internship');
      }
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      const formData = new FormData();
      
      Object.keys(applyData).forEach(key => {
        if (key !== 'resume') {
          formData.append(key, applyData[key]);
        }
      });

      if (applyData.resume) {
        formData.append('resume', applyData.resume);
      }
      formData.append('internshipId', id);
      const response = await applyForInternshipHandler(formData, setIsLoading, setError);
      if (response && response.success) {
        setShowApplyModal(false);
        fetchInternshipDetails();
      }
    } catch (err) {
      setError(err.message || 'Failed to apply for internship');
    }
  };

  const handleWithdraw = async () => {
    if (window.confirm('Are you sure you want to withdraw your application?')) {
      try {
        setIsLoading(true);
        setError(null);
        const response = await withdrawInternshipHandler({ internshipId: id }, setIsLoading, setError);
        if (response && response.success) {
          fetchInternshipDetails();
        }
      } catch (err) {
        setError(err.message || 'Failed to withdraw application');
      }
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      const response = await updateUserStatusHandler({
        internshipId: id,
        userId: selectedApplicant.id,
        status: statusData.status,
        feedback: statusData.feedback
      }, setIsLoading, setError);
      
      if (response && response.success) {
        setShowStatusModal(false);
        fetchInternshipDetails();
      }
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  const handleImageClick = (images, index) => {
    setSelectedImagePopup(images);
    setCurrentImageIndex(index);
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleClosePopup = (e) => {
    if (e.target === imagePopupRef.current || e.target.closest('.image-popup-close')) {
      setSelectedImagePopup(null);
      setImageZoom(1);
      setImagePosition({ x: 0, y: 0 });
      setCurrentImageIndex(0);
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? internship.imagesUrl.length - 1 : prev - 1
    );
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === internship.imagesUrl.length - 1 ? 0 : prev + 1
    );
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setImageZoom(prev => Math.max(prev - 0.25, 0.5));
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
    if (autoSlide && internship?.imagesUrl?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => 
          prev === internship.imagesUrl.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      setSliderInterval(interval);
      return () => clearInterval(interval);
    }
  }, [autoSlide, internship?.imagesUrl]);

  const toggleAutoSlide = () => {
    setAutoSlide(prev => !prev);
  };

  if (isLoading) {
    return (
      <div className="internship-details-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="internship-details-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchInternshipDetails}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="internship-details-container">
        <div className="error-message">
          <p>Internship not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="internship-details-container">
      {/* Header Section */}
      <div className="internship-header">
        <div className="header-content">
          <h1>{internship?.title || 'Loading...'}</h1>
          <p className="company-name">{internship?.companyName || ''}</p>
        </div>
        <div className="header-actions">
          {internship?.isUserCreated ? (
            <>
              <button 
                className="edit-button"
                onClick={handleEditClick}
              >
                Edit Internship
              </button>
              <button 
                className="delete-button"
                onClick={handleDeleteInternship}
              >
                Delete Internship
              </button>
            </>
          ) : internship?.isApplied ? (
            <>
              <button 
                className="status-button"
                onClick={() => setShowStatusModal(true)}
              >
                View Application Status
              </button>
              <button 
                className="withdraw-button"
                onClick={handleWithdraw}
              >
                Withdraw Application
              </button>
            </>
          ) : (
            <button 
              className="apply-button"
              onClick={() => setShowApplyModal(true)}
            >
              Apply Now
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="internship-content">
        <div className="internship-images">
          <div className="image-slider">
            {(internship?.imagesUrl || []).map((image, index) => (
              <div 
                key={index}
                className={`slider-image ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => handleImageClick(internship.imagesUrl, index)}
              >
                <img 
                  src={`${process.env.REACT_APP_REMOTE_ADDRESS}/${image}`} 
                  alt={`Internship ${index + 1}`}
                />
              </div>
            ))}
            {(internship?.imagesUrl || []).length > 1 && (
              <>
                <button className="slider-nav prev" onClick={handlePrevImage}>
                  &lt;
                </button>
                <button className="slider-nav next" onClick={handleNextImage}>
                  &gt;
                </button>
                <div className="slider-controls">
                  <button 
                    className={`auto-slide-toggle ${autoSlide ? 'active' : ''}`}
                    onClick={toggleAutoSlide}
                  >
                    {autoSlide ? '⏸️' : '▶️'}
                  </button>
                  <div className="slider-dots">
                    {(internship?.imagesUrl || []).map((_, index) => (
                      <button
                        key={index}
                        className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="internship-info">
          <div className="info-section">
            <h2>About the Role</h2>
            <div 
              className="description"
              dangerouslySetInnerHTML={{ __html: internship.description }}
            />
          </div>

          <div className="info-section">
            <h2>Responsibilities</h2>
            <ul>
              {(internship?.responsibilities || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="info-section">
            <h2>Requirements</h2>
            <ul>
              {(internship?.requirements || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="info-section">
            <h2>Perks & Benefits</h2>
            <ul>
              {(internship?.perksOrBenefits || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="info-section">
            <h2>Other Details</h2>
            <div 
              className="other-details"
              dangerouslySetInnerHTML={{ __html: internship.otherDetails }}
            />
          </div>

          <div className="info-grid">
            <div className="info-item">
              <span className="label">Location:</span>
              <span className="value">{internship.location}</span>
            </div>
            <div className="info-item">
              <span className="label">Job Type:</span>
              <span className="value">{internship.jobType}</span>
            </div>
            <div className="info-item">
              <span className="label">Salary:</span>
              <span className="value">{internship.salary}</span>
            </div>
            <div className="info-item">
              <span className="label">Duration:</span>
              <span className="value">{internship.duration}</span>
            </div>
            <div className="info-item">
              <span className="label">Category:</span>
              <span className="value">{internship.category}</span>
            </div>
            <div className="info-item">
              <span className="label">Experience Level:</span>
              <span className="value">{internship.experienceLevel}</span>
            </div>
            <div className="info-item">
              <span className="label">Deadline:</span>
              <span className="value">{new Date(internship.deadline).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="info-section">
            <h2>Required Skills</h2>
            <div className="skills-list">
              {(internship?.skills || []).map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Internship</h2>
              <button 
                className="close-button"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
            <form onSubmit={handleUpdateInternship}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  placeholder="Enter internship title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  value={editData.companyName}
                  onChange={(e) => setEditData({ ...editData, companyName: e.target.value })}
                  placeholder="Enter company name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <ReactQuill
                  value={editData.description}
                  onChange={(value) => setEditData({ ...editData, description: value })}
                  modules={modules}
                  formats={formats}
                  placeholder="Enter internship description"
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={editData.role}
                  onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                  placeholder="Enter role"
                  required
                />
              </div>
              <div className="form-group">
                <label>Responsibilities</label>
                <div className="array-input-container">
                  <div className="array-input-field">
                    <input
                      type="text"
                      value={tempInput.responsibility}
                      onChange={(e) => setTempInput({ ...tempInput, responsibility: e.target.value })}
                      onKeyPress={(e) => handleKeyPress(e, 'responsibilities')}
                      placeholder="Add responsibility and press Enter"
                    />
                    <button 
                      type="button" 
                      className="add-item-button"
                      onClick={() => handleAddItem('responsibilities')}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                  <div className="array-items-list">
                    {(editData?.responsibilities || []).map((item, index) => (
                      <div key={index} className="array-item">
                        <span>{item}</span>
                        <button 
                          type="button"
                          className="remove-item-button"
                          onClick={() => handleRemoveItem('responsibilities', index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Requirements</label>
                <div className="array-input-container">
                  <div className="array-input-field">
                    <input
                      type="text"
                      value={tempInput.requirement}
                      onChange={(e) => setTempInput({ ...tempInput, requirement: e.target.value })}
                      onKeyPress={(e) => handleKeyPress(e, 'requirements')}
                      placeholder="Add requirement and press Enter"
                    />
                    <button 
                      type="button" 
                      className="add-item-button"
                      onClick={() => handleAddItem('requirements')}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                  <div className="array-items-list">
                    {(editData?.requirements || []).map((item, index) => (
                      <div key={index} className="array-item">
                        <span>{item}</span>
                        <button 
                          type="button"
                          className="remove-item-button"
                          onClick={() => handleRemoveItem('requirements', index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Perks & Benefits</label>
                <div className="array-input-container">
                  <div className="array-input-field">
                    <input
                      type="text"
                      value={tempInput.perk}
                      onChange={(e) => setTempInput({ ...tempInput, perk: e.target.value })}
                      onKeyPress={(e) => handleKeyPress(e, 'perksOrBenefits')}
                      placeholder="Add perk/benefit and press Enter"
                    />
                    <button 
                      type="button" 
                      className="add-item-button"
                      onClick={() => handleAddItem('perksOrBenefits')}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                  <div className="array-items-list">
                    {(editData?.perksOrBenefits || []).map((item, index) => (
                      <div key={index} className="array-item">
                        <span>{item}</span>
                        <button 
                          type="button"
                          className="remove-item-button"
                          onClick={() => handleRemoveItem('perksOrBenefits', index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Other Details</label>
                <ReactQuill
                  value={editData.otherDetails}
                  onChange={(value) => setEditData({ ...editData, otherDetails: value })}
                  modules={modules}
                  formats={formats}
                  placeholder="Enter other details"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    placeholder="Enter location"
                  />
                </div>
                <div className="form-group">
                  <label>Job Type</label>
                  <select
                    value={editData.jobType}
                    onChange={(e) => setEditData({ ...editData, jobType: e.target.value })}
                  >
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Salary</label>
                  <input
                    type="text"
                    value={editData.salary}
                    onChange={(e) => setEditData({ ...editData, salary: e.target.value })}
                    placeholder="Enter salary"
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={editData.duration}
                    onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
                    placeholder="Enter duration"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={editData.category}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Experience Level</label>
                  <select
                    value={editData.experienceLevel}
                    onChange={(e) => setEditData({ ...editData, experienceLevel: e.target.value })}
                  >
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  value={editData.deadline ? new Date(editData.deadline).toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Skills</label>
                <div className="array-input-container">
                  <div className="array-input-field">
                    <input
                      type="text"
                      value={tempInput.skill}
                      onChange={(e) => setTempInput({ ...tempInput, skill: e.target.value })}
                      onKeyPress={(e) => handleKeyPress(e, 'skills')}
                      placeholder="Add skill and press Enter"
                    />
                    <button 
                      type="button" 
                      className="add-item-button"
                      onClick={() => handleAddItem('skills')}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                  <div className="array-items-list">
                    {(editData?.skills || []).map((item, index) => (
                      <div key={index} className="array-item">
                        <span>{item}</span>
                        <button 
                          type="button"
                          className="remove-item-button"
                          onClick={() => handleRemoveItem('skills', index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Images</label>
                <div className="image-upload-container">
                  {/* Existing Images */}
                  {(editData?.existingImages || []).map((image, index) => (
                    <div key={`existing-${index}`} className="image-preview">
                      <img 
                        src={`${process.env.REACT_APP_REMOTE_ADDRESS}/${image}`} 
                        alt={`Existing ${index + 1}`} 
                      />
                      <button 
                        type="button" 
                        onClick={() => removeImage(index, true)}
                        className="remove-image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {/* New Images */}
                  {(editData?.newImages || []).map((image, index) => (
                    <div key={`new-${index}`} className="image-preview">
                      <img src={URL.createObjectURL(image)} alt={`New ${index + 1}`} />
                      <button 
                        type="button" 
                        onClick={() => removeImage(index, false)}
                        className="remove-image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <label className="image-upload-button">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      multiple
                      style={{ display: 'none' }}
                    />
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                    </svg>
                    <span>Upload Images</span>
                  </label>
                </div>
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="update-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Internship'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Apply for Internship</h2>
            <form onSubmit={handleApply}>
              <div className="form-group">
                <label>Notice Period</label>
                <input
                  type="text"
                  value={applyData.noticePeriod}
                  onChange={(e) => setApplyData({ ...applyData, noticePeriod: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Current Salary</label>
                <input
                  type="text"
                  value={applyData.currentSalary}
                  onChange={(e) => setApplyData({ ...applyData, currentSalary: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Expected Salary</label>
                <input
                  type="text"
                  value={applyData.expectedSalary}
                  onChange={(e) => setApplyData({ ...applyData, expectedSalary: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Availability</label>
                <input
                  type="text"
                  value={applyData.availability}
                  onChange={(e) => setApplyData({ ...applyData, availability: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Cover Letter</label>
                <textarea
                  value={applyData.coverLetter}
                  onChange={(e) => setApplyData({ ...applyData, coverLetter: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Resume</label>
                <input
                  type="file"
                  onChange={(e) => setApplyData({ ...applyData, resume: e.target.files[0] })}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowApplyModal(false)}>Cancel</button>
                <button type="submit">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Update Application Status</h2>
            <form onSubmit={handleUpdateStatus}>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={statusData.status}
                  onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>
              </div>
              <div className="form-group">
                <label>Feedback</label>
                <textarea
                  value={statusData.feedback}
                  onChange={(e) => setStatusData({ ...statusData, feedback: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowStatusModal(false)}>Cancel</button>
                <button type="submit">Update Status</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedImagePopup && (
        <div 
          className="image-popup" 
          ref={imagePopupRef}
          onClick={handleClosePopup}
        >
          <div className="image-popup-content">
            <button className="image-popup-close">×</button>
            <button 
              className="image-popup-nav prev"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
            >
              ←
            </button>
            <button 
              className="image-popup-nav next"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
            >
              →
            </button>
            <div className="image-popup-counter">
              {currentImageIndex + 1} / {selectedImagePopup.length}
            </div>
            <img
              src={`${process.env.REACT_APP_REMOTE_ADDRESS}/${selectedImagePopup[currentImageIndex]}`}
              alt="Full size"
              style={{
                transform: `scale(${imageZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                cursor: imageZoom > 1 ? 'move' : 'default'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            <div className="image-popup-zoom-controls">
              <button onClick={handleZoomIn}>+</button>
              <button onClick={handleZoomOut}>-</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


