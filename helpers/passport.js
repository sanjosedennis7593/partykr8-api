import passport from 'passport';
import passportJWT from 'passport-jwt';
import FacebookStrategy from 'passport-facebook';


import db from '../models';
import Table from './database';
import { comparePassword } from './password';

import { API_URL } from '../config/api';
import {
    // FACEBOOK_APP_ID,
    // FACEBOOK_SECRET,
    // FACEBOOK_CALLBACK_URL,
    GOOGLE_CLIENT_ID,
    GOOGLE_SECRET,
    GOOGLE_CALLBACK_URL
} from '../config/auth';
import { JWT_SECRET } from "../config/jwt";
import { ROLES } from "../config/constants";

const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;


const User = new Table(db.users);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});


const passportAuthenticate = passport.authenticate('jwt', { session: false });


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
            });

            if (user) {
                const isPasswordCorrect = comparePassword(password, user.password);
                if (isPasswordCorrect) {
                    return callback(null, { user: user && user.dataValues, message: 'Logged In Successfully' })
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



// passport.use(
//     new FacebookStrategy(
//         {
//             clientID: FACEBOOK_APP_ID,
//             clientSecret: FACEBOOK_SECRET,
//             callbackURL: `${API_URL}${FACEBOOK_CALLBACK_URL}`,
//             profileFields: ["email", "name"]
//         },
//         async (accessToken, refreshToken, profile, callback) => {

//             if (profile) {
//                 const { email, first_name, last_name } = profile._json;

//                 let user = await User.GET({
//                     where: {
//                         email
//                     }
//                 });


//                 if (user && user.dataValues) {
//                     delete user.dataValues.password;
//                     if (!user.dataValues.facebook_id) {
//                         await User.UPDATE(
//                             {
//                                 email
//                             },
//                             {
//                                 facebook_id: profile.id
//                             }
//                         );
//                     }

//                     return callback(null, {
//                         user: user && user.dataValues
//                     })
//                 }
//                 else {
//                     const userPayload = {
//                         email,
//                         firstname: first_name,
//                         lastname: last_name,
//                         type: ROLES.user,
//                         facebook_id: profile.id
//                     };

//                     const newUser = await User.CREATE(userPayload)

//                     return callback(null, {
//                         user: newUser
//                     })
//                 }
//             }

//             return callback(null, {
//                 user: null
//             })

//         }
//     )
// );




// passport.use(
//     new GoogleStrategy({
//         clientID: GOOGLE_CLIENT_ID,
//         clientSecret: GOOGLE_SECRET,
//         callbackURL: `${API_URL}${GOOGLE_CALLBACK_URL}`,
//         passReqToCallback: true
//     },
//         async (request, accessToken, refreshToken, profile, callback) => {

//             if (profile) {
//                 const { id, email, family_name, given_name } = profile;

//                 let user = await User.GET({
//                     where: {
//                         email
//                     }
//                 });

//                 if (user && user.dataValues) {
//                     delete user.dataValues.password;
//                     if (!user.dataValues.google_id) {
//                         await User.UPDATE(
//                             {
//                                 email
//                             },
//                             {
//                                 google_id: id
//                             }
//                         );
//                     }

//                     return callback(null, {
//                         user: user && user.dataValues
//                     })
//                 }
//                 else {
//                     const userPayload = {
//                         email,
//                         firstname: given_name,
//                         lastname: family_name,
//                         type: ROLES.user,
//                         facebook_id: id
//                     };

//                     const newUser = await User.CREATE(userPayload)

//                     return callback(null, {
//                         user: newUser
//                     })
//                 }
//             }

//             return callback(null, {
//                 user: null
//             })
//         }
//     ));


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
            });
            if (user && user.dataValues) {
                delete user.dataValues.password;
                return callback(null, user.dataValues)
            }

            return callback(null, {
                user: null
            })

        }
        catch (err) {
            return callback(err, {
                message: 'Something went wrong!'
            });
        }

    }
));

export {
    passportAuthenticate
};