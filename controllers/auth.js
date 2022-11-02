import jwt from 'jsonwebtoken';
import passport from 'passport';
import { validationResult } from 'express-validator';
import { JWT_SECRET } from '../config/jwt';
import { ROLES } from '../config/constants';
import Table from '../helpers/database';
import { sendMessage } from '../helpers/mail';
import { encryptPassword, generateCode } from '../helpers/password';
import { uploadFile } from '../helpers/upload';
import { RESET_PASSWORD_MESSAGE } from '../helpers/mail_templates';
import db from '../models';

const User = new Table(db.users);

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
        model: db.talent_event_type
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
];


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
            if (data && data.user) {

                const token = jwt.sign({
                    id: data.user.id,
                    email: data.user.email,
                    role: data.user.role
                }, JWT_SECRET);
                delete data.user.password;
                return res.json({
                    user: {
                        ...data.user
                    }, message: data.message, token
                });
            }
            return res.status(400).json({ message: data.message })


        });
    })(req, res);
}

// const FacebookSignIn = passport.authenticate('facebook', {
//     scope: ['email', 'user_location']
// });

const FacebookSignIn = async (req, res, next) => {
    try {

        const { facebook_id, email, firstname, lastname, avatar_url } = req.body;

        let user = await User.GET({
            where: {
                email
            },
            include: [
                {
                    model: db.talents,
                    include: TALENT_DATA

                }
            ]
        });

        if (user && user.dataValues) {
            delete user.dataValues.password;
            if (!user.dataValues.facebook_id) {

                let updatePayload = {};

                if (!user.dataValues.facebook_id) {
                    updatePayload = {
                        ...updatePayload,
                        facebook_id
                    }
                }

                if (!user.dataValues.avatar_url) {
                    updatePayload = {
                        ...updatePayload,
                        avatar_url
                    }
                }

                if(updatePayload && !updatePayload.password) {
                    updatePayload = {
                        ...updatePayload,
                        is_password_empty: true
                    }
                };

                delete updatePayload.password;
                await User.UPDATE(
                    {
                        email
                    },
                    updatePayload
                );
            }

            const token = jwt.sign({
                id: user.dataValues.id,
                email: user.dataValues.email,
                role: user.dataValues.role
            }, JWT_SECRET);

            return res.json({
                user: {
                    ...user.dataValues
                },
                token
            });

        }
        else {
            const userPayload = {
                email,
                avatar_url,
                firstname: firstname,
                lastname: lastname,
                type: ROLES.user,
                facebook_id
            };

            const newUser = await User.CREATE(userPayload)

            const token = jwt.sign({
                id: newUser.id,
                email: newUser.email,
                role: newUser.role
            }, JWT_SECRET);

            return res.json({
                user: {
                    ...newUser,
                    is_password_empty: true
            
                },
                token
            });
        }
    } catch (err) {
        return res.status(400).json({
            message:'Invalid Login'
        });
    }
}


// const FacebookSignInCallback = async (req, res, next) => {
//     passport.authenticate('facebook', function (err, data, info) {
//         if (err) {
//             return next(err);

//         }
//         if (data && !data.user) {
//             return res.status(200).json({ user: null })
//         }

//         const token = jwt.sign({
//             id: data.user.id,
//             email: data.user.email,
//             role: data.user.role
//         }, JWT_SECRET);


//         res.redirect(
//             `partykr8://app/signin?firstname=${data.user.firstname}/lastname=${data.user.firstname}/email=${data.user.email}`
//         );
//         // return res.json({
//         //     user: {
//         //         ...data.user
//         //     },
//         //     facebook_access_token: req.query && req.query.code,
//         //     token
//         // });

//     })(req, res, next);
// }


// const GoogleSignIn = passport.authenticate('google', {
//     scope: ['email', 'profile']
// });


const GoogleSignIn = async (req, res, next) => {
    try {

        const { google_id, email, firstname, lastname } = req.body;

        let user = await User.GET({
            where: {
                email
            },
            include: [
                {
                    model: db.talents,
                    include: TALENT_DATA

                }
            ]
        });

        if (user && user.dataValues) {

            if (!user.dataValues.google_id) {

                await User.UPDATE(
                    {
                        email
                    },
                    {
                        google_id
                    }
                );
            }


            const token = jwt.sign({
                id: user.dataValues.id,
                email: user.dataValues.email,
                role: user.dataValues.role
            }, JWT_SECRET);

            

            return res.json({
                user: {
                    ...user.dataValues,
                    is_password_empty: !user.dataValues.password? true : false
                },
                token
            });

        }
        else {
            const userPayload = {
                email,
                firstname: firstname,
                lastname: lastname,
                type: ROLES.user,
                google_id
            };

            const newUser = await User.CREATE(userPayload)

            const token = jwt.sign({
                id: newUser.id,
                email: newUser.email,
                role: newUser.role
            }, JWT_SECRET);

            return res.json({
                user: {
                    ...newUser,
                    is_password_empty: true
                },
                token
            });
        }
    } catch (err) {
        return res.status(400).json({
            message:'Invalid Login'
        });
    }
}

const GoogleSignInCallback = (req, res, next) => {
    passport.authenticate('google', function (err, data, info) {
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
            google_access_token: req.query && req.query.code,
            token
        });

    })(req, res, next);

}


const SignUpController = async (req, res, next) => {
    try {
        console.log('req.file', req.file)

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = await User.GET({
            where: {
                email: req.body.email
            },
        });

        if (user && user.dataValues) {
            return res.status(400).json({
                message: 'Email already used!'
            });
        }


        const payload = {
            email: req.body.email,
            password: encryptPassword(req.body.password),
            avatar_url: req.body.avatar_url,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            gender: req.body.gender,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            lat: req.body.lat,
            lng: req.body.lng,
            zip: req.body.zip,
            phone_number: req.body.phone_number,
            role: ROLES.user,
            security_question: req.body.security_question,
            security_answer: req.body.security_answer
        };

        let newUser = await User.CREATE({
            ...payload
        });

        if (req.file) {
            const fileParams = {
                Key: `user/${newUser.id}/profile_${newUser.id}.jpg`,
                Body: req.file.buffer,
            };

            const s3Response = await uploadFile(fileParams);
            if (s3Response) {
                await User.UPDATE({
                    id: newUser.id
                }, {
                    avatar_url: s3Response ? s3Response.Key : ''
                });

                newUser = {
                    ...newUser,
                    avatar_url: s3Response ? s3Response.Key : ''
                }
            }

        }


        return res.json({
            message: 'Account has been created successfully!',
            data: newUser
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

const ResetPassword = async (req, res, next) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, answer } = req.body;
        const user = await User.GET({
            where: {
                email
            },
        });

        if (!user) {
            return res.status(400).json({
                message: 'User not exist!'
            });
        }

        if(user && user.dataValues && user.dataValues.security_answer === answer) {
            const newPassword = generateCode(12);
            const updatedPassword = encryptPassword(newPassword);
    
            const isPasswordUpdateSuccess = await User.UPDATE(
                {
                    id: user.id
                },
                {
                    password: updatedPassword
                }
            );
    
            if (isPasswordUpdateSuccess) {
                await sendMessage({
                    to: user.email,
                    subject: `Reset Password`,
                    html: RESET_PASSWORD_MESSAGE({
                        password: newPassword,
                        user
                    })
                });
    
            }
    
            return res.json({
                message: 'Your new password has been sent to your email!'
            });
        }

        return res.status(400).json({
            message: 'Answer is incorrect!'
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


const GetSecurityQuestion = async (req, res, next) => {
    try {

        const user = await User.GET({
            where: {
                email: req.body.email
            },
            attributes: ['security_question'],
        });

        if(!user) {
            return res.status(400).json({
                message: 'User not exist!'
            });
        }

        return res.status(200).json({
            security_question: user && user.dataValues && user.dataValues.security_question
        })

    }
    catch (err) {
        console.log('Error', err)
        return res.status(400).json({
            error: err.code,
            message: err.message,
        });
    }

}


const SetUserPassword = async (req, res, next) => {
    try {

        const user = await User.GET({
            where: {
                email: req.body.email
            },
            attributes: ['security_question'],
        });

        if(!user) {
            return res.status(400).json({
                message: 'User not exist!'
            });
        }

        return res.status(200).json({
            security_question: user && user.dataValues && user.dataValues.security_question
        })

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
    SignInController,
    SignUpController,
    FacebookSignIn,
    // FacebookSignInCallback,
    GoogleSignIn,
    GoogleSignInCallback,
    ResetPassword,
    GetSecurityQuestion,
    SetUserPassword
}