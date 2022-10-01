module.exports = (sequelize, Sequelize) => {
    const EventTalents = sequelize.define("event_talents", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        event_id: {
            type: Sequelize.INTEGER
        },
        talent_id: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.STRING,
            defaultValue: 'pending'
        },
        service_rate: {
            type: Sequelize.INTEGER,
        },
        private_fee: {
            type: Sequelize.INTEGER,
        },

        payout_received: {
            type: Sequelize.INTEGER,
            defaultValue:0
        },
        ref_id: {
            type: Sequelize.STRING
        },
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    });

    return EventTalents;
};
