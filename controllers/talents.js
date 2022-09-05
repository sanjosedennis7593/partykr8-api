import { validationResult } from 'express-validator';

import { TALENT_REGISTRATION_STATUS, TALENT_TYPES } from '../config/constants';
import Table from '../helpers/database';
// import { encryptPassword } from '../helpers/password';
import db from '../models';


const Talent = new Table(db.talents);



const GetTalents = async (req, res, next) => {
    try {
        const talents = await Talent.GET_ALL({
            include: [
                {
                    model: db.users,
                    attributes: [
                        'email',
                        'lastname',
                        'firstname',
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


const TalentSignUpController = async (req, res, next) => {
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
            status: TALENT_REGISTRATION_STATUS[req.body.status],
            user_id: req.user.id,
            status: TALENT_REGISTRATION_STATUS.pending
        };

        await Talent.CREATE({
            ...payload
        });

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

        if(!TALENT_REGISTRATION_STATUS[req.body.status]) {
            return res.status(400).json({ message: 'Invalid Status!' });
        }
        const talent = await Talent.GET({
            where: {
                id:  req.body.id
            },
        });


        if(!talent) {
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

        return res.status(201).json({
            message: 'Talent application has been updated successfully!'
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
    GetTalents,
    TalentSignUpController,
    TalentUpdateStatus
}