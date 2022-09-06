import jwt from 'jsonwebtoken';
import passport from 'passport';
import { validationResult } from 'express-validator';

import { JWT_SECRET } from '../config/jwt';
import { ROLES } from '../config/constants';
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
                
                return res.json({ user: {
                    ...data.user
                }, message: data.message, token });
            }
            return res.status(400).json({ message: data.message })
            
 
        });
    })(req, res);
}

const FacebookSignIn = passport.authenticate('facebook', {
    scope: [ 'email', 'user_location' ]
});


const FacebookSignInCallback =  (req, res, next) => {
    passport.authenticate('facebook', function (err, data, info) {
        if (err) {
            return next(err);

        }
        if (data && !data.user) {
            return res.status(200).json({ user: null })
        }

        const token = jwt.sign({
            id: data.user.id,
            email: data.user.email,
            role: data.user.role
        }, JWT_SECRET);
        
        return res.json({ 
            user: {
            ...data.user
            }, 
            facebook_access_token: req.query && req.query.code,
            token
    });
     
    })(req, res, next);
}

// const FacebookSignInSuccess = (req, res, next) => {
//     console.log('req.user', req.user)
//     return res.status(200).json({ message: 'Success' })
// }

// const FacebookSignInFailed = (req, res, next) => {
//     return res.status(200).json({ message: 'Failed' })
// }




const SignUpController = async (req, res, next) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

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
            role: ROLES.user
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
    SignUpController,
    FacebookSignIn,
    // FacebookSignInFailed,
    // FacebookSignInSuccess,
    FacebookSignInCallback
}