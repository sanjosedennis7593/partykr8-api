import passport from 'passport';
import passportJWT from 'passport-jwt';
// import FacebookStrategy from 'passport-facebook';


import db from '../models';
import Table from './database';
import { comparePassword } from './password';

// import { API_URL } from '../config/api';
// import {
//     // FACEBOOK_APP_ID,
//     // FACEBOOK_SECRET,
//     // FACEBOOK_CALLBACK_URL,
//     GOOGLE_CLIENT_ID,
//     GOOGLE_SECRET,
//     GOOGLE_CALLBACK_URL
// } from '../config/auth';
import { JWT_SECRET } from "../config/jwt";
// import { ROLES } from "../config/constants";

const LocalStrategy = require('passport-local').Strategy;
// const GoogleStrategy = require('passport-google-oauth2').Strategy;

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;


// const Talent = new Table(db.talents);
const User = new Table(db.users);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});


const passportAuthenticate = passport.authenticate('jwt', { session: false });

const TALENT_DATA = [
    {
        model: db.users,
        attributes: [
            'email',
            'lastname',
            'firstname',
            'avatar_url',
        ]
    },
    {
        model: db.talent_valid_ids,
        attributes: [
            'valid_id_url'
        ]
    },
    {
        model: db.talent_photos,
        attributes: [
            'photo_url'
        ]
    },
    {
        model: db.event_talents,
        attributes: [
            'event_id',
            'status',
            'id'
        ],
        include: [
            {
                model: db.events,
                attributes: [
                    'title',
                    'date',
                    'start_time',
                    'end_time',
                ]
            }
        ]
    },
    {
        model: db.service_package
    },
]


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    async (email, password, callback) => {
        try {
            const user = await User.GET({
                where: {
                    email,
                },
                include: [
                    {
                        model: db.talents,
                        include: TALENT_DATA

                    }
                ]
            });

            if (user) {
                const isPasswordCorrect = comparePassword(password, user.password);
                if (isPasswordCorrect) {
                    let updatedPayload = {
                        ...user.dataValues,
                    };

                    delete updatedPayload.password;
                    return callback(null, { user: updatedPayload, message: 'Logged In Successfully' })
                }
                return callback(null, { user: null, message: 'Incorrect Password' });
            }
            return callback(null, { user: null, message: 'User not exist!' });
        }
        catch (err) {
            return callback(null, { user: null, message: 'Something went wrong' })
        }
    }
));



passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
},
    async (jwtPayload, callback) => {
        try {
            const user = await User.GET({
                where: {
                    id: jwtPayload.id
                },
       
                include: [
                    {
                        model: db.talents,
                        include: TALENT_DATA
                        
                    }
                ]
            });

            if (user && user.dataValues) {
                let currentUser = {
                    ...user.dataValues
                }

                if(!user.dataValues.password) {
                    currentUser = {
                        ...currentUser,
                        is_password_empty: true
                    }
                };

                delete currentUser.password;

                return callback(null, currentUser)
            }

            return callback(null, {
                user: null
            })

        }
        catch (err) {
            console.log('err', err)
            return callback(err, {
                message: 'Something went wrong!'
            });
        }

    }
));

export {
    passportAuthenticate
};