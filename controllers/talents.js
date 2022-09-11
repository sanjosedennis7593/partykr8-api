import { validationResult } from 'express-validator';

import { TALENT_STATUS, TALENT_TYPES } from '../config/constants';

import Table from '../helpers/database';
import { sendMessage } from '../helpers/mail';
import { uploadFile } from '../helpers/upload';
import { TALENT_APPROVED_MESSAGE } from '../helpers/mail_templates';

// import { encryptPassword } from '../helpers/password';
import db from '../models';
import { format } from 'date-fns';

import sequelize from 'sequelize';


const Talent = new Table(db.talents);
const TalentValidIds = new Table(db.talent_valid_ids);
const User = new Table(db.users);


const GetTalents = async (req, res, next) => {
    try {

        const distance = 30;
        const latitude = req.query.lat || null;
        const longitude = req.query.lng || null;
        let haversine = null;
        let distanceOptions = {};

        if (latitude && longitude) {
            haversine = `(
                6371 * acos(
                    cos(radians(${latitude}))
                    * cos(radians(lat))
                    * cos(radians(lng) - radians(${longitude}))
                    + sin(radians(${latitude})) * sin(radians(lat))
                )
            )`;

            distanceOptions = {
                attributes: [
                    'id',
                    'type',
                    'genre',
                    'address',
                    [sequelize.literal(`round(${haversine}, 2)`), 'distance'],
                ],
                order: sequelize.col('distance'),
                having: sequelize.literal(`distance <= ${distance}`),
            }
        };

        const talents = await Talent.GET_ALL({
            ...distanceOptions,
            where: {
                status: 'approved'
            },
            include: [
                {
                    model: db.users,
                    attributes: [
                        'email',
                        'lastname',
                        'firstname',
                    ]
                },
                {
                    model: db.talent_valid_ids,
                    attributes: [
                        'valid_id_url'
                    ]
                },
            ]

        })
        return res.status(200).json({
            data: talents
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

const GetTalent = async (req, res, next) => {
    try {
        const { id } = req.params;
        let talent = await Talent.GET({
            where: {
                id
            },
            include: [
                {
                    model: db.users,
                    attributes: [
                        'email',
                        'lastname',
                        'firstname',
                    ]
                },
                {
                    model: db.talent_valid_ids,
                    attributes: [
                        'valid_id_url'
                    ]
                },
                {
                    model: db.event_talents,
                    attributes: [
                        'event_id',
                        'status'
                    ],
                    include: [
                        {
                            model: db.events
                        }
                    ]
                },
            ]

        });

        talent = {
            ...((talent && talent.dataValues) || {}),
            schedule: talent.dataValues && talent.dataValues.event_talents.map(item => {
                return {
                    event_id: item.event_id,
                    event_name: item.event && item.event.title,
                    date: item.event && format(item.event.date, 'yyyy-MM-dd'),
                    start_time: item.event && item.event.start_time,
                    end_time: item.event && item.event.end_time
                }
            })
        };


        return res.status(200).json({
            data: talent
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



const TalentSignUp = async (req, res, next) => {
    try {


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (!TALENT_TYPES[req.body.type]) {
            return res.status(400).json({
                message: 'Talent type is not exist!'
            });
        }

        const talent = await Talent.GET({
            where: {
                user_id: req.user.id
            },
        });

        if (talent && talent.dataValues) {
            return res.status(400).json({
                message: 'You already applied to become a talent'
            });
        }

        const payload = {
            type: req.body.type,
            genre: req.body.genre,
            private_fee: req.body.private_fee,
            service_rate: req.body.service_rate,
            service_rate_type: req.body.service_rate_type,
            address: req.body.address,
            phone_number: req.body.phone_number,
            facebook_url: req.body.facebook_url,
            instagram_url: req.body.instagram_url,
            twitter_url: req.body.twitter_url,
            tiktok_url: req.body.tiktok_url,
            status: TALENT_STATUS[req.body.status],
            user_id: req.user.id,
            status: TALENT_STATUS.pending
        };

        const currentTalent = await Talent.CREATE({
            ...payload
        });
        let avatarUrlKeys = {};
        if (Object.keys(req.files).length > 0) {
            for (let key of Object.keys(req.files)) {
                if (key !== 'valid_ids') {
                    if (req.files[key] && req.files[key][0]) {
                        const s3Params = {
                            Key: `talent/${currentTalent.id}/${key}_${currentTalent.id}.jpg`,
                            Body: req.files[key][0].buffer,
                        };

                        const s3Response = await uploadFile(s3Params);
                        if (s3Response) {
                            avatarUrlKeys = {
                                ...avatarUrlKeys,
                                [key]: s3Response && s3Response.Key
                            }
                        }
                    }

                }
                else {
                    if (req.files[key]) {
                        let idIndex = 1;
                        for (let item of req.files[key]) {
                            const s3Params = {
                                Key: `talent/${currentTalent.id}/valid_ids/${idIndex}_${currentTalent.id}.jpg`,
                                Body: item.buffer,
                            };

                            const s3Response = await uploadFile(s3Params);
                            if (s3Response) {
                                TalentValidIds.CREATE({
                                    talent_id: currentTalent.id,
                                    valid_id_url: s3Response.Key
                                })
                            }
                            idIndex++;
                        }
                    }
                }

            }

            await Talent.UPDATE({
                id: currentTalent.id
            }, {
                ...avatarUrlKeys
            });
        }


        return res.json({
            message: 'Talent application has been sent successfully!',
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


const TalentUpdateStatus = async (req, res, next) => {

    try {

        if (!TALENT_STATUS[req.body.status]) {
            return res.status(400).json({ message: 'Invalid Status!' });
        }
        const talent = await Talent.GET({
            where: {
                id: req.body.id
            },
        });


        if (!talent) {
            return res.status(400).json({ message: 'Talent not exist!' });
        }

        await Talent.UPDATE(
            {
                id: req.body.id
            },
            {
                status: req.body.status,
            }
        );

        const talentUser = await User.GET({
            id: talent.user_id
        })

        if (talentUser && talentUser.dataValues && req.body.status === TALENT_STATUS.approved) {
            await sendMessage({
                to: talentUser.dataValues.email,
                subject: `Talent Application Approved`,
                html: TALENT_APPROVED_MESSAGE({
                    user: talentUser.dataValues
                })
            });
        }

        return res.status(201).json({
            message: 'Talent application has been updated successfully!',
            talent: talentUser
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


const TalentUpdateAvatar = async (req, res, next) => {

    try {

        if (!req.body.id) {
            return res.status(400).json({ message: 'ID is required field' });
        }
        const talentId = req.body.id;


        const talent = await Talent.GET({
            where: {
                id: talentId
            },
        });


        if (!talent) {
            return res.status(400).json({ message: 'Talent not exist!' });
        }

        let avatarUrlKeys = {};
        if (Object.keys(req.files).length > 0) {
            for (let key of Object.keys(req.files)) {

                if (req.files[key] && req.files[key][0]) {
                    const s3Params = {
                        Key: `talent/${talentId}/${key}_${talentId}.jpg`,
                        Body: req.files[key][0].buffer,
                    };

                    const s3Response = await uploadFile(s3Params);
                    if (s3Response) {
                        avatarUrlKeys = {
                            ...avatarUrlKeys,
                            [key]: s3Response && s3Response.Key
                        }
                    }
                }

            }

            await Talent.UPDATE({
                id: talentId
            }, {
                ...avatarUrlKeys
            });
        }

        return res.status(201).json({
            message: 'Talent profile picture has been updated successfully!'
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
    GetTalent,
    GetTalents,
    TalentSignUp,
    TalentUpdateStatus,
    TalentUpdateAvatar

}