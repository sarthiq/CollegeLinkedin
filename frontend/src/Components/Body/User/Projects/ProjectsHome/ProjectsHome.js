import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjectsHandler, createProjectHandler } from '../projectsApiHandler';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './ProjectsHome.css';

export const ProjectsHome = () => {
  const navigate = useNavigate();
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showUserProjects, setShowUserProjects] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createProjectError, setCreateProjectError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'ongoing',
    technologies: [],
    githubUrl: '',
    isSourceCodePublic: false,
    isPublic: false,
    images: []
  });

  const [tempInput, setTempInput] = useState({
    technology: ''
  });

  const statusOptions = ['ongoing', 'completed', 'on-hold', 'cancelled'];

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

  useEffect(() => {
    fetchProjects();
  }, [showUserProjects, pagination.currentPage]);

  const fetchProjects = async () => {
    setError(null);
    const response = await getAllProjectsHandler(
      { 
        page: pagination.currentPage, 
        limit: pagination.limit, 
        isUserProjects: showUserProjects 
      }, 
      setIsLoading, 
      (error) => setError(error)
    );
    
    if (response && response.success) {
      const { projects, pagination: paginationData } = response.data;
      setProjects(projects);
      setPagination(paginationData);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNewProject(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));
    }
  };

  const removeImage = (index) => {
    setNewProject(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddTechnology = () => {
    if (tempInput.technology && tempInput.technology.trim() !== '') {
      setNewProject(prev => ({
        ...prev,
        technologies: [...prev.technologies, tempInput.technology.trim()]
      }));
      setTempInput(prev => ({
        ...prev,
        technology: ''
      }));
    }
  };

  const handleRemoveTechnology = (index) => {
    setNewProject(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTechnology();
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setCreateProjectError(null);

    const formData = new FormData();
    
    // Append all fields except images
    Object.keys(newProject).forEach(key => {
      if (key !== 'images') {
        if (Array.isArray(newProject[key])) {
          // For array fields, append each item separately
          newProject[key].forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, newProject[key]);
        }
      }
    });

    // Append images
    newProject.images.forEach((image, index) => {
      formData.append('image', image);
    });

    const response = await createProjectHandler(
      formData,
      setIsLoading,
      (error) => setCreateProjectError(error)
    );

    if (response && response.success) {
      // Reset form and close modal
      setNewProject({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'ongoing',
        technologies: [],
        githubUrl: '',
        isSourceCodePublic: false,
        isPublic: false,
        images: []
      });
      setTempInput({
        technology: ''
      });
      setShowCreateProject(false);
      fetchProjects(); // Refresh the list
    }
  };

  const handleViewMore = (projectId) => {
    navigate(`/dashboard/projects/id/${projectId}`);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  return (
    <div className="projects-container">
      <div className="projects-header">
        <div className="projects-header-content">
          <h1>Projects</h1>
          <p className="projects-header-description">Explore and collaborate on projects</p>
        </div>
        <div className="projects-header-actions">
          <div className="projects-filter">
            <button 
              className={`projects-filter-button ${!showUserProjects ? 'projects-filter-active' : ''}`}
              onClick={() => setShowUserProjects(false)}
            >
              All Projects
            </button>
            <button 
              className={`projects-filter-button ${showUserProjects ? 'projects-filter-active' : ''}`}
              onClick={() => setShowUserProjects(true)}
            >
              My Projects
            </button>
          </div>
          <button 
            className="projects-create-button"
            onClick={() => setShowCreateProject(true)}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Create Project
          </button>
        </div>
      </div>

      {error && !showCreateProject && (
        <div className="projects-error-message">
          <p>{error}</p>
          <button onClick={fetchProjects}>Try Again</button>
        </div>
      )}

      {showCreateProject && (
        <div className="create-project-modal">
          <div className="create-project-content">
            <div className="modal-header">
              <h2>Create New Project</h2>
              <button 
                className="close-button"
                onClick={() => {
                  setShowCreateProject(false);
                  setCreateProjectError(null);
                }}
              >
                ×
              </button>
            </div>
            {createProjectError && (
              <div className="create-project-error">
                <p>{createProjectError}</p>
              </div>
            )}
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="Enter project title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <ReactQuill
                  value={newProject.description}
                  onChange={(value) => setNewProject({ ...newProject, description: value })}
                  modules={modules}
                  formats={formats}
                  placeholder="Enter project description"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={newProject.status}
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Technologies</label>
                <div className="array-input-container">
                  <div className="array-input-field">
                    <input
                      type="text"
                      value={tempInput.technology}
                      onChange={(e) => setTempInput({ ...tempInput, technology: e.target.value })}
                      onKeyPress={handleKeyPress}
                      placeholder="Add technology and press Enter"
                    />
                    <button 
                      type="button" 
                      className="add-item-button"
                      onClick={handleAddTechnology}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                  <div className="array-items-list">
                    {newProject.technologies.map((tech, index) => (
                      <div key={index} className="array-item">
                        <span>{tech}</span>
                        <button 
                          type="button"
                          className="remove-item-button"
                          onClick={() => handleRemoveTechnology(index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>GitHub URL</label>
                <input
                  type="url"
                  value={newProject.githubUrl}
                  onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                  placeholder="Enter GitHub repository URL"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={newProject.isSourceCodePublic}
                      onChange={(e) => setNewProject({ ...newProject, isSourceCodePublic: e.target.checked })}
                    />
                    Source Code Public
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={newProject.isPublic}
                      onChange={(e) => setNewProject({ ...newProject, isPublic: e.target.checked })}
                    />
                    Project Public
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Images</label>
                <div className="image-upload-container">
                  {newProject.images.map((image, index) => (
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
                  onClick={() => setShowCreateProject(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="create-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading && projects.length === 0 ? (
        <div className="projects-loading-container">
          <div className="projects-spinner"></div>
          <p>Loading projects...</p>
        </div>
      ) : (
        <>
          <div className="projects-list">
            {projects.map(project => (
              <div key={project.id} className="project-item">
                <div className="project-item-content">
                  <div className="project-item-image">
                    <img 
                      src={project.imagesUrl && project.imagesUrl[0] 
                        ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${project.imagesUrl[0]}` 
                        : 'https://placehold.co/300x200'} 
                      alt={project.title} 
                    />
                    {project.status && <span className={`project-status-badge ${project.status}`}>{project.status}</span>}
                    {project.isUserCreated && (
                      <div className="project-created-badge">
                        <i className="fas fa-user-edit"></i>
                        <span>Created by you</span>
                      </div>
                    )}
                  </div>
                  <div className="project-item-info">
                    <div className="project-header">
                      <h3 className="project-item-title">{project.title}</h3>
                      <span className="project-meta">
                        {project.User?.name} • {new Date(project.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="project-item-description">
                      <div dangerouslySetInnerHTML={{ __html: project.description }} />
                    </div>
                    <div className="project-item-stats">
                      <div className="project-stat-item">
                        <span className="project-stat-value">{project.status}</span>
                        <span className="project-stat-label">Status</span>
                      </div>
                      {project.technologies && (
                        <div className="project-technologies">
                          {project.technologies.map((tech, index) => (
                            <span key={index} className="project-tech-tag">{tech}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="project-item-actions">
                  <button 
                    className="project-view-more-button"
                    onClick={() => handleViewMore(project.id)}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {pagination.totalPages > 1 && (
            <div className="projects-pagination">
              <button 
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage || isLoading}
                className="projects-pagination-button"
              >
                Previous
              </button>
              <span className="projects-pagination-info">Page {pagination.currentPage} of {pagination.totalPages}</span>
              <button 
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage || isLoading}
                className="projects-pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

