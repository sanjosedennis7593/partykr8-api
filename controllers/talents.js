import { validationResult } from 'express-validator';

import { EVENT_TYPE_RATE_FIELDS, TALENT_STATUS, TALENT_TYPES } from '../config/constants';

import Table from '../helpers/database';
import { sendMessage } from '../helpers/mail';
import { uploadFile } from '../helpers/upload';
import { TALENT_APPROVED_MESSAGE, TALENT_PAYOUT_MESSAGE } from '../helpers/mail_templates';


// import { encryptPassword } from '../helpers/password';
import db from '../models';
import { format } from 'date-fns';

import sequelize, { Op } from 'sequelize';


const EventTalent = new Table(db.event_talents);
const ServicePackage = new Table(db.service_package);
const Talent = new Table(db.talents);
const TalentEventType = new Table(db.talent_event_type);
const TalentUpdateRequest = new Table(db.talent_update_request);
const TalentRatings = new Table(db.talent_ratings);
const TalentPhotos = new Table(db.talent_photos);
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
            'alias',
            'address',
            'city',
            'state',
            'lat',
            'lng',
            'avatar_url_1',
            'birthday_rate_per_day',
            'debut_rate_per_day',
            'wedding_rate_per_day',
            'baptismal_rate_per_day',
            'seminar_rate_per_day',
            'company_party_rate_per_day',
            'school_event_rate_per_day',
            'seminar_rate_per_day',
            'service_type',
            'description',
            'duration',
            'venue_type',
            'led_dimension',
            'area_coverage',
            // 'gcash_no',
            // 'bank_account_no',
            // 'bank_account_name',
            // 'paypal_account'

            'birthday_duration',
            'debut_duration',
            'wedding_duration',
            'baptismal_duration',
            'seminar_duration',
            'company_duration',
            'school_event_duration',
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
        const userId = req.query.user_id || null;
        const serviceType = req.query.service_type || 'any';
        const globalMode = req.query.global_mode;

        let distanceOptions = (latitude && longitude) ? getDistance(latitude, longitude, globalMode ? false : true) : {};


        let status = req.query.status || 'approved';
        let eventRateField = serviceType === 'talent' && EVENT_TYPE_RATE_FIELDS[req.query.event_type];
        let customEventTypeFilter = null;

        // let queries = {};
        let userQueries = {};


        let filters = Object.keys(req.query).reduce((accum, key) => {
            if (
                key !== 'lat' &&
                key !== 'lng' &&
                key !== 'status' &&
                key !== 'gender' &&
                key !== 'address' &&
                key !== 'event_type' &&
                key !== 'global_mode' &&
                key !== 'country'
            ) {

                if (key === 'equipment_provided' && req.query[key] === 'both' || (key === 'service_type' && serviceType === 'any')) {
                    return {
                        ...accum
                    }
                }
            
                return {
                    ...accum,
                    [key]: req.query[key]
                }
            }

            return accum;
        }, {});


        if(serviceType === 'any') {

        }
        else {
            if (eventRateField && serviceType === 'talent') {
                filters = {
                    ...filters,
                    [eventRateField]: {
                        [Op.gt]: 0,
    
                    }
                }
            }
            else if (!eventRateField && req.query.event_type && serviceType === 'talent') {
                customEventTypeFilter = {
                    event_type: req.query.event_type,
                    amount: {
                        [Op.gt]: 0
                    }
                }
            }
        }



        if (req.query.gender) {
            if (req.query.gender !== 'both') {
                userQueries = {
                    ...userQueries,
                    gender: req.query.gender
                }
            }

        }

        if (req.query.country) {
            userQueries = {
                ...userQueries,
                country: req.query.country
            }
        }

        let whereClause = status === 'all' ? {} : {
            where: {
                ...filters,
                status
            }
        };

        if (userId) {
            if (whereClause && whereClause.where) {
                whereClause = {
                    ...whereClause,
                    where: {
                        ...whereClause.where,
                        user_id: {
                            [Op.not]: userId
                        }
                    }
                }
            }
        }

        
        // console.log('whereClause', whereClause)
        // console.log('whereClause distanceOptions', distanceOptions)
        const talents = await Talent.GET_ALL({
            ...distanceOptions,
            ...whereClause,
            include: [
                {
                    model: db.users,
                    where: {
                        ...userQueries
                    },
                    attributes: [
                        'email',
                        'lastname',
                        'firstname',
                        'avatar_url',
                    ]
                },
                {
                    model: db.talent_event_type,
                    ...(customEventTypeFilter ? {
                        where: {
                            ...customEventTypeFilter
                        }
                    } : {})
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
                        'avatar_url',

                    ]
                },
                {
                    model: db.talent_event_type
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
                {
                    model: db.service_package
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

        // if (!TALENT_TYPES[req.body.type]) {
        //     return res.status(400).json({
        //         message: 'Talent type is not exist!'
        //     });
        // }

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
            alias: req.body.alias,
            genre: req.body.genre,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            phone_number: req.body.phone_number,
            facebook_url: req.body.facebook_url,
            instagram_url: req.body.instagram_url,
            twitter_url: req.body.twitter_url,
            tiktok_url: req.body.tiktok_url,
            youtube_url: req.body.youtube_url,
            status: TALENT_STATUS[req.body.status],
            user_id: req.user.id,
            commission_rate: req.body.commission_rate,
            status: TALENT_STATUS.pending,
            gcash_no: req.body.gcash_no,
            lat: req.body.lat,
            lng: req.body.lng,
            equipment_provided: req.body.equipment_provided,
            venue_type: req.body.venue_type,
            area_coverage: req.body.area_coverage,
            service_type: req.body.service_type,
            description: req.body.description,
            birthday_rate_per_day: req.body.birthday_rate_per_day || 0,
            debut_rate_per_day: req.body.debut_rate_per_day || 0,
            wedding_rate_per_day: req.body.wedding_rate_per_day || 0,
            baptismal_rate_per_day: req.body.baptismal_rate_per_day || 0,
            seminar_rate_per_day: req.body.seminar_rate_per_day || 0,
            company_party_rate_per_day: req.body.company_party_rate_per_day || 0,
            school_event_rate_per_day: req.body.school_event_rate_per_day || 0,
            duration: req.body.duration || 0,
            led_dimension: req.body.led_dimension || '',
            bank_account_no: req.body.bank_account_no,
            bank_account_name: req.body.bank_account_name,
            paypal_account: req.body.paypal_account,


            birthday_duration: req.body.birthday_duration || '',
            debut_duration: req.body.debut_duration || '',
            wedding_duration: req.body.wedding_duration || '',
            baptismal_duration: req.body.baptismal_duration || '',
            seminar_duration: req.body.seminar_duration || '',
            company_duration: req.body.company_duration || '',
            school_event_duration: req.body.school_event_duration || '',

        };

        const currentTalent = await Talent.CREATE({
            ...payload
        });


        if (req.body.service_type === 'partners' && currentTalent) {
            if (req.body.service_package && req.body.service_package.length > 0) {
                let servicePackage = JSON.parse(req.body.service_package);
                servicePackage = servicePackage.map(item => {
                    return {
                        ...item,
                        talent_id: currentTalent.id
                    }
                })

                await ServicePackage.CREATE_MANY(servicePackage);
            }
        }
        else if (req.body.service_type === 'talent' && currentTalent) {
            if (req.body.talent_event_type && req.body.talent_event_type.length > 0) {
                let talentEventType = JSON.parse(req.body.talent_event_type);
                talentEventType = talentEventType.map(item => {
                    return {
                        ...item,
                        talent_id: currentTalent.id
                    }
                })

                await TalentEventType.CREATE_MANY(talentEventType);
            }
        }

        let avatarUrlKeys = {};
        if (Object.keys(req.files).length > 0) {
            for (let key of Object.keys(req.files)) {
                if (key === 'talent_photos[]') {

                    if (req.files[key]) {
                        let idIndex = 1;

                        for (let item of req.files[key]) {
                            const s3Params = {
                                Key: `talent/${currentTalent.id}/talent_photos/${idIndex}_${currentTalent.id}.jpg`,
                                Body: item.buffer,
                            };

                            const s3Response = await uploadFile(s3Params);
                            if (s3Response) {
                                await TalentPhotos.CREATE({
                                    talent_id: currentTalent.id,
                                    photo_url: s3Response.Key
                                })
                            }
                            idIndex++;
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
                                await TalentValidIds.CREATE({
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
            return res.status(400).json({ message: 'Talent does not exist!' });
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
                        'id',
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

        if (talentUser && talentUser.dataValues && talentUser.dataValues.user) {

            await User.UPDATE(
                {
                    id: talentUser.dataValues.user.id
                },
                {
                    role: 'talent'
                }
            );
        }
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
            return res.status(400).json({ message: 'Talent does not exist!' });
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
                                'avatar_url'
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
            alias,
            address,
            city,
            state,
            lat,
            lng,
            type,
            genre,
            gcash_no,
            phone_number,
            commission_rate,
            equipment_provided,
            venue_type,
            area_coverage,
            service_type,
            description,
            birthday_rate_per_day = 0,
            debut_rate_per_day = 0,
            wedding_rate_per_day = 0,
            baptismal_rate_per_day = 0,
            seminar_rate_per_day = 0,
            company_party_rate_per_day = 0,
            school_event_rate_per_day = 0,
            birthday_duration = '',
            debut_duration = '',
            wedding_duration = '',
            baptismal_duration = '',
            seminar_duration = '',
            company_duration = '',
            school_event_duration = '',
            duration = 2,
            led_dimension,
            facebook_url,
            instagram_url,
            twitter_url,
            tiktok_url,
            youtube_url,
            talent_event_types,

            bank_account_no,
            bank_account_name,
            paypal_account

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
            alias,
            address,
            city,
            state,
            lat,
            lng,
            type,
            genre,
            gcash_no,
            phone_number,
            commission_rate,
            equipment_provided,
            venue_type,
            area_coverage,
            service_type,
            description,
            birthday_rate_per_day,
            debut_rate_per_day,
            wedding_rate_per_day,
            baptismal_rate_per_day,
            seminar_rate_per_day,
            company_party_rate_per_day,
            school_event_rate_per_day,

            birthday_duration,
            debut_duration,
            wedding_duration,
            baptismal_duration,
            seminar_duration,
            company_duration,
            school_event_duration,
            duration,
            facebook_url,
            instagram_url,
            twitter_url,
            tiktok_url,
            youtube_url,
            led_dimension,
            talent_event_types,

            bank_account_no,
            bank_account_name,
            paypal_account,

            status: 'pending'
        });

        return res.status(201).json({
            message: 'Your details request has been sent to the admin. It is subject to approval!'
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
                    alias: currentRequest.alias,
                    genre: currentRequest.genre,
                    private_fee: currentRequest.private_fee,
                    address: currentRequest.address,
                    city: currentRequest.city,
                    state: currentRequest.state,
                    lat: currentRequest.lat,
                    lng: currentRequest.lng,
                    commission_rate: currentRequest.commission_rate,
                    gcash_no: currentRequest.gcash_no,
                    description: currentRequest.description,
                    birthday_rate_per_day: currentRequest.birthday_rate_per_day,
                    debut_rate_per_day: currentRequest.debut_rate_per_day,
                    wedding_rate_per_day: currentRequest.wedding_rate_per_day,
                    baptismal_rate_per_day: currentRequest.baptismal_rate_per_day,
                    seminar_rate_per_day: currentRequest.seminar_rate_per_day,
                    company_party_rate_per_day: currentRequest.company_party_rate_per_day,
                    school_event_rate_per_day: currentRequest.school_event_rate_per_day,

                    birthday_duration: currentRequest.birthday_duration,
                    debut_duration: currentRequest.debut_duration,
                    wedding_duration: currentRequest.wedding_duration,
                    baptismal_duration: currentRequest.baptismal_duration,
                    seminar_duration: currentRequest.seminar_duration,
                    company_duration: currentRequest.company_duration,
                    school_event_duration: currentRequest.school_event_duration,

                    duration: currentRequest.duration, // DEPRECATED
                    facebook_url: currentRequest.facebook_url,
                    instagram_url: currentRequest.instagram_url,
                    twitter_url: currentRequest.twitter_url,
                    tiktok_url: currentRequest.tiktok_url,
                    youtube_url: currentRequest.youtube_url,
                    led_dimension: currentRequest.led_dimension,

                    bank_account_no: currentRequest.bank_account_no,
                    bank_account_name: currentRequest.bank_account_name,
                    paypal_account: currentRequest.paypal_account,
                });

                if (currentRequest && currentRequest.talent_event_types) {
                    const eventTalentTypes = JSON.parse(currentRequest.talent_event_types);
                    if (eventTalentTypes && eventTalentTypes.event_type) {
                        await TalentEventType.UPSERT_MANY('talent_event_type_id', eventTalentTypes.event_type)
                    }
                    if (eventTalentTypes && eventTalentTypes.deleted_event_type_ids) {
                        for (let id of eventTalentTypes.deleted_event_type_ids) {
                            await TalentEventType.DELETE(
                                {
                                    talent_event_type_id: id
                                }
                            )
                        }
                    };

                }



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
                                            'avatar_url'
                                        ]
                                    },
                                    {
                                        model: db.talent_event_type
                                    },

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


const CreateTalentRating = async (req, res, next) => {
    try {

        const {
            ratings = []
        } = req.body;


        if (ratings.length === 0) {
            return res.status(400).json({ message: 'Invalid Request' });
        }

        const talentRatings = await TalentRatings.CREATE_MANY(ratings);

        return res.status(201).json({
            data: talentRatings
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

const GetTalentRatings = async (req, res, next) => {
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: 'Invalid Request'
            });
        };

        const talentRatings = await TalentRatings.GET_ALL({
            where: {
                talent_id: id
            },

            include: [
                {
                    model: db.users,
                    attributes: [
                        'email',
                        'lastname',
                        'firstname',
                        'avatar_url'
                    ]
                },
            ]
        });

        return res.status(201).json({
            ratings: talentRatings
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


const GetServiceCounts = async (req, res, next) => {
    try {
        let serviceCount = {};


        for (let key in TALENT_TYPES) {
            const count = await Talent.COUNT({
                type: key,
                status: 'approved'
            });
            serviceCount = {
                ...serviceCount,
                [key]: count
            }

        }




        return res.status(200).json({
            counts: serviceCount
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


const GetTalentPayout = async (req, res, next) => {

    try {
        const { talent_id } = req.params;

        const eventTalents = await EventTalent.GET_ALL({
            where: {
                talent_id
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
                                                'avatar_url'
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
            talent_payouts: eventTalents
        });

    }
    catch (err) {
        console.log('Error', err)
        return res.status(400).json({
            error: err.code,
            message: err.message,
        });
    }

}

const UpdateTalentPayout = async (req, res, next) => {

    try {
        const { event_id, talent_id, payout_received = 0 } = req.body;


        if (payout_received > 1 || payout_received < 0) {
            return res.status(400).json({
                message: 'Invalid Value'
            });
        }
        await EventTalent.UPDATE({
            event_id,
            talent_id
        }, {
            payout_received
        });

        const currentEventTalent = await EventTalent.GET({
            where: {
                event_id,
                talent_id
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
                        }
                    ]
                },
                {
                    model: db.talents,
                    include: [
                        {
                            model: db.users,
                            attributes: {
                                exclude: ['password']
                            }
                        }
                    ]
                },
            ]
        });

        if (currentEventTalent && currentEventTalent.dataValues && payout_received) {

            const event = currentEventTalent.dataValues.event && currentEventTalent.dataValues.event.dataValues;
            const talent = currentEventTalent.dataValues.talent && currentEventTalent.dataValues.talent.dataValues;


            const formattedDate = format(new Date(event.date), 'yyyy-MM-dd');
            const formattedStartTime = format(new Date(`${formattedDate} ${event.start_time}`), 'hh:mm a')
            const formattedEndTime = format(new Date(`${formattedDate} ${event.end_time}`), 'hh:mm a')



            await sendMessage({
                to: [talent.user.email],
                subject: `PartyKr8: Talent Payout`,
                html: TALENT_PAYOUT_MESSAGE({
                    talent,
                    event: {
                        ...event,
                        date: formattedDate,
                        start_time: formattedStartTime,
                        end_time: formattedEndTime,
                    }
                })
            });

        }




        const events = await EventTalent.GET_ALL({
            where: {
                event_id
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
                                                'avatar_url'
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

        return res.status(201).json({
            message: 'Event talent payout has been updated successfully!',
            event_talents: events
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

const TalentPackageUpdate = async (req, res, next) => {
    try {

        const { packages = [], deleted_package_ids = [] } = req.body;

        const currentTalentId = req.user && req.user.talent && req.user.talent.dataValues && req.user.talent.dataValues.id;

        const updatedPackages = packages.map(item => {
            return {
                ...item,
                talent_id: currentTalentId
            }
        })

        if (updatedPackages && updatedPackages.length > 0) {
            await ServicePackage.UPSERT_MANY('service_package_id', updatedPackages)
        }

        if (deleted_package_ids && deleted_package_ids.length > 0) {
            for (let id of deleted_package_ids) {
                await ServicePackage.DELETE(
                    {
                        service_package_id: id
                    }
                )
            }
        };


        const talentPackages = await ServicePackage.GET_ALL({
            where: {
                talent_id: currentTalentId
            }
        })



        return res.status(200).json({
            packages: talentPackages
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

const TalentEventTypeUpdate = async (req, res, next) => {
    try {
        const { event_type = [], deleted_event_type_ids = [] } = req.body;
        const currentTalentId = req.user && req.user.talent && req.user.talent.dataValues && req.user.talent.dataValues.id;

        const updatedEventType = event_type.map(item => {
            return {
                ...item,
                talent_id: currentTalentId
            }
        });

        if (updatedEventType && updatedEventType.length > 0) {
            await TalentEventType.UPSERT_MANY('talent_event_type_id', updatedEventType)
        }

        if (deleted_event_type_ids && deleted_event_type_ids.length > 0) {
            for (let id of deleted_event_type_ids) {
                await TalentEventType.DELETE(
                    {
                        talent_event_type_id: id
                    }
                )
            }
        };


        const talentPackages = await TalentEventType.GET_ALL({
            where: {
                talent_id: currentTalentId
            }
        })



        return res.status(201).json({
            event_type: talentPackages
        });

    }
    catch (err) {
        console.log('Error', err)
        return res.status(400).json({
            error: err.code,
            message: err.message,
        });
    }

}


const GetTalentLocations = async (req, res, next) => {

    try {
        const country = req.query.country || null;
        const lat = req.query.lat || null;
        const lng = req.query.lng || null;

        let talentUsers = [];
        if (!country && !lat && !lng) {
            talentUsers = await User.GET_ALL({
                attributes: {
                    exclude: ['password']
                },
                where: {
                    role: 'talent'
                },
                include: [
                    {
                        model: db.talents,
                    }
                ]
            });
        }
        else {

            const distanceOptions = getDistance(lat, lng, true);
            //  
            talentUsers = await User.GET_ALL({
                attributes: {
                    exclude: ['password']
                },
                where: {
                    country,
                    role: 'talent'
                },
                include: [
                    {
                        model: db.talents,
                        ...distanceOptions

                    }
                ]
            })
        }


        talentUsers = talentUsers.map(user => {
            return {
                lat: user.dataValues.talent && user.dataValues.talent.dataValues.lat,
                lng: user.dataValues.talent && user.dataValues.talent.dataValues.lng,
                address: user.dataValues.talent && user.dataValues.talent.dataValues.address,
                city: user.dataValues.talent && user.dataValues.talent.dataValues.city,
                state: user.dataValues.talent && user.dataValues.talent.dataValues.state,
                country: user.dataValues.country
            }
        });



        return res.status(200).json({
            talent_locations: talentUsers
        })


    } catch (err) {
        console.log('Err', err)
        return res.status(400).json({
            error: err.code,
            message: err.message,
        });
    }

};

export {
    GetTalent,
    GetTalents,
    GetTalentEvents,
    GetTalentDetailsRequest,
    TalentSignUp,
    TalentUpdateStatus,
    TalentUpdateAvatar,
    CreateTalentDetailsRequest,
    UpdateTalentDetailsRequest,
    CreateTalentRating,
    GetTalentRatings,
    GetServiceCounts,
    UpdateTalentPayout,
    GetTalentPayout,
    TalentPackageUpdate,
    TalentEventTypeUpdate,
    GetTalentLocations
}