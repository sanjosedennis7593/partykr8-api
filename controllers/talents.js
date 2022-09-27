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


const EventTalent = new Table(db.event_talents);
const Talent = new Table(db.talents);
const TalentUpdateRequest = new Table(db.talent_update_request);
const TalentValidIds = new Table(db.talent_valid_ids);
const User = new Table(db.users);

const getDistance = (latitude, longitude, hasDistanceClause = false) => {

    const distance = 30; //  WITHIN 30KM
    let distanceOptions = {};

    let haversine = `(
        6371 * acos(
            cos(radians(${latitude}))
            * cos(radians(talents.lat))
            * cos(radians(talents.lng) - radians(${longitude}))
            + sin(radians(${latitude})) * sin(radians(talents.lat))
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

    };

    if (hasDistanceClause) {
        distanceOptions = {
            ...distanceOptions,
            having: sequelize.literal(`distance <= ${distance}`),
        }
    }

    return distanceOptions;
}
const GetTalents = async (req, res, next) => {
    try {
    
        const latitude = req.query.lat || null;
        const longitude = req.query.lng || null;
        let distanceOptions = (latitude && longitude) ? getDistance(latitude, longitude, true) : {};
        let status = req.query.status || 'approved';

        let whereClause = status === 'all' ? {} : { where: status }

        const talents = await Talent.GET_ALL({
            ...distanceOptions,
            ...whereClause,
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
        const latitude = req.query.lat || null;
        const longitude = req.query.lng || null;

        let distanceOptions = (latitude && longitude) ? getDistance(latitude, longitude) : {};

        let talent = await Talent.GET({
            where: {
                id,
                status: 'approved'
            },
            ...distanceOptions,

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
            schedule: talent && talent.dataValues && talent.dataValues.event_talents.map(item => {
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
                if (key !== 'valid_ids[]') {
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

        // const talentUser = await User.GET({
        //     id: talent.user_id
        // })

        const talentUser = await Talent.GET({
            where: {
                id: req.body.id
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
        });
        if (talentUser && talentUser.dataValues && req.body.status === TALENT_STATUS.approved) {
            await sendMessage({
                to: talentUser.dataValues.user.email,
                subject: `Talent Application Approved`,
                html: TALENT_APPROVED_MESSAGE({
                    user: talentUser.dataValues.user
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



const GetTalentDetailsRequest = async (req, res, next) => {
    try {
        const status = req.query.status || null;
 
        const whereClause = status ? {
            where: {
                status
            }
        } : {};
        const TalentDetailsRequest = await TalentUpdateRequest.GET_ALL({
            ...whereClause,
            include: [
                {
                    model: db.talents,
                    include: [
                        {
                            model: db.users,
                            attributes: [
                                'email',
                                'lastname',
                                'firstname',
                            ]
                        }
                    ]
                }
            ]
        });


        return res.status(200).json({
            talent_request: TalentDetailsRequest || []
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


const CreateTalentDetailsRequest = async (req, res, next) => {
    try {
        const {
            talent_id,
            service_rate,
            service_rate_type,
            private_fee,
            address,
            lat,
            lng,
            type,
            genre,
            gcash_no
        } = req.body;
        const curentRequest = await TalentUpdateRequest.GET({
            where: {
                talent_id,
                status: 'pending'
            }
        });

        if (curentRequest) {
            return res.status(400).json({ message: 'You have a pending details request.' });
        }

        await TalentUpdateRequest.CREATE({
            talent_id,
            address,
            lat,
            lng,
            type,
            genre,
            service_rate,
            service_rate_type,
            private_fee,
            gcash_no,
            status: 'pending'
        });

        return res.status(201).json({
            message: 'Your details request has been sent to the admin for approval!'
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

const UpdateTalentDetailsRequest = async (req, res, next) => {

    try {
        const { talent_request_id, talent_id, status, gcash_no } = req.body;
        const currentRequest = await TalentUpdateRequest.GET({
            where: {
                talent_id,
                status: 'pending',
                talent_request_id
            }
        });



        if (currentRequest) {
            await TalentUpdateRequest.UPDATE({
                talent_id,
                talent_request_id
            }, {
                status
            });

            if (status === 'approved') {
                await Talent.UPDATE({
                    id: talent_id
                }, {
                    type: currentRequest.type,
                    genre: currentRequest.genre,
                    private_fee: currentRequest.private_fee,
                    address: currentRequest.address,
                    lat: currentRequest.lat,
                    lng: currentRequest.lng,
                    service_rate: currentRequest.service_rate,
                    service_rate_type: currentRequest.service_rate_type,
                    private_fee: currentRequest.private_fee,
                    gcash_no: currentRequest.gcash_no
                });

            }

            let talent = await Talent.GET({
                where: {
                    id: talent_id,
                    status: 'approved'
                },
            });


            return res.status(201).json({
                message: 'Talent detail request has been updated successfully!',
                data: talent
            });

        };

        return res.status(404).json({
            message: 'Request not found'
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

const GetTalentEvents = async (req, res, next) => {
    const { id } = req.params;
    const events = await EventTalent.GET_ALL({
        where: {
            talent_id: id
        },
        include: [

            {
                model: db.events,
                include: [
                    {
                        model: db.users,
                        attributes: {
                            exclude: ['password']
                        }
                    },
                    {
                        model: db.event_guests
                    },
                    {
                        model: db.event_talents,
                        attributes: [
                            'status',
                        ],
                        include: [
                            {
                                model: db.talents,
                                include: [
                                    {
                                        model: db.users,
                                        attributes: [
                                            'email',
                                            'lastname',
                                            'firstname',
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                ]
            }
        ]
    });


    return res.status(200).json({
        data: events
    });
}

export {
    GetTalent,
    GetTalents,
    GetTalentEvents,
    GetTalentDetailsRequest,
    TalentSignUp,
    TalentUpdateStatus,
    TalentUpdateAvatar,
    CreateTalentDetailsRequest,
    UpdateTalentDetailsRequest
}