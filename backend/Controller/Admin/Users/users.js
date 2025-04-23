const { sequelize } = require("../../../importantInfo")
const AdminActivity = require("../../../Models/User/adminActivity")
const Admin = require("../../../Models/User/admins")
const UserProfile = require("../../../Models/User/userProfile")
const User = require("../../../Models/User/users")
const { createAdminActivity } = require("../../../Utils/activityUtils")
const { Op } = require('sequelize')

exports.getUsers = async (req, res) => {
    try {
        const { limit = 10, page = 1, search = '', email, phone } = req.body;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } }
            ];
        }
        if (email) whereClause.email = email;
        if (phone) whereClause.phone = phone;

        const users = await User.findAndCountAll({
            where: whereClause,
            include: [{
                model: UserProfile,
               // attributes: ['collegeName', 'collegeYear', 'courseName', 'title', 'bio']
            }],
            attributes: { exclude: ['password'] },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            data: users.rows,
            pagination: {
                total: users.count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(users.count / limit)
            }
        });
    } catch (error) {
        console.error('Error in getUsers:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

exports.getUsersStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const [totalUsers, todayUsers, monthUsers] = await Promise.all([
            User.count(),
            User.count({
                where: {
                    createdAt: {
                        [Op.gte]: today
                    }
                }
            }),
            User.count({
                where: {
                    createdAt: {
                        [Op.gte]: oneMonthAgo
                    }
                }
            })
        ]);

        return res.status(200).json({
            success: true,
            data: {
                totalUsers,
                todayUsers,
                monthUsers
            }
        });
    } catch (error) {
        console.error('Error in getUsersStats:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.body;

        const user = await User.findOne({
            where: { id },
            include: [{
                model: UserProfile,
                attributes: ['collegeName', 'collegeYear', 'courseName', 'title', 'bio', 'profileUrl', 'coverUrl', 'followers', 'following']
            }],
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error in getUserById:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

exports.updateUserDetails = async (req, res) => {
    let transaction;
    try {
        const { id } = req.body;
        const { isBlocked, email, phone } = req.body;

        const user = await User.findOne({ where: { id } });
        if (!user) {
            
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        transaction = await sequelize.transaction();
        const updateData = {};
        if (typeof isBlocked === 'boolean') updateData.isBlocked = isBlocked;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update'
            });
        }

        await user.update(updateData, { transaction });

        // Log admin activity
        const activityDescription = `Updated user details: ${Object.keys(updateData).join(', ')}`;
        await createAdminActivity(req, 'UPDATE_USER', activityDescription, transaction);

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: 'User details updated successfully'
        });
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        console.error('Error in updateUserDetails:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}







