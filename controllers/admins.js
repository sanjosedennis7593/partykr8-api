import { validationResult } from 'express-validator';
import db from '../models';

import Table from '../helpers/database';
import { encryptPassword } from '../helpers/password';
import user_ratings from '../models/user_ratings';
// import { encryptPassword, comparePassword } from '../helpers/password';
// import { ROLES } from '../config/constants';

const User = new Table(db.users);


const GetAdmins = async (req, res, next) => {
    try {

        if (req.user && req.user.role !== 'admin') {
            return res.status(400).json({
                message: 'Insufficient Privileges'
            })
        };

        let admins = await User.GET_ALL({
            where: {
                role: 'admin'
            },
            attributes: {
                exclude: ['password']
            }
        });

        return res.status(200).json({
            list: admins
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


const CreateAdmin = async (req, res, next) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstname, lastname, email, password } = req.body;

        let isUserExist = await User.GET({
            where: {
                email
            },
            attributes: {
                exclude: ['password']
            }
        });

        if (isUserExist) {
            // return res.status(400).json({
            //     message: 'User already exist!'
            // })

            await User.UPDATE({
                email
            }, {
                role: 'admin',
                password: encryptPassword(password),
                firstname: firstname,
                lastname: lastname,
            });

            let admins = await User.GET_ALL({
                where: {
                    role: 'admin'
                },
                attributes: {
                    exclude: ['password']
                }
            });

            return res.status(201).json({
                list: admins
            });
        }

        const userPayload = {
            email,
            password: encryptPassword(password),
            firstname: firstname,
            lastname: lastname,
            role: 'admin'
        };

        await User.CREATE(userPayload);

        let admins = await User.GET_ALL({
            where: {
                role: 'admin'
            },
            attributes: {
                exclude: ['password']
            }
        });


        return res.status(201).json({
            list: admins
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


const DeleteAdmin = async (req, res, next) => {
    try {

        const { email } = req.body;
        console.log('Emailllll', email)
        await User.DELETE({
            email
        });

        let admins = await User.GET_ALL({
            where: {
                role: 'admin'
            },
            attributes: {
                exclude: ['password']
            }
        });

        return res.status(200).json({
            list: admins
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
    GetAdmins,
    CreateAdmin,
    DeleteAdmin
}