// import { validationResult } from 'express-validator';
import sequelize, { Op } from 'sequelize';
import { format, isAfter, isBefore, isEqual, differenceInHours } from 'date-fns';

import { EVENT_STATUS, TALENT_STATUS } from '../config/constants';
import Table from '../helpers/database';
import { sendMessage } from '../helpers/mail';
import { EVENT_INVITE_MESSAGE, TALENT_INVITATION_MESSAGE } from '../helpers/mail_templates';
import db from '../models';


const Event = new Table(db.events);
const EventGuest = new Table(db.event_guests);
const EventTalent = new Table(db.event_talents);
const Talent = new Table(db.talents);
const User = new Table(db.users);

const WITH_USERS_AND_TALENTS = {
    include: [
        {
            model: db.users,
            attributes: [
                'id',
                'email',
                'lastname',
                'firstname',
                'avatar_url'
            ]
        },
        {
            model: db.event_guests
        },
        {
            model: db.event_refund
        },
        {
            model: db.event_payments,
            attributes: [
                'amount',
                'payment_type',
                'payment_id'
            ]
        },
        {
            model: db.event_talents,
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
                }
            ]
        },
    ]
};


const GetEvents = async (req, res, next) => {
    try {

        const events = await Event.GET_ALL({
            where: {
                user_id: req.user.id,
            },
            order: [['date', 'asc']],
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

const GetAllEventsByStatus = async (req, res, next) => {
    try {

        const events = await Event.GET_ALL({
            where: {
                status: req.params.status,
            },
            order: [['date', 'asc']],
            ...WITH_USERS_AND_TALENTS
        })

        return res.status(200).json({
            events: events
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
            type: req.body.type,
            location: req.body.location,
            date: req.body.date,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            message_to_guest: req.body.message_to_guest
        };

        const createdEventDateTimeStart = new Date(`${event.date} ${event.start_time}`);
        const createdEventDateTimeEnd = new Date(`${event.date} ${event.end_time}`);



        const user = await User.GET({
            id: req.user.id
        });

        const talentIds = req.body.talents.map(talent => talent.id);

        const talentUsers = req.body.talents && req.body.talents.length > 0 ? await Talent.GET_ALL({
            where: {
                id: { [Op.in]: talentIds }
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
                    model: db.event_talents,
                    include: [
                        {
                            model: db.events,
                            attributes: [
                                'id',
                                'title',
                                'location',
                                'date',
                                'start_time',
                                'end_time',
                                'status',
                            ]
                        }
                    ]
                }
            ]
        }) : [];

        const hasScheduleConflict = talentUsers ? talentUsers.some(item => {

            return item.event_talents.find(eventTalent => {


                const currentEventDateTimeStart = new Date(`${format(eventTalent.event.date, 'yyyy-MM-dd')} ${eventTalent.event.start_time}`);
                const currentEventDateTimeEnd = new Date(`${format(eventTalent.event.date, 'yyyy-MM-dd')} ${eventTalent.event.end_time}`)


                let isConflict = false;

                if (
                    (isEqual(createdEventDateTimeStart, currentEventDateTimeStart)) ||
                    (isAfter(createdEventDateTimeStart, currentEventDateTimeStart) && isBefore(createdEventDateTimeStart, currentEventDateTimeEnd))
                ) {
                    console.log('start date is between the 2 dates');
                    isConflict = true;
                }

                if (
                    (isEqual(createdEventDateTimeEnd, currentEventDateTimeEnd)) ||
                    (isAfter(createdEventDateTimeEnd, currentEventDateTimeStart) && isBefore(createdEventDateTimeEnd, currentEventDateTimeEnd))

                ) {
                    console.log('start end is between the 2 dates');
                    isConflict = true;
                }

                return format(eventTalent.event.date, 'yyyy-MM-dd') === event.date && isConflict
            })
        }) : [];


        if (hasScheduleConflict) {
            return res.status(400).json({
                hasScheduleConflict,
                message: 'Talent has a conflict schedule'
            });
        }
        // else {
        //     return res.status(400).json({
        //         hasScheduleConflict
        //     });
        // }

        const response = await Event.CREATE({
            ...event
        });


        const guests = req.body.guests && response && response.id ? req.body.guests.map(guest => {
            return {
                email: guest,
                event_id: response.id
            }
        }) : [];
        const talents = req.body.talents && response && response.id ? req.body.talents.map(talent => {
            return {
                talent_id: talent.id,
                service_rate: talent.service_rate,
                private_fee: talent.private_fee,
                event_id: response.id
            }
        }) : [];



        const talentEmails = talentUsers ? talentUsers.map(talent => talent.user.email) : [];

        if (guests.length > 0) {
            await EventGuest.CREATE_MANY(guests, {
                ignoreDuplicates: true,
            });
        }
        if (talents.length > 0) {
            await EventTalent.CREATE_MANY(talents);
        }

        if (req.body.send_invite_after_create) {

            await sendMessage({
                to: req.body.guests,
                subject: `PartyKr8 Event: ${req.body.title}`,
                html: EVENT_INVITE_MESSAGE({
                    title: req.body.title,
                    type: req.body.type,
                    message_to_guest: req.body.message_to_guest,
                    location: req.body.location,
                    date: req.body.date,
                    start_time: req.body.start_time,
                    end_time: req.body.end_time,
                    user
                })
            });
        }


        await sendMessage({
            to: talentEmails,
            subject: `Talent Invitation`,
            html: TALENT_INVITATION_MESSAGE({
                title: req.body.title,
                location: req.body.location,
                date: req.body.date,
                start_time: req.body.start_time,
                end_time: req.body.end_time,
                user
            })
        });

        return res.status(200).json({
            message: 'Event has been created successfully!',
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
        // const guests = req.body.guests || [];
        // const removedGuests = req.body.removed_guests || [];
        let eventPayload = {
            event_id: req.body.event_id,
            user_id: req.user.id,
            title: req.body.title,
            type: req.body.type,
            location: req.body.location,
            date: req.body.date,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            message_to_guest: req.body.message_to_guest
        };

        await Event.UPDATE({
            id: eventPayload.event_id,
            user_id: req.user.id,
        }, {
            title: eventPayload.title,
            type: eventPayload.type,
            location: eventPayload.location,
            date: eventPayload.date,
            start_time: eventPayload.start_time,
            end_time: eventPayload.end_time,
            // message_to_guest: eventPayload.message_to_guest
        });

        // for (let guest of guests) {
        //     await EventGuest.UPSERT(
        //         {
        //             email: guest,
        //             event_id: eventPayload.event_id
        //         },
        //         {
        //             email: guest,
        //             event_id: eventPayload.event_id
        //         }
        //     )
        // }

        // for (let guest of removedGuests) {
        //     await EventGuest.DELETE(
        //         {
        //             email: guest,
        //             event_id: eventPayload.event_id
        //         }
        //     )
        // }

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

        const { status } = req.body;

        await Event.UPDATE(
            {
                id: req.body.event_id,
                user_id: req.user.id
            },
            {
                status: status
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



const SendEventInvite = async (req, res, next) => {
    try {

        const { event_id, custom_message, guests, removed_guests, send_invite = false } = req.body;
        const user = await User.GET({
            id: req.user.id
        });



        for (let guest of guests) {
            await EventGuest.UPSERT(
                {
                    email: guest,
                    event_id: event_id
                },
                {
                    email: guest,
                    event_id: event_id
                }
            )
        }

        for (let guest of removed_guests) {
            await EventGuest.DELETE(
                {
                    email: guest,
                    event_id: event_id
                }
            )
        }

        const event = await Event.GET({
            where: {
                id: event_id
            },
            ...WITH_USERS_AND_TALENTS
        });

    
        if (send_invite) {
            await sendMessage({
                to: guests,
                subject: `PartyKr8 Event: ${event.title}`,
                html: EVENT_INVITE_MESSAGE({
                    title: event.title,
                    type: event.type,
                    message_to_guest: custom_message || req.body.message_to_guest,
                    location: event.location,
                    date: event.date,
                    start_time: event.start_time,
                    end_time: event.end_time,
                    user
                })
            });

        }


        // EventGuest
        return res.status(200).json({
            message: "Guest has been updated successfully",
            guests,
            event,
            custom_message
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


const GetJoinedEvents = async (req, res, next) => {
    try {
        console.log('response email', email)
        if (!req.query.email) {
            return res.status(400).json({
                message: 'Email parameter is required'
            });
        }
        const { email } = req.query;
        console.log('response email', email)

        const response = await EventGuest.GET_ALL({
            where: {
                email
            },
            // attributes: [[sequelize.fn('DISTINCT', sequelize.col('event_guests.event_id')), 'alias_name']],
            distinct: true,
            attributes: ['event_id'],
            include: [
                {
                    model: db.events,
                    attributes: [
                        'id',
                        'title',
                        'type',
                        'location',
                        'date',
                        'start_time',
                        'end_time',
                        'status',
                    ],
                    ...WITH_USERS_AND_TALENTS
                }

            ]
        });

        console.log('response', response)


        return res.status(200).json({
            events: response

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
    UpdateEventStatus,
    SendEventInvite,
    GetJoinedEvents,
    GetAllEventsByStatus
};