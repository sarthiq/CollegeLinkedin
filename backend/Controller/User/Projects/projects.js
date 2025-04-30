const Projects = require("../../../Models/User/projects");
const ProjectMember = require("../../../Models/User/projectMember");
const ProjectFeedback = require("../../../Models/User/projectFeedback");
const User = require("../../../Models/User/users");
const { saveFile, safeDeleteFile } = require("../../../Utils/fileHandler");
const { sequelize } = require("../../../importantInfo");
const { baseDir } = require("../../../importantInfo");
const { Op } = require("sequelize");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const UserProfile = require("../../../Models/User/userProfile");

// Create a new project
exports.createProject = async (req, res) => {
  let transaction;
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      status,
      technologies,
      githubUrl,
      isSourceCodePublic,
      isPublic,
    } = req.body;
    const userId = req.user.id;

    if (!title || !description || !startDate) {
      return res.status(400).json({
        success: false,
        message: "Title, Description and Start Date are required",
      });
    }

    // Handle project images
    const imagesUrl = [];
    if (req.files && req.files.image && req.files.image.length > 0) {
      for (const imageFile of req.files.image) {
        const filePath = path.join("CustomFiles", "Projects");
        const fileName = uuidv4();
        const imageUrl = saveFile(imageFile, filePath, fileName);
        if (imageUrl) {
          imagesUrl.push(imageUrl);
        }
      }
    }

    transaction = await sequelize.transaction();

    const projectData = {
      title,
      description,
      startDate,
      endDate,
      status: status || "ongoing",
      technologies,
      imagesUrl,
      githubUrl,
      isSourceCodePublic: isSourceCodePublic || false,
      isPublic: isPublic || false,
      UserId: userId,
    };

    const newProject = await Projects.create(projectData, { transaction });
    await transaction.commit();

    res.status(201).json({
      success: true,
      data: newProject,
      message: "Project created successfully",
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error creating project:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to create project",
    });
  }
};

// Get all projects with filtering and pagination
exports.getProjects = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      isPublic,
      technologies,
      isUserProjects,
    } = req.body;
    const userId = req.user.id;
    const offset = (page - 1) * limit;
    const whereCondition = {};

    if (status) whereCondition.status = status;
    if (isPublic !== undefined) whereCondition.isPublic = isPublic;
    if (search) {
      whereCondition[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }
    if (technologies && technologies.length > 0) {
      whereCondition.technologies = {
        [Op.overlap]: technologies,
      };
    }
    if (isUserProjects) {
      whereCondition.UserId = userId;
    }

    const { count, rows: projects } = await Projects.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
          include: [
            {
              model: UserProfile,
              attributes: ["profileUrl"],
            },
          ],
        },
      ],
    });

    const transformedProjects = await Promise.all(projects.map(async (project) => {
      const jsonData = project.toJSON();
      jsonData.isUserCreated = jsonData.UserId === userId;

      const isProjectMember = await ProjectMember.findOne({
        where: {
          ProjectId: project.id,
          UserId: userId,
        },
      });
      jsonData.projectMember = isProjectMember;
      return jsonData;
    }));
    res.status(200).json({
      success: true,
      data: {
        projects: transformedProjects,
        pagination: {
          total: count,
          totalPages: Math.ceil(count / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get project by ID with details
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.body;
    const project = await Projects.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
          include: [
            {
              model: UserProfile,
              attributes: ["profileUrl"],
            },
          ],
        },
        {
          model: ProjectMember,
          include: [
            {
              model: User,
              attributes: ["id", "name", "email"],
              include: [
                {
                  model: UserProfile,
                  attributes: ["profileUrl"],
                },
              ],
            },
          ],
        },
        {
          model: ProjectFeedback,
          include: [
            {
              model: User,
              attributes: ["id", "name", "email"],
              include: [
                {
                  model: UserProfile,
                  attributes: ["profileUrl"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const jsonData = project.toJSON();

    // Only check user-specific data if user is authenticated
    if (req.user && req.user.id) {
      jsonData.isUserCreated = jsonData.UserId === req.user.id;

      const isProjectMember = await ProjectMember.findOne({
        where: {
          ProjectId: project.id,
          UserId: req.user.id,
        },
      });
      jsonData.projectMember = isProjectMember;
    } else {
      jsonData.isUserCreated = false;
      jsonData.projectMember = null;
    }

    // Get all project members (visible to all users)
    const projectMembers = await ProjectMember.findAll({
      where: {
        ProjectId: project.id,
      },
    });
    jsonData.projectMembers = projectMembers;

    res.status(200).json({
      success: true,
      data: jsonData,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update project details
exports.updateProject = async (req, res) => {
  let transaction;
  try {
    const {
      id,
      title,
      description,
      startDate,
      endDate,
      status,
      technologies,
      githubUrl,
      isSourceCodePublic,
      isPublic,
      existingImages,
    } = req.body;
    const userId = req.user.id;

    const project = await Projects.findOne({
      where: { id, UserId: userId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or unauthorized",
      });
    }

    transaction = await sequelize.transaction();

    // Handle image updates
    const imagesUrl = [...(existingImages || [])];
    if (req.files && req.files.image && req.files.image.length > 0) {
      for (const imageFile of req.files.image) {
        const filePath = path.join("CustomFiles", "Projects");
        const fileName = uuidv4();
        const imageUrl = saveFile(imageFile, filePath, fileName);
        if (imageUrl) {
          imagesUrl.push(imageUrl);
        }
      }
    }

    // Delete removed images
    if (project.imagesUrl) {
      for (const oldImageUrl of project.imagesUrl) {
        if (!imagesUrl.includes(oldImageUrl)) {
          const oldImagePath = path.join(
            baseDir,
            oldImageUrl.replace("files/", "")
          );
          await safeDeleteFile(oldImagePath);
        }
      }
    }

    const updateData = {
      title,
      description,
      startDate,
      endDate,
      status,
      technologies,
      imagesUrl,
      githubUrl,
      isSourceCodePublic,
      isPublic,
    };

    await project.update(updateData, { transaction });
    await transaction.commit();

    res.status(200).json({
      success: true,
      data: project,
      message: "Project updated successfully",
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error updating project:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  let transaction;
  try {
    const { id } = req.body;
    const userId = req.user.id;

    const project = await Projects.findOne({
      where: { id, UserId: userId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or unauthorized",
      });
    }

    transaction = await sequelize.transaction();

    // Delete associated images
    if (project.imagesUrl && project.imagesUrl.length > 0) {
      for (const imageUrl of project.imagesUrl) {
        const imagePath = path.join(baseDir, imageUrl.replace("files/", ""));
        await safeDeleteFile(imagePath);
      }
    }

    // Delete project and its associations
    await project.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error deleting project:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Send project collaboration invitation
exports.sendCollaborationInvitation = async (req, res) => {
  let transaction;
  try {
    const { projectId, email, role, type, description } = req.body;
    const userId = req.user.id;

    if (!projectId || !email || !role || !type || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const project = await Projects.findOne({
      where: { id: projectId, UserId: userId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or unauthorized",
      });
    }

    const invitedUser = await User.findOne({ where: { email } });
    if (!invitedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (invitedUser.id === userId) {
      return res.status(400).json({
        success: false,
        message: "Cannot invite yourself",
      });
    }

    transaction = await sequelize.transaction();

    const existingInvitation = await ProjectMember.findOne({
      where: {
        ProjectId: projectId,
        UserId: invitedUser.id,
      },
    });

    if (existingInvitation) {
      return res.status(400).json({
        success: false,
        message: "Invitation already sent to this user",
      });
    }

    const invitation = await ProjectMember.create(
      {
        ProjectId: projectId,
        UserId: invitedUser.id,
        role,
        type,
        description,
        status: "requested",
        joinDate: new Date(),
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      success: true,
      data: invitation,
      message: "Invitation sent successfully",
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error sending invitation:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


// Apply for project collaboration
exports.applyForCollaboration = async (req, res) => {
  let transaction;
  try {
    const { projectId, role, type, description } = req.body;
    const userId = req.user.id;

    if (!projectId || !role || !type || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const project = await Projects.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.UserId === userId) {
      return res.status(400).json({
        success: false,
        message: "Cannot apply to your own project",
      });
    }

    transaction = await sequelize.transaction();

    const existingApplication = await ProjectMember.findOne({
      where: {
        ProjectId: projectId,
        UserId: userId,
      },
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this project",
      });
    }

    const application = await ProjectMember.create(
      {
        ProjectId: projectId,
        UserId: userId,
        role,
        type,
        description,
        status: "pending",
        joinDate: new Date(),
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      success: true,
      data: application,
      message: "Application submitted successfully",
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error applying for collaboration:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update collaboration status (accept/reject)
exports.updateCollaborationStatus = async (req, res) => {
  let transaction;
  try {
    const { projectId, userId, status } = req.body;
    const projectOwnerId = req.user.id;

    if (!projectId || !userId || !status) {
      return res.status(400).json({
        success: false,
        message: "Project ID, User ID and Status are required",
      });
    }

    const project = await Projects.findOne({
      where: { id: projectId, UserId: projectOwnerId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or unauthorized",
      });
    }

    transaction = await sequelize.transaction();

    const collaboration = await ProjectMember.findOne({
      where: {
        ProjectId: projectId,
        UserId: userId,
      },
    });

    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: "Collaboration request not found",
      });
    }

    await collaboration.update(
      {
        status,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(200).json({
      success: true,
      data: collaboration,
      message: "Collaboration status updated successfully",
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error updating collaboration status:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Add project feedback
exports.addProjectFeedback = async (req, res) => {
  let transaction;
  try {
    const { projectId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!projectId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Project ID and Rating are required",
      });
    }

    const project = await Projects.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    transaction = await sequelize.transaction();

    const existingFeedback = await ProjectFeedback.findOne({
      where: {
        ProjectId: projectId,
        UserId: userId,
      },
    });

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: "You have already provided feedback for this project",
      });
    }

    const feedback = await ProjectFeedback.create(
      {
        ProjectId: projectId,
        UserId: userId,
        rating,
        comment,
        feedbackDate: new Date(),
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      success: true,
      data: feedback,
      message: "Feedback added successfully",
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error adding feedback:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get project feedback
exports.getProjectFeedback = async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    const feedback = await ProjectFeedback.findAll({
      where: { ProjectId: projectId },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
          include: [
            {
              model: UserProfile,
              attributes: ["profileUrl"],
            },
          ],
        },
      ],
      order: [["feedbackDate", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Withdraw collaboration request or membership
exports.withdrawCollaboration = async (req, res) => {
  let transaction;
  try {
    const { projectId } = req.body;
    const userId = req.user.id;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    const project = await Projects.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    transaction = await sequelize.transaction();

    const collaboration = await ProjectMember.findOne({
      where: {
        ProjectId: projectId,
        UserId: userId,
      },
    });

    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: "No collaboration request or membership found",
      });
    }

    if(collaboration.status !== "pending"){
      return res.status(400).json({
        success: false,
        message: "Collaboration request is not pending",
      });
    }

    // Check if the user is the project owner
    if (project.UserId === userId) {
      return res.status(400).json({
        success: false,
        message: "Project owner cannot withdraw from their own project",
      });
    }

    // Check if the collaboration is already accepted
    if (collaboration.status === "accepted") {
      return res.status(400).json({
        success: false,
        message:
          "Cannot withdraw from an accepted collaboration. Please contact the project owner.",
      });
    }

    await collaboration.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Collaboration request withdrawn successfully",
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error withdrawing collaboration:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Accept or Reject collaboration request
exports.handleCollaborationRequest = async (req, res) => {
  let transaction;
  try {
    const { projectId, userId, action } = req.body; // action can be 'accept' or 'reject'
    const currentUserId = req.user.id;

    if (!projectId || !userId || !action) {
      return res.status(400).json({
        success: false,
        message: "Project ID, User ID and Action are required",
      });
    }

    // Check if the current user is the project owner
    const project = await Projects.findOne({
      where: { id: projectId, UserId: currentUserId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or unauthorized",
      });
    }

    transaction = await sequelize.transaction();

    // Find the collaboration request
    const collaboration = await ProjectMember.findOne({
      where: {
        ProjectId: projectId,
        UserId: userId,
        status: 'requested' // Only handle requests that are in 'requested' status
      },
    });

    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: "No pending collaboration request found",
      });
    }

    // Update the status based on the action
    if (action === 'accept') {
      await collaboration.update({
        status: 'accepted',
        joinDate: new Date()
      }, { transaction });
    } else if (action === 'reject') {
      await collaboration.update({
        status: 'rejectedByUser',
        joinDate: null
      }, { transaction });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Use 'accept' or 'reject'",
      });
    }

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: `Collaboration request ${action}ed successfully`,
      data: collaboration
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error handling collaboration request:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
