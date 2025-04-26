const Internship = require("../../../Models/Basic/internship");
const AppliedInternship = require("../../../Models/Basic/appliedInternship");
const User = require("../../../Models/User/users");
const { saveFile, safeDeleteFile } = require("../../../Utils/fileHandler");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../../../importantInfo");
const { baseDir } = require("../../../importantInfo");

//Internship related controllers
exports.createInternship = async (req, res) => {
  let transaction;
  try {
    const { internshipData } = req.body;
    const userId = req.user.id;

    let parsedInternshipData = typeof internshipData === "string" ? JSON.parse(internshipData) : internshipData;
    
    // Handle multiple images
    if (req.files) {
      const imagesUrl = [];
      for (const imageFile of req.files) {
        const filePath = path.join("CustomFiles", "Internships");
        const fileName = uuidv4();
        const imageUrl = saveFile(imageFile, filePath, fileName);
        imagesUrl.push(imageUrl);
      }
      parsedInternshipData.imagesUrl = imagesUrl;
    }

    transaction = await sequelize.transaction();

    const internshipDataToCreate = {
      ...parsedInternshipData,
      status: 'active',
      UserId: userId
    };

    const newInternship = await Internship.create(internshipDataToCreate, { transaction });
    await transaction.commit();

    res.status(201).json({ success: true, data: newInternship });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getInternships = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      jobType, 
      location, 
      experienceLevel,
      remote,
      search
    } = req.body;
    
    const offset = (page - 1) * limit;

    // Build where condition
    const whereCondition = {};
    
    if (category) whereCondition.category = category;
    if (jobType) whereCondition.jobType = jobType;
    if (location) whereCondition.location = location;
    if (experienceLevel) whereCondition.experienceLevel = experienceLevel;
    if (remote !== undefined) whereCondition.remote = remote;
    if (search) {
      whereCondition[sequelize.Op.or] = [
        { title: { [sequelize.Op.like]: `%${search}%` } },
        { companyName: { [sequelize.Op.like]: `%${search}%` } },
        { description: { [sequelize.Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: internships } = await Internship.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: {
        internships,
        pagination: {
          total: count,
          totalPages,
          currentPage: parseInt(page),
          limit: parseInt(limit),
          hasNextPage,
          hasPrevPage,
        }
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getInternshipById = async (req, res) => {
  try {
    const { id } = req.body;
    const internship = await Internship.findByPk(id);

    if (!internship) {
      return res.status(404).json({ success: false, message: "Internship not found" });
    }

    res.status(200).json({ success: true, data: internship });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateInternship = async (req, res) => {
  try {
    const { id } = req.body;
    const { internshipData } = req.body;
    const userId = req.user.id;
    const imageFiles = req.files || [];
    const existingImages = req.body.existingImages || [];

    const internship = await Internship.findByPk(id);
    if (!internship) {
      return res.status(404).json({ success: false, message: "Internship not found" });
    }

    // Check if the user is the owner of the internship
    if (internship.UserId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this internship",
      });
    }

    let parsedInternshipData = typeof internshipData === "string" ? JSON.parse(internshipData) : internshipData;
    let currentInternshipData = internship.toJSON();

    // Handle image updates
    // Process existing images to get the correct path after 'files/'
    const processedExistingImages = existingImages.map(url => {
      const parts = url.split('files/');
      return parts.length > 1 ? 'files/' + parts[1] : url;
    });

    const imagesUrl = [...processedExistingImages]; // Start with processed existing images

    // Add new images
    if (imageFiles.length > 0) {
      for (const imageFile of imageFiles) {
        const filePath = path.join("CustomFiles", "Internships");
        const fileName = uuidv4();
        const imageUrl = saveFile(imageFile, filePath, fileName);
        imagesUrl.push(imageUrl);
      }
    }

    // Delete images that are no longer in existingImages
    if (currentInternshipData.imagesUrl) {
      for (const oldImageUrl of currentInternshipData.imagesUrl) {
        if (!processedExistingImages.includes(oldImageUrl)) {
          const oldImagePath = path.join(baseDir, oldImageUrl.replace("files/", ""));
          await safeDeleteFile(oldImagePath);
        }
      }
    }

    // Update the internship data with new images
    parsedInternshipData.imagesUrl = imagesUrl;

    await internship.update(parsedInternshipData);

    res.status(200).json({ success: true, data: internship });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteInternship = async (req, res) => {
  let transaction;
  try {
    const { id } = req.body;
    const userId = req.user.id;
    const internship = await Internship.findByPk(id);

    if (!internship) {
      return res.status(404).json({ success: false, message: "Internship not found" });
    }

    // Check if the user is the owner of the internship
    if (internship.UserId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this internship",
      });
    }

    // Delete all associated images
    if (internship.imagesUrl && internship.imagesUrl.length > 0) {
      for (const imageUrl of internship.imagesUrl) {
        const imagePath = path.join(baseDir, imageUrl.replace("files/", ""));
        await safeDeleteFile(imagePath);
      }
    }

    transaction = await sequelize.transaction();
    await internship.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({ success: true, message: "Internship deleted successfully" });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};


//Applied Internship related controllers
exports.applyToInternship = async (req, res) => {
  let transaction;
  try {
    const { internshipId, applicationData } = req.body;
    const userId = req.user.id;

    // Check if internship exists
    const internship = await Internship.findByPk(internshipId);
    if (!internship) {
      return res.status(404).json({ success: false, message: "Internship not found" });
    }

    // Check if internship is active
    if (internship.status !== 'active') {
      return res.status(400).json({ success: false, message: "This internship is not currently accepting applications" });
    }

    // Check if user has already applied
    const existingApplication = await AppliedInternship.findOne({
      where: {
        UserId: userId,
        InternshipId: internshipId
      }
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, message: "You have already applied to this internship" });
    }

    transaction = await sequelize.transaction();

    let parsedApplicationData = typeof applicationData === "string" ? JSON.parse(applicationData) : applicationData;

    // Handle resume file if provided
    if (req.files && req.files.resume) {
      const filePath = path.join("CustomFiles", "Resumes");
      const fileName = uuidv4();
      const resumeUrl = saveFile(req.files.resume, filePath, fileName);
      parsedApplicationData.resumeUrl = resumeUrl;
    }

    const application = await AppliedInternship.create({
      ...parsedApplicationData,
      UserId: userId,
      InternshipId: internshipId,
      status: 'pending',
      appliedAt: new Date()
    }, { transaction });

    await transaction.commit();

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAppliedInternships = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.body;
    const userId = req.user.id;
    const offset = (page - 1) * limit;

    const whereCondition = { UserId: userId };
    if (status) whereCondition.status = status;

    const { count, rows: applications } = await AppliedInternship.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: Internship,
          attributes: ['id', 'title', 'companyName', 'description', 'location', 'jobType', 'status']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["appliedAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: {
        applications,
        pagination: {
          total: count,
          totalPages,
          currentPage: parseInt(page),
          limit: parseInt(limit),
          hasNextPage,
          hasPrevPage,
        }
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.withdrawFromInternship = async (req, res) => {
  let transaction;
  try {
    const { internshipId } = req.body;
    const userId = req.user.id;

    const application = await AppliedInternship.findOne({
      where: {
        UserId: userId,
        InternshipId: internshipId
      }
    });

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Check if application can be withdrawn
    if (application.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot withdraw application as it's no longer in pending status" 
      });
    }

    transaction = await sequelize.transaction();

    // Delete resume file if exists
    if (application.resumeUrl) {
      const resumePath = path.join(baseDir, application.resumeUrl.replace("files/", ""));
      await safeDeleteFile(resumePath);
    }

    await application.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({ success: true, message: "Application withdrawn successfully" });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateUserInternshipStatus = async (req, res) => {
  let transaction;
  try {
    const { internshipId, userId, status, feedback } = req.body;
    const adminId = req.user.id;

    // Check if the user is authorized to update status
    const internship = await Internship.findByPk(internshipId);
    if (!internship || internship.UserId !== adminId) {
      return res.status(403).json({ 
        success: false, 
        message: "You are not authorized to update this application status" 
      });
    }

    const application = await AppliedInternship.findOne({
      where: {
        UserId: userId,
        InternshipId: internshipId
      }
    });

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    transaction = await sequelize.transaction();

    await application.update({
      status,
      feedback: feedback || null
    }, { transaction });

    await transaction.commit();

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};


