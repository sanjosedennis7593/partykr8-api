// import { validationResult } from 'express-validator';

import { EVENT_STATUS, TALENT_STATUS } from '../config/constants';
import Table from '../helpers/database';
import { sendMessage } from '../helpers/mail';
import { MAIL_USER_TEMPLATE } from '../helpers/templates';
import db from '../models';


const Event = new Table(db.events);
const EventGuest = new Table(db.event_guests);
const EventTalent = new Table(db.event_talents);

const WITH_USERS_AND_TALENTS = {
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
};


const GetEvents = async (req, res, next) => {
    try {
        const events = await Event.GET_ALL({
            ...WITH_USERS_AND_TALENTS
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

const GetEvent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const event = await Event.GET({
            where: {
                id
            },
            ...WITH_USERS_AND_TALENTS
        });

        return res.status(200).json({
            data: event
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
        if (talents.length > 0) {
            await EventTalent.CREATE_MANY(talents);
        }

        await sendMessage({
            to: req.body.guests,
            subject: `PartyKr8 Event: ${req.body.title}`,
            html: MAIL_USER_TEMPLATE({
                title: req.body.title,
                message_to_guest: req.body.message_to_guest
            })
        });

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


const UpdateEventDetails = async (req, res, next) => {
    try {
        const guests = req.body.guests || [];
        const removedGuests = req.body.removed_guests || [];
        let eventPayload = {
            event_id: req.body.event_id,
            user_id: req.user.id,
            title: req.body.title,
            location: req.body.location,
            date: req.body.date,
            time: req.body.time,
            message_to_guest: req.body.message_to_guest
        };


        await Event.UPDATE({
            id: eventPayload.event_id,
            user_id: req.user.id,
        }, {
            title: eventPayload.title,
            location: eventPayload.location,
            date: eventPayload.date,
            time: eventPayload.time,
            message_to_guest: eventPayload.message_to_guest
        });

        for(let guest of guests) {
            await EventGuest.UPSERT(
                {
                    email: guest,
                    event_id: eventPayload.event_id
                },
                {
                    email: guest,
                    event_id: eventPayload.event_id
                }
            )
        }

        for(let guest of removedGuests) {
            await EventGuest.DELETE(
                {
                    email: guest,
                    event_id: eventPayload.event_id
                },
                db.b
            )
        }

        // if (talents.length > 0) {
        //     await EventTalent.CREATE_MANY(talents);
        // }

        
        const event = await Event.GET({
            where: {
                id: req.body.event_id,
                user_id: req.user.id,
            },
            ...WITH_USERS_AND_TALENTS
        });


        return res.status(200).json({
            data: event
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
        if (!TALENT_STATUS[req.body.status]) {
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

const UpdateEventStatus = async (req, res, next) => {
    try {

        if (!EVENT_STATUS[req.body.status]) {
            return res.status(400).json({ errors: "Invalid Status" });
        }

        await Event.UPDATE(
            {
                id: req.body.event_id,
                user_id: req.user.id
            },
            {
                status: req.body.status
            }
        );

        const event = await Event.GET({
            where: {
                id: req.body.event_id,
                user_id: req.user.id,
            },
            ...WITH_USERS_AND_TALENTS
        });

        return res.status(200).json({
            message: "Status has been updated successfully!",
            data: event
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
    GetEvent,
    GetEvents,
    UpdateEventDetails,
    UpdateEventTalentStatus,
    UpdateEventStatus
};