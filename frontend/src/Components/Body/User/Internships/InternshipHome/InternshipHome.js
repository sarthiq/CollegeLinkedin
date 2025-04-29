import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllInternshipsHandler, createInternshipHandler } from '../internshipsApiHandler';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './InternshipHome.css';

const capitalize = (text) => {
  if (!text) return '';
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const InternshipHome = () => {
  const navigate = useNavigate();
  const [showCreateInternship, setShowCreateInternship] = useState(false);
  const [showUserInternships, setShowUserInternships] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createInternshipError, setCreateInternshipError] = useState(null);
  const [internships, setInternships] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });

  const [newInternship, setNewInternship] = useState({
    title: '',
    companyName: '',
    description: '',
    role: '',
    responsibilities: [],
    requirements: [],
    perksOrBenefits: [],
    otherDetails: '',
    location: '',
    jobType: 'Full-time',
    remote: false,
    salary: '',
    duration: '',
    skills: [],
    deadline: '',
    status: 'active',
    category: 'Technology',
    experienceLevel: 'Entry Level',
    images: []
  });

  const [tempInput, setTempInput] = useState({
    responsibility: '',
    requirement: '',
    perk: '',
    skill: ''
  });

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance'];
  const categories = ['Technology', 'Business', 'Design', 'Marketing', 'Other'];
  const experienceLevels = ['Entry Level', 'Intermediate', 'Expert'];

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
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

  useEffect(() => {
    fetchInternships();
  }, [showUserInternships, pagination.currentPage]);

  const fetchInternships = async () => {
   
    
      setError(null);
      const response = await getAllInternshipsHandler(
        { 
          page: pagination.currentPage, 
          limit: pagination.limit, 
          userCreated: showUserInternships 
        }, 
        setIsLoading, 
        (error) => setError(error)
      );
      
      if (response && response.success) {
        const { internships, pagination: paginationData } = response.data;
        setInternships(internships);
        setPagination(paginationData);
      }
   
      
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNewInternship(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));
    }
  };

  const removeImage = (index) => {
    setNewInternship(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddItem = (field) => {
    const inputField = field === 'responsibilities' ? 'responsibility' :
                      field === 'requirements' ? 'requirement' :
                      field === 'perksOrBenefits' ? 'perk' :
                      'skill';

    if (tempInput[inputField] && tempInput[inputField].trim() !== '') {
      setNewInternship(prev => ({
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
    setNewInternship(prev => ({
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

  const handleCreateInternship = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setCreateInternshipError(null);

    const formData = new FormData();
    
    // Append all fields except images
    Object.keys(newInternship).forEach(key => {
      if (key !== 'images') {
        if (Array.isArray(newInternship[key])) {
          // For array fields, append each item separately
          newInternship[key].forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, newInternship[key]);
        }
      }
    });

    // Append images
    newInternship.images.forEach((image, index) => {
      formData.append('image', image);
    });

    const response = await createInternshipHandler(
      formData,
      setIsLoading,
      (error) => setCreateInternshipError(error)
    );

    if (response && response.success) {
      // Reset form and close modal
      setNewInternship({
        title: '',
        companyName: '',
        description: '',
        role: '',
        responsibilities: [],
        requirements: [],
        perksOrBenefits: [],
        otherDetails: '',
        location: '',
        jobType: 'Full-time',
        remote: false,
        salary: '',
        duration: '',
        skills: [],
        deadline: '',
        status: 'active',
        category: 'Technology',
        experienceLevel: 'Entry Level',
        images: []
      });
      setTempInput({
        responsibility: '',
        requirement: '',
        perk: '',
        skill: ''
      });
      setShowCreateInternship(false);
      fetchInternships(); // Refresh the list
    }
  };

  const handleViewMore = (internshipId) => {
    navigate(`/dashboard/internships/id/${internshipId}`);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  return (
    <div className="internships-container">
      <div className="internships-header">
        <div className="header-content">
          <h1><i className="fas fa-briefcase"></i> Internships</h1>
          <p className="header-description"><i className="fas fa-search"></i> Find and apply for internships</p>
        </div>
        <div className="header-actions">
          <div className="internship-filter">
            <button 
              className={`filter-button ${!showUserInternships ? 'active' : ''}`}
              onClick={() => setShowUserInternships(false)}
            >
              <i className="fas fa-globe"></i> All Internships
            </button>
            <button 
              className={`filter-button ${showUserInternships ? 'active' : ''}`}
              onClick={() => setShowUserInternships(true)}
            >
              <i className="fas fa-user"></i> My Internships
            </button>
          </div>
          <button 
            className="create-internship-button"
            onClick={() => setShowCreateInternship(true)}
          >
            <i className="fas fa-plus"></i> Create Internship
          </button>
        </div>
      </div>

      {error && !showCreateInternship && (
        <div className="internships-error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <button onClick={fetchInternships}>
            <i className="fas fa-sync-alt"></i> Try Again
          </button>
        </div>
      )}

      {showCreateInternship && (
        <div className="create-internship-modal">
          <div className="create-internship-content">
            <div className="modal-header">
              <h2><i className="fas fa-plus-circle"></i> Create New Internship</h2>
              <button 
                className="close-button"
                onClick={() => {
                  setShowCreateInternship(false);
                  setCreateInternshipError(null);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            {createInternshipError && (
              <div className="create-internship-error">
                <p>{createInternshipError}</p>
              </div>
            )}
            <form onSubmit={handleCreateInternship}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newInternship.title}
                  onChange={(e) => setNewInternship({ ...newInternship, title: e.target.value })}
                  placeholder="Enter internship title"
                  required
                  className={createInternshipError ? 'error-input' : ''}
                />
              </div>
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  value={newInternship.companyName}
                  onChange={(e) => setNewInternship({ ...newInternship, companyName: e.target.value })}
                  placeholder="Enter company name"
                  required
                  className={createInternshipError ? 'error-input' : ''}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <ReactQuill
                  value={newInternship.description}
                  onChange={(value) => setNewInternship({ ...newInternship, description: value })}
                  modules={modules}
                  formats={formats}
                  placeholder="Enter internship description"
                  className={createInternshipError ? 'error-input' : ''}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={newInternship.role}
                  onChange={(e) => setNewInternship({ ...newInternship, role: e.target.value })}
                  placeholder="Enter role"
                  required
                  className={createInternshipError ? 'error-input' : ''}
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
                      className={createInternshipError ? 'error-input' : ''}
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
                    {newInternship.responsibilities.map((item, index) => (
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
                      className={createInternshipError ? 'error-input' : ''}
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
                    {newInternship.requirements.map((item, index) => (
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
                      className={createInternshipError ? 'error-input' : ''}
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
                    {newInternship.perksOrBenefits.map((item, index) => (
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
                  value={newInternship.otherDetails}
                  onChange={(value) => setNewInternship({ ...newInternship, otherDetails: value })}
                  modules={modules}
                  formats={formats}
                  placeholder="Enter other details"
                  className={createInternshipError ? 'error-input' : ''}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={newInternship.location}
                    onChange={(e) => setNewInternship({ ...newInternship, location: e.target.value })}
                    placeholder="Enter location"
                    className={createInternshipError ? 'error-input' : ''}
                  />
                </div>
                <div className="form-group">
                  <label>Job Type</label>
                  <select
                    value={newInternship.jobType}
                    onChange={(e) => setNewInternship({ ...newInternship, jobType: e.target.value })}
                    className={createInternshipError ? 'error-input' : ''}
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
                    value={newInternship.salary}
                    onChange={(e) => setNewInternship({ ...newInternship, salary: e.target.value })}
                    placeholder="Enter salary"
                    className={createInternshipError ? 'error-input' : ''}
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={newInternship.duration}
                    onChange={(e) => setNewInternship({ ...newInternship, duration: e.target.value })}
                    placeholder="Enter duration"
                    className={createInternshipError ? 'error-input' : ''}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newInternship.category}
                    onChange={(e) => setNewInternship({ ...newInternship, category: e.target.value })}
                    className={createInternshipError ? 'error-input' : ''}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Experience Level</label>
                  <select
                    value={newInternship.experienceLevel}
                    onChange={(e) => setNewInternship({ ...newInternship, experienceLevel: e.target.value })}
                    className={createInternshipError ? 'error-input' : ''}
                  >
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
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
                      className={createInternshipError ? 'error-input' : ''}
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
                    {newInternship.skills.map((item, index) => (
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
                <label>Deadline</label>
                <input
                  type="date"
                  value={newInternship.deadline}
                  onChange={(e) => setNewInternship({ ...newInternship, deadline: e.target.value })}
                  className={createInternshipError ? 'error-input' : ''}
                />
              </div>
              <div className="form-group">
                <label>Images</label>
                <div className="image-upload-container">
                  {newInternship.images.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} />
                      <button 
                        type="button" 
                        onClick={() => removeImage(index)}
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
                  onClick={() => setShowCreateInternship(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="create-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Internship'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading && internships.length === 0 ? (
        <div className="internships-loading-container">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading internships...</p>
        </div>
      ) : (
        <>
          <div className="internship-cards-grid">
            {internships.map(internship => (
              <div key={internship.id} className="internship-card">
                <div className="internship-card-image-container">
                  <img 
                    src={internship.imagesUrl && internship.imagesUrl[0] 
                      ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${internship.imagesUrl[0]}` 
                      : 'https://placehold.co/300x200'} 
                    alt={internship.title}
                    className="internship-card-image"
                  />
                  {internship.category && (
                    <span className="internship-card-category">
                      <i className="fas fa-tag"></i> {internship.category}
                    </span>
                  )}
                  {internship.isUserCreated && (
                    <div className="internship-card-created-badge">
                      <i className="fas fa-user-edit"></i>
                      <span>Created by you</span>
                    </div>
                  )}
                </div>
                <div className="internship-card-content">
                  <h3 className="internship-card-title">{capitalize(internship.title)}</h3>
                  <div className="internship-card-info-row">
                    <span className="internship-card-label"><i className="fas fa-building"></i> Company:</span>
                    <span className="internship-card-value">{capitalize(internship.companyName)}</span>
                  </div>
                  <div className="internship-card-info-row">
                    <span className="internship-card-label"><i className="fas fa-user-tie"></i> Role:</span>
                    <span className="internship-card-value">{capitalize(internship.role)}</span>
                  </div>
                  <div className="internship-card-info-row">
                    <span className="internship-card-label"><i className="fas fa-tools"></i> Skills:</span>
                    <div className="internship-card-skills">
                      {internship.skills && internship.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="internship-skill-tag">
                          <i className="fas fa-check"></i> {capitalize(skill)}
                        </span>
                      ))}
                      {internship.skills && internship.skills.length > 3 && (
                        <span className="internship-skill-more">
                          +{internship.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="internship-card-actions">
                  <button 
                    className="internship-card-view-button"
                    onClick={() => handleViewMore(internship.id)}
                  >
                    <i className="fas fa-eye"></i> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {pagination.totalPages > 1 && (
            <div className="internships-pagination">
              <button 
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage || isLoading}
              >
                <i className="fas fa-chevron-left"></i> Previous
              </button>
              <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
              <button 
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage || isLoading}
              >
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

