module.exports = (sequelize, Sequelize) => {
    const Events = sequelize.define("events", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },
        venue_type: {
            type: Sequelize.STRING
        },
        location: {
            type: Sequelize.STRING
        },
        full_event_address: {
            type: Sequelize.STRING
        },
        city: {
            type: Sequelize.STRING
        },
        state: {
            type: Sequelize.STRING
        },
        lat: {
            type: Sequelize.DECIMAL(10, 5),
            defaultValue: null
        },
        lng: {
            type: Sequelize.DECIMAL(10, 5),
            defaultValue: null
        },
        payment_expiration: {
            type: Sequelize.DATE
        },
        date: {
            type: Sequelize.DATE
        },
        start_time: {
            type: Sequelize.TIME
        },
        end_time: {
            type: Sequelize.TIME
        },
        message_to_guest: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING,
            defaultValue: 'pending'
        },
        no_of_guest: {
            type: Sequelize.INTEGER
        },
        event_reminders: {
            type: Sequelize.TEXT('long')
        },
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    });

    return Events;
};
