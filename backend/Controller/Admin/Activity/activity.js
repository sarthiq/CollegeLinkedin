

const AdminActivity = require("../../../Models/User/adminActivity");
const Admin  = require("../../../Models/User/admins");
const { Op } = require("sequelize");


exports.getAdminActivity = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            adminName,
            activityType,
            activityDescription,
            ipAddress,
            userAgent,
            location,
            deviceType,
            fromDate,
            toDate
        } = req.body;

        // Build filter conditions
        const whereClause = {};
        
        if (activityType) whereClause.activityType = { [Op.like]: `%${activityType}%` };
        if (activityDescription) whereClause.activityDescription = { [Op.like]: `%${activityDescription}%` };
        if (ipAddress) whereClause.ipAddress = { [Op.like]: `%${ipAddress}%` };
        if (userAgent) whereClause.userAgent = { [Op.like]: `%${userAgent}%` };
        if (location) whereClause.location = { [Op.like]: `%${location}%` };
        if (deviceType) whereClause.deviceType = { [Op.like]: `%${deviceType}%` };

        // Date range filter
        if (fromDate && toDate) {
            whereClause.createdAt = {
                [Op.between]: [new Date(fromDate), new Date(toDate)]
            };
        }

        // Admin name filter
        const adminWhereClause = {};
        if (adminName) {
            adminWhereClause.name = { [Op.like]: `%${adminName}%` };
        }

        // Calculate offset for pagination
        const offset = (page - 1) * limit;

        const { count, rows } = await AdminActivity.findAndCountAll({
            where: whereClause,
            include: [{
                model: Admin,
                attributes: ['name', 'userName'],
                where: adminWhereClause
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            data: {
                activities: rows,
                pagination: {
                    totalItems: count,
                    totalPages: Math.ceil(count / limit),
                    currentPage: parseInt(page),
                    itemsPerPage: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Error in getAdminActivity:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
