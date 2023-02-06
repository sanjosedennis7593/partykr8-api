import { validationResult } from 'express-validator';

import db from '../models';

import Table from '../helpers/database';
import { encryptPassword, comparePassword } from '../helpers/password';
import { uploadFile } from '../helpers/upload';
import { ROLES } from '../config/constants';

const Events = new Table(db.events);

const Talent = new Table(db.talents);
const TalentEventType = new Table(db.talent_event_type);
const TalentUpdateRequest = new Table(db.talent_update_request);
const TalentRatings = new Table(db.talent_ratings);
const TalentPhotos = new Table(db.talent_photos);
const TalentValidIds = new Table(db.talent_valid_ids);

const UserArchive = new Table(db.user_archive);
const User = new Table(db.users);
const UserRatings = new Table(db.user_ratings);


const GetCurrentUser = async (req, res, next) => {
    try {
        let user = {
            ...req.user,
        };

        delete user.password;
        return res.status(200).json({
            ...user
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

const GetUser = async (req, res, next) => {
    try {
        const { user_id } = req.params;

        let user = await User.GET({
            where: {
                id: user_id
            },
            include: [
                {
                    model: db.events,

                }
            ]
        });
        delete user.password;
        return res.status(200).json({
            data: user
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

const UpdateUserDetails = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let user = {
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            gender: req.body.gender,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            zip: req.body.zip,
            lat: req.body.lat,
            lng: req.body.lng,
            phone_number: req.body.phone_number
        };

        await User.UPDATE(
            {
                id: req.user.id
            },
            {
                ...user
            }
        );

        return res.status(201).json({
            message: 'User details has been updated successfully!',
            data: {
                ...user
            }
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

const UpdateUserPassword = async (req, res, next) => {
    try {

        const currentPassword = req.body.current_password || '';
        const newPassword = req.body.new_password || '';
        const repeatNewPassword = req.body.repeat_new_password || '';

        if (newPassword && repeatNewPassword && newPassword.length < 8) {
            throw new Error('Password should be at least 8 characters');
        }
        if (newPassword !== repeatNewPassword) {
            throw new Error('Password not match!');
        }

        const user = await User.GET({
            where: {
                id: req.user.id
            },
        });

        if (user) {
            const isCurrentPasswordCorrect = comparePassword(currentPassword, user.password);

            if (isCurrentPasswordCorrect) {
                const updatedPassword = encryptPassword(newPassword);

                const isPasswordUpdateSuccess = await User.UPDATE(
                    {
                        id: req.user.id
                    },
                    {
                        password: updatedPassword
                    }
                );

                if (isPasswordUpdateSuccess) {
                    return res.status(200).json({
                        message: 'Password has been updated successfully!'
                    });
                }
                return res.status(400).json({
                    message: 'Something went wrong!'
                });

            }
            else {
                throw new Error('Current password is incorrect!');
            }

        }
        throw new Error('User not found!');
    }
    catch (err) {
        return res.status(400).json({
            error: err.code,
            message: err.message,
        });
    }
};


const UpdateUserStatus = async (req, res, next) => {

    try {
        const user = await User.GET({
            where: {
                id: req.body.id
            },
        });

        if (!user) {
            return res.status(400).json({ message: 'User does not exist!' });
        }

        if (!ROLES[req.body.role]) {
            return res.status(400).json({ message: 'Invalid role' });
        }


        await User.UPDATE(
            {
                id: req.body.id
            },
            {
                role: req.body.role,
            }
        );

        return res.status(201).json({
            message: 'User role has been updated successfully!'
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


const UpdateUserAvatar = async (req, res, next) => {

    try {
        if (!req.user) {
            return res.status(400).json({ message: 'User does not exist!' });
        }

        const userId = req.user.id;

        if (req.file) {
            const fileParams = {
                Key: `user/${userId}/profile_${userId}.jpg`,
                Body: req.file.buffer,
            };

            const s3Response = await uploadFile(fileParams);
            if (s3Response) {
                console.log('s3Response', s3Response)
                await User.UPDATE({
                    id: userId
                }, {
                    avatar_url: s3Response ? s3Response.Key : ''
                });

            }

        }
        const user = await User.GET({
            where: {
                id: userId
            },
        });

        return res.status(201).json({
            message: 'User profile photo has been updated successfully!',
            user
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


const CreateUserRatings = async (req, res, next) => {
    try {

        const {
            ratings
        } = req.body;


        if (ratings.length === 0) {
            return res.status(400).json({ message: 'Invalid Request' });
        }

        const userRatings = await UserRatings.CREATE(ratings);

        return res.status(201).json({
            ratings: userRatings
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

const GetUserRatings = async (req, res, next) => {
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: 'Invalid Request'
            });
        };

        const userRatings = await UserRatings.GET_ALL({
            where: {
                user_id: id
            },

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
                {
                    model: db.talents,
                    attributes: [
                        'id',
                        'type',
                        'avatar_url_1'
                    ],
                    include: [
                        {
                            model: db.users,
                            attributes: [
                                'email',
                                'lastname',
                                'firstname',
                                'avatar_url'
                            ]
                        }
                    ]
                },
            ]
        });

        return res.status(201).json({
            ratings: userRatings
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

const SetUserPassword = async (req, res, next) => {
    try {

        const {
            password,
            confirm_password
        } = req.body;

        if (password !== confirm_password) {
            return res.status(400).json({
                message: 'Password not match!'
            });
        }

        const updatedPassword = encryptPassword(password);
        await User.UPDATE(
            {
                id: req.user.id
            },
            {
                password: updatedPassword
            }
        );

        return res.status(200).json({
            message: 'Password has been updated successfully!'
        });

    }
    catch (err) {
        console.log('Error', err)
        return res.status(400).json({
            error: err.code,
            message: err.message,
        });
    }
}

const GetUserArchive = async (req, res, next) => {
    try {

        const users = await UserArchive.GET_ALL({
            where: {
                user_id: id
            }
        });

        return res.status(201).json({
            users
        });

    }
    catch (err) {
        console.log('Error', err)
        return res.status(400).json({
            error: err.code,
            message: err.message,
        });
    }
}


const UserDelete = async (req, res, next) => {
    try {
        const { user } = req;
  
        let payload = {
            ...user
        };

        const events = await Events.GET_ALL({
            where: {
                user_id: user.id
            },
            include: [
                {
                    model: db.event_guests
                },
                {
                    model: db.talent_ratings
                },
                {
                    model: db.event_refund
                },
                {
                    model: db.event_payments,
                    include: [
                        {
                            model: db.event_payment_details
                        }
                    ]
                },

                {
                    model: db.event_talents
                },
            ]

        });

        const talent = await Talent.GET({
            where: {
                user_id: user.id
            },
            include: [
                {
                    model: db.talent_valid_ids,
                },
                {
                    model: db.talent_event_type
                },
                {
                    model: db.talent_photos
                },
                {
                    model: db.talent_ratings
                },
                {
                    model: db.talent_update_request
                }
            ]
        });

        delete payload.password;

        UserArchive.CREATE({
            user: JSON.stringify(payload),
            events: JSON.stringify(events),
            talents: JSON.stringify(talent),
        });


        await Events.DELETE(
            {
                user_id: user.id
            }
        );


        await Talent.DELETE(
            {
                user_id: user.id
            }
        );


        await User.DELETE(
            {
                id: user.id
            }
        );


        return res.status(200).json({
            message: 'Account has been deleted successfully!'
        });

    }
    catch (err) {
        console.log('Error', err)
        return res.status(400).json({
            error: err.code,
            message: err.message,
        });
    }
}


export {
    GetUser,
    GetCurrentUser,
    UpdateUserDetails,
    UpdateUserPassword,
    UpdateUserStatus,
    UpdateUserAvatar,
    CreateUserRatings,
    GetUserRatings,
    SetUserPassword,
    UserDelete,
    GetUserArchive
};