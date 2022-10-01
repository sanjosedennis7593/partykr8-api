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
        lat: {
            type: Sequelize.DECIMAL(10, 5),
            defaultValue: null
        },
        lng: {
            type: Sequelize.DECIMAL(10, 5),
            defaultValue: null
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
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    });

    return Events;
};
