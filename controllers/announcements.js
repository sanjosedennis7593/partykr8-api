import db from '../models';

import Table from '../helpers/database';
import { deleteFile, uploadFile } from '../helpers/upload';

const Announcements = new Table(db.announcements);
const AnnouncementPhotos = new Table(db.announcement_photos);

const GetAllAnnouncements = () => {
    let response = [];
    try {
        response = Announcements.GET_ALL({
            limit: 20,
            order: [['createdAt', 'desc']],
            include: [
                {
                    model: db.announcement_photos
                },
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

        const announcement = await Announcements.CREATE(payload);

        for (let key of Object.keys(req.files)) {

            if (key === 'photos[]') {
                if (req.files[key]) {
                    let idIndex = 1;

                    for (let item of req.files[key]) {
                        const s3Params = {
                            Key: `announcement/${announcement.announcement_id}/photos/${idIndex}_${announcement.announcement_id}.jpg`,
                            Body: item.buffer,
                        };

                        const s3Response = await uploadFile(s3Params);
        
                        if (s3Response) {
                            await AnnouncementPhotos.CREATE({
                                announcement_id: announcement.announcement_id,
                                photo_url: s3Response.Key
                            })
                        }
                        idIndex++;
                    }
                }
            }
        }


        // await Announcements.CREATE(payload);
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

        for (let key of Object.keys(req.files)) {
            if (key === 'photos[]') {
                if (req.files[key]) {

                    for (let item of req.files[key]) {
                        const currentPhoto = await AnnouncementPhotos.CREATE({
                            announcement_id: req.params.id
                        })

                        if (currentPhoto) {

                            const s3Params = {
                                Key: `announcement/${req.params.id}/photos/${currentPhoto.announcement_photo_id}_${req.params.id}.jpg`,
                                Body: item.buffer,
                            };

                            const s3Response = await uploadFile(s3Params);
       
                            if (s3Response) {
                                await AnnouncementPhotos.UPDATE({
                                    announcement_photo_id: currentPhoto.announcement_photo_id,

                                }, {
                                    photo_url: s3Response.Key
                                })
                            }
                        }


                    }
                }
            }

        }

        if (req.body.deleted_photos) {
            const deletedPhotos = JSON.parse(req.body.deleted_photos)
            for (let key of deletedPhotos) {
                const s3Params = {
                    Key: key
                };
                const s3Response = await deleteFile(s3Params);
                if (s3Response) {
                    await AnnouncementPhotos.DELETE({
                        photo_url: key
                    });
                }
            }
        }

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