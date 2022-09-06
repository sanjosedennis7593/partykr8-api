// import { validationResult } from 'express-validator';

import { TALENT_STATUS } from '../config/constants';
import Table from '../helpers/database';
import db from '../models';


const Event = new Table(db.events);
const EventGuest = new Table(db.event_guests);
const EventTalent = new Table(db.event_talents);

const GetEvents = async (req, res, next) => {
    try {
        const events = await Event.GET_ALL({
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
                    model: db.event_guests
                },
                {
                    model: db.event_talents,
                    include: [
                        {
                            model: db.talents
                        }
                    ]
                },
            ]
        })
        return res.status(200).json({
            data: events
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


const CreateEvents = async (req, res, next) => {
    try {
        let event = {
            user_id: req.user.id,
            title: req.body.title,
            location: req.body.location,
            date: req.body.date,
            time: req.body.time,
            message_to_guest: req.body.message_to_guest
        };
        const response = await Event.CREATE({
            ...event
        });

        const guests = req.body.guests && response && response.id ? req.body.guests.map(guest => {
            return {
                email: guest,
                event_id: response.id
            }
        }) : [];
        const talents = req.body.talents && response && response.id ? req.body.talents.map(talentId => {
            return {
                talent_id: talentId,
                event_id: response.id
            }
        }) : [];

        if (guests.length > 0) {
            await EventGuest.CREATE_MANY(guests, {
                ignoreDuplicates: true,
            });
        }

        console.log('talents',talents)
        if (talents.length > 0) {
            await EventTalent.CREATE_MANY(talents);
        }


        return res.status(200).json({
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

const UpdateEventTalentStatus = async (req, res, next) => {
    try {
        if(!TALENT_STATUS[req.body.status]) {
            return res.status(400).json({ errors: "Invalid Status" });
        }

        await EventTalent.UPDATE(
            {
                event_id: req.body.event_id,
                talent_id: req.body.talent_id
            },
            {
                status: req.body.status
            }
        );


        return res.status(200).json({
            message: "Status has been updated successfully!"
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
    CreateEvents,
    GetEvents,
    UpdateEventTalentStatus
};