import { validationResult } from 'express-validator';

import db from '../models';

import Table from '../helpers/database';
import { encryptPassword, comparePassword } from '../helpers/password';
import { ROLES } from '../config/constants';

const User = new Table(db.users);


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
            avatar_url: req.body.avatar_url,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            state: req.body.country,
            zip: req.body.zip,
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

                if(isPasswordUpdateSuccess) {
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
                id:  req.body.id
            },
        });

        if(!user) {
            return res.status(400).json({ message: 'User not exist!' });
        }

        if(!ROLES[req.body.role]) {
            return res.status(400).json({ message: 'Invalid role value' });
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



export {
    GetUser,
    GetCurrentUser,
    UpdateUserDetails,
    UpdateUserPassword,
    UpdateUserStatus
};