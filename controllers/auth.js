import jwt from 'jsonwebtoken';
import passport from 'passport';

import { JWT_SECRET } from '../config/jwt';
import Table from '../helpers/database';
import { encryptPassword } from '../helpers/password';
import db from '../models';

const User = new Table(db.users);


const SignInController = (req, res, next) => {

    passport.authenticate('local', { session: false }, (err, data, info) => {
        console.log('err', err)
        if (err) {
            return res.status(400).json({
                message: 'Invalid Request',
                data
            });
        }
        req.login(data, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            if(data && data.user) {

                const token = jwt.sign({
                    id: data.user.id,
                    email: data.user.email,
                    role: data.user.role
                }, JWT_SECRET);
                
                return res.json({ user: data.user, message: data.message, token });
            }
            return res.status(400).json({ message: data.message })
            
 
        });
    })(req, res);
}


const SignUpController = async (req, res, next) => {
    try {

        const user = await User.GET({
            where: {
                email:  req.body.email
            },
        });

        if(user && user.dataValues) {
            return res.status(400).json({
                message: 'User already exist!'
            });
        }


        const payload = {
            email: req.body.email,
            password: encryptPassword(req.body.password),
            avatar_url: req.body.avatar_url,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            state: req.body.country,
            zip: req.body.zip,
            phone_number: req.body.phone_number,
            role: req.body.role
        };

        const response = await User.CREATE({
            ...payload
        });

        return res.json({
            message: 'Account has been created successfully!',
            data: response
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
    SignInController,
    SignUpController
}