const Internship = require("../../../Models/Basic/internship");
const AppliedInternship = require("../../../Models/Basic/appliedInternship");
const User = require("../../../Models/User/users");
const { saveFile, safeDeleteFile } = require("../../../Utils/fileHandler");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../../../importantInfo");
const { baseDir } = require("../../../importantInfo");
const { Op } = require("sequelize");
const UserProfile = require("../../../Models/User/userProfile");

//Internship related controllers
exports.createInternship = async (req, res) => {
  let transaction;
  try {
    const {
      title,
      companyName,
      description,
      role,
      responsibilities,
      requirements,
      perksOrBenefits,
      otherDetails,
      location,
      jobType,
      remote,
      salary,
      duration,
      skills,
      deadline,
      status,
      category,
      experienceLevel,
    } = req.body;
    const userId = req.user.id;

    if (!title || !companyName || !description || !role) {
      return res.status(400).json({
        success: false,
        message: "Title, Company Name, Description and Role are required",
      });
    }

    const parsedInternshipData = {
      title,
      companyName,
      description,
      role,
      responsibilities,
      requirements,
      perksOrBenefits,
      otherDetails,
      location,
      jobType,
      remote,
      salary,
      duration,
      skills,
      deadline,
      status,
      category,
      experienceLevel,
    };
    // Handle multiple images
    const imagesUrl = [];
    if (req.files && req.files.image && req.files.image.length > 0) {
      for (const imageFile of req.files.image) {
        try {
          const filePath = path.join("CustomFiles", "Internships");
          const fileName = uuidv4();
          const imageUrl = saveFile(imageFile, filePath, fileName);
          if (imageUrl) {
            imagesUrl.push(imageUrl);
          }
        } catch (fileError) {
          console.error("Error processing image file:", fileError);
          // Continue processing other files even if one fails
          continue;
        }
      }
    }
    parsedInternshipData.imagesUrl = imagesUrl;

    transaction = await sequelize.transaction();

    const internshipDataToCreate = {
      ...parsedInternshipData,
      status: "active",
      UserId: userId,
    };

    const newInternship = await Internship.create(internshipDataToCreate, {
      transaction,
    });
    await transaction.commit();

    res.status(201).json({
      success: true,
      data: newInternship,
      message: "Internship created successfully",
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error creating internship:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to create internship",
    });
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
      search,
      userCreated = false,
    } = req.body;
    const userId = req.user.id;

    const offset = (page - 1) * limit;

    // Build where condition
    const whereCondition = {};

    if (category) whereCondition.category = category;
    if (jobType) whereCondition.jobType = jobType;
    if (location) whereCondition.location = location;
    if (experienceLevel) whereCondition.experienceLevel = experienceLevel;
    if (remote !== undefined) whereCondition.remote = remote;
    if (search) {
      whereCondition[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { companyName: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }
    if (userCreated) whereCondition.UserId = userId;

    const { count, rows: internships } = await Internship.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["name", "email"],
          include: [
            {
              model: UserProfile,
              attributes: ["profileUrl"],
            },
          ],
        },
      ],
    });

    // Get all internship IDs
    const internshipIds = internships.map((internship) => internship.id);

    // Find all applied internships for the current user
    const appliedInternships = await AppliedInternship.findAll({
      where: {
        UserId: userId,
        InternshipId: internshipIds,
      },
      attributes: ["InternshipId", "status"],
    });

    // Create a map of applied internships for quick lookup
    const appliedInternshipMap = {};
    appliedInternships.forEach((applied) => {
      appliedInternshipMap[applied.InternshipId] = applied.status;
    });

    // Transform the data to include isApplied flag
    const transformedInternships = internships.map((internship) => {
      const jsonData = internship.toJSON();
      jsonData.isUserCreated = jsonData.UserId === req.user.id;
      jsonData.isApplied = appliedInternshipMap[jsonData.id] !== undefined;
      jsonData.applicationStatus = appliedInternshipMap[jsonData.id] || null;
      return jsonData;
    });

    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: {
        internships: transformedInternships,
        pagination: {
          total: count,
          totalPages,
          currentPage: parseInt(page),
          limit: parseInt(limit),
          hasNextPage,
          hasPrevPage,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getInternshipById = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Internship ID is required",
      });
    }

    const internship = await Internship.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["name", "email"],
          include: [
            {
              model: UserProfile,
              attributes: ["profileUrl"],
            },
          ],
        },
      ],
    });

    if (!internship) {
      return res
        .status(404)
        .json({ success: false, message: "Internship not found" });
    }

    const jsonData = internship.toJSON();

    // Only check application status and user-specific data if user is authenticated
    if (req.user && req.user.id) {
      // Check if user has applied to this internship
      const appliedInternship = await AppliedInternship.findOne({
        where: {
          UserId: req.user.id,
          InternshipId: id,
        },
      });

      jsonData.isUserCreated = jsonData.UserId === req.user.id;
      jsonData.isApplied = appliedInternship !== null;
      jsonData.applicationInfo = appliedInternship || null;
    } else {
      jsonData.isUserCreated = false;
      jsonData.isApplied = false;
      jsonData.applicationInfo = null;
    }

    // First find all applied internships for this internship
    const allAppliedInternships = await AppliedInternship.findAll({
      where: { InternshipId: id },
    });

    // Get all user IDs from applied internships
    const userIds = allAppliedInternships.map((app) => app.UserId);

    // Fetch user information for all applicants
    const applicants = await User.findAll({
      where: { id: userIds },
      attributes: ["id", "name", "email"],
      include: [
        {
          model: UserProfile,
          attributes: ["profileUrl"],
        },
      ],
    });

    // Create a map of user information
    const userMap = {};
    applicants.forEach((user) => {
      userMap[user.id] = user.toJSON();
    });

    // Add applicants information
    jsonData.applicants = allAppliedInternships.map((app) => ({
      ...userMap[app.UserId],
      application: app,
    }));

    res.status(200).json({ success: true, data: jsonData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateInternship = async (req, res) => {
  try {
    const {
      id,
      title,
      companyName,
      description,
      role,
      responsibilities,
      requirements,
      perksOrBenefits,
      otherDetails,
      location,
      jobType,
      remote,
      salary,
      duration,
      skills,
      deadline,
      status,
      category,
      experienceLevel,
    } = req.body;
    const userId = req.user.id;
    const imageFiles = req.files && req.files.image ? req.files.image : [];
    const existingImages = req.body.existingImages || [];

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Internship ID is required",
      });
    }

    const internship = await Internship.findOne({
      where: { id: id, UserId: userId },
    });
    if (!internship) {
      return res
        .status(404)
        .json({ success: false, message: "Internship not found" });
    }

    // Check if the user is the owner of the internship
    if (internship.UserId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this internship",
      });
    }

    let currentInternshipData = internship.toJSON();

    // Handle image updates
    // Process existing images to get the correct path after 'files/'
    const processedExistingImages = existingImages.map((url) => {
      const parts = url.split("files/");
      return parts.length > 1 ? "files/" + parts[1] : url;
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
          const oldImagePath = path.join(
            baseDir,
            oldImageUrl.replace("files/", "")
          );
          await safeDeleteFile(oldImagePath);
        }
      }
    }

    // Prepare the update data
    const updateData = {
      title,
      companyName,
      description,
      role,
      responsibilities,
      requirements,
      perksOrBenefits,
      otherDetails,
      location,
      jobType,
      remote,
      salary,
      duration,
      skills,
      deadline,
      status,
      category,
      experienceLevel,
      imagesUrl,
    };

    await internship.update(updateData);

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
    const internship = await Internship.findOne({
      where: { id: id, UserId: userId },
    });

    if (!internship) {
      return res
        .status(404)
        .json({ success: false, message: "Internship not found" });
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

    res
      .status(200)
      .json({ success: true, message: "Internship deleted successfully" });
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
    const {
      internshipId,
      noticePeriod,
      currentSalary,
      expectedSalary,
      availability,
      coverLetter,
    } = req.body;
    const userId = req.user.id;

    if (
      !internshipId ||
      !noticePeriod ||
      !currentSalary ||
      !expectedSalary ||
      !availability ||
      !coverLetter
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const resumeFile =
      req.files && req.files.resume ? req.files.resume[0] : null;
    // Check if internship exists
    const internship = await Internship.findByPk(internshipId);
    if (!internship) {
      return res
        .status(404)
        .json({ success: false, message: "Internship not found" });
    }

    if (internship.UserId === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot apply to your own internship",
      });
    }

    // Check if internship is active
    if (internship.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "This internship is not currently accepting applications",
      });
    }

    // Check if user has already applied
    const existingApplication = await AppliedInternship.findOne({
      where: {
        UserId: userId,
        InternshipId: internshipId,
      },
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this internship",
      });
    }

    transaction = await sequelize.transaction();

    // Handle resume file if provided
    let resumeUrl = null;
    if (resumeFile) {
      const filePath = path.join("CustomFiles", "Resumes");
      const fileName = uuidv4();
      resumeUrl = saveFile(resumeFile, filePath, fileName);
    }

    const application = await AppliedInternship.create(
      {
        noticePeriod,
        currentSalary,
        expectedSalary,
        availability,
        coverLetter,
        resumeUrl,
        UserId: userId,
        InternshipId: internshipId,
        status: "pending",
        appliedAt: new Date(),
      },
      { transaction }
    );

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
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.body;
    const offset = (page - 1) * limit;

    const whereCondition = { userId };
    if (status) {
      whereCondition.status = status;
    }

    const { count, rows: applications } =
      await AppliedInternship.findAndCountAll({
        where: whereCondition,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["appliedAt", "DESC"]],
      });

    // Get all internship IDs from applications
    const internshipIds = applications.map((app) => app.internshipId);

    // Fetch all associated internships in a single query
    const internships = await Internship.findAll({
      where: {
        id: internshipIds,
      },
      attributes: [
        "id",
        "title",
        "companyName",
        "description",
        "location",
        "jobType",
        "status",
      ],
    });

    // Create a map of internship data for quick lookup
    const internshipMap = {};
    internships.forEach((internship) => {
      internshipMap[internship.id] = internship;
    });

    // Merge the data
    const mergedData = applications.map((application) => ({
      ...application.toJSON(),
      internship: internshipMap[application.internshipId] || null,
    }));

    return res.status(200).json({
      success: true,
      data: {
        applications: mergedData,
        total: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching applied internships:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applied internships",
      error: error.message,
    });
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
        InternshipId: internshipId,
      },
    });

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    // Check if application can be withdrawn
    if (application.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          "Cannot withdraw application as it's no longer in pending status",
      });
    }

    transaction = await sequelize.transaction();

    // Delete resume file if exists
    if (application.resumeUrl) {
      const resumePath = path.join(
        baseDir,
        application.resumeUrl.replace("files/", "")
      );
      await safeDeleteFile(resumePath);
    }

    await application.destroy({ transaction });
    await transaction.commit();

    res
      .status(200)
      .json({ success: true, message: "Application withdrawn successfully" });
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

    if (!internshipId || !userId || !status) {
      return res.status(400).json({
        success: false,
        message: "Internship ID, User ID and Status are required",
      });
    }

    // Check if the user is authorized to update status
    const internship = await Internship.findByPk(internshipId);
    if (!internship || internship.UserId !== adminId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this application status",
      });
    }

    const application = await AppliedInternship.findOne({
      where: {
        UserId: userId,
        InternshipId: internshipId,
      },
    });

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    transaction = await sequelize.transaction();

    await application.update(
      {
        status,
        feedback: feedback || null,
      },
      { transaction }
    );

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
