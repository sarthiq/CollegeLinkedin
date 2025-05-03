const User = require('../../../Models/User/users');
const Projects = require('../../../Models/User/projects');
const Internship = require('../../../Models/Basic/internship');
const Feeds = require('../../../Models/Basic/feeds');
const UserProfile = require('../../../Models/User/userProfile');
const { Op } = require('sequelize');

exports.search = async (req, res) => {
    try {
        const { searchText, page = 1, limit = 10, type ='user'} = req.body;
        
        if (!searchText) {
            return res.status(400).json({
                success: false,
                message: "Search text is required"
            });
        }

        

        const offset = (page - 1) * limit;
        let results;

        switch (type) {
            case 'user':
                results = await User.findAll({
                    where: {
                        name: {
                            [Op.like]: `%${searchText}%`
                        }
                    },
                    include: [
                        {
                            model: UserProfile,
                            attributes: ['profileUrl', 'title']
                        }
                    ],
                    attributes: ['id', 'name', 'email', 'phone'],
                    limit,
                    offset,
                    order: [['createdAt', 'DESC']]
                });
                break;

            case 'project':
                results = await Projects.findAll({
                    where: {
                        title: {
                            [Op.like]: `%${searchText}%`
                        }
                    },
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'email', 'phone'],
                            include: [
                                {
                                    model: UserProfile,
                                    attributes: ['profileUrl', 'title']
                                }
                            ]
                        }
                    ],
                    limit,
                    offset,
                    order: [['createdAt', 'DESC']]
                });
                break;

            case 'internship':
                results = await Internship.findAll({
                    where: {
                        title: {
                            [Op.like]: `%${searchText}%`
                        }
                    },
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'email', 'phone'],
                            include: [
                                {
                                    model: UserProfile,
                                    attributes: ['profileUrl', 'title']
                                }
                            ]
                        }
                    ],
                    limit,
                    offset,
                    order: [['createdAt', 'DESC']]
                });
                break;

            case 'feed':
                results = await Feeds.findAll({
                    where: {
                        feedData: {
                            content: {
                                [Op.like]: `%${searchText}%`
                            }
                        }
                    },
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'email', 'phone'],
                            include: [
                                {
                                    model: UserProfile,
                                    attributes: ['profileUrl', 'title']
                                }
                            ]
                        }
                    ],
                    limit,
                    offset,
                    order: [['createdAt', 'DESC']]
                });
                break;
        }

        return res.status(200).json({
            success: true,
            data: results,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while searching",
            error: error.message
        });
    }
}
