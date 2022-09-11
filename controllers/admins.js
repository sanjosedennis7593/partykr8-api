import { validationResult } from 'express-validator';

import db from '../models';

import Table from '../helpers/database';
// import { encryptPassword, comparePassword } from '../helpers/password';
// import { ROLES } from '../config/constants';

const User = new Table(db.users);


const GetAdmins = async (req, res, next) => {
    try {

        if(req.user && req.user.role !== 'admin') {
            return res.status(400).json({
                message:'Insufficient Privileges'
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





export {
    GetAdmins
}