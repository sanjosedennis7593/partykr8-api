import { validationResult } from 'express-validator';

import { TALENT_REGISTRATION_STATUS, TALENT_TYPES } from '../config/constants';
import Table from '../helpers/database';
// import { encryptPassword } from '../helpers/password';
import db from '../models';


const Talent = new Table(db.talents);
const User = new Table(db.users);


const TalentSignUpController = async (req, res, next) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        if(!TALENT_TYPES[req.body.type]) {
            return res.status(400).json({
                message: 'Talent type is not exist!'
            });
        }

        const talent = await Talent.GET({
            where: {
                user_id:  req.user.id
            },
        });

        if(talent && talent.dataValues) {
            return res.status(400).json({
                message: 'You already applied to become a talent'
            });
        }

        const payload = {
            type: req.body.type,
            genre: req.body.genre,
            service_rate: req.body.service_rate,
            address: req.body.address,
            phone_number: req.body.phone_number,
            facebook_url: req.body.facebook_url,
            twitter_url: req.body.twitter_url,
            tiktok_url: req.body.tiktok_url,
            status: TALENT_REGISTRATION_STATUS[req.body.status],
            user_id:  req.user.id,
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


export {
    TalentSignUpController
}