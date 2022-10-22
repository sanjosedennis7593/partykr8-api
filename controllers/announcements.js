import db from '../models';

import Table from '../helpers/database';

const Announcements = new Table(db.announcements);

const GetAllAnnouncements = () => {
    let response = [];
    try {
        response = Announcements.GET_ALL({
            limit: 20,
            order: [['createdAt', 'desc']],
            include: [
                {
                    model: db.users,
                    attributes: [
                        'email',
                        'lastname',
                        'firstname',
                        'avatar_url'
                    ]
                },
            ]
        });
    }
    catch (err) {
        response = [];
    }
    finally {
        return response;
    }
}


const GetAnnouncements = async (req, res, next) => {
    try {

        const response = await GetAllAnnouncements();
        return res.status(200).json({
            list: response
        });
    }
    catch (err) {
        console.log('Error', err)
        return res.status(400).json({
            error: err.code,
            message: err.message,
        });
    }
};

const CreateAnnouncement = async (req, res, next) => {
    try {

        const payload = {
            title: req.body.title,
            description: req.body.description,
            user_id: req.user.id
        };
        await Announcements.CREATE(payload);
        const response = await GetAllAnnouncements();

        return res.status(200).json({
            list: response
        });
    }
    catch (err) {
        console.log('Error', err)
        return res.status(400).json({
            error: err.code,
            message: err.message,
        });
    }
};


const UpdateAnnouncement = async (req, res, next) => {
    try {
        const currentAnnouncement = await Announcements.GET({
            where: {
                announcement_id: req.params.id
            }
        });
        
        if (!currentAnnouncement) {
            return res.status(400).json({
                message: 'Announcement not found!'
            });
        }

        await Announcements.UPDATE({
            user_id: req.user.id,
            announcement_id: req.params.id
        }, {
            title: req.body.title,
            description: req.body.description,
        });
        const response = await GetAllAnnouncements();
        return res.status(200).json({
            list: response
        });
    }
    catch (err) {
        console.log('Error', err)
        return res.status(400).json({
            error: err.code,
            message: err.message,
        });
    }
};


const DeleteAnnouncement = async (req, res, next) => {
    try {
        const currentAnnouncement = await Announcements.GET({
            where: {
                announcement_id: req.params.id
            }
        });
        
        if (!currentAnnouncement) {
            return res.status(400).json({
                message: 'Announcement not found!'
            });
        }

        await Announcements.DELETE(
            {
                announcement_id: req.params.id
            }
        );
        const response = await GetAllAnnouncements();
        return res.status(200).json({
            list: response
        });
    }
    catch (err) {
        console.log('Error', err)
        return res.status(400).json({
            error: err.code,
            message: err.message,
        });
    }
};






export {
    GetAnnouncements,
    CreateAnnouncement,
    UpdateAnnouncement,
    DeleteAnnouncement
}