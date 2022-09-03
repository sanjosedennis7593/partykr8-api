import passport from 'passport';
import passportJWT from 'passport-jwt';

import db from '../models';
import Table from '../helpers/database';
import { comparePassword } from './password';

import { JWT_SECRET } from "../config/jwt";

const LocalStrategy = require('passport-local').Strategy;

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;


const User = new Table(db.users);

const passportAuthenticate =  passport.authenticate('jwt', {session: false});

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
            });
            if( user.dataValues) {
                delete user.dataValues.password;
                return callback(null, {
                    user: user && user.dataValues
                })
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