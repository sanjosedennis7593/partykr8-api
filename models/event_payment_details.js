module.exports = (sequelize, Sequelize) => {
    const EventPaymentDetails = sequelize.define("event_payment_details", {
        event_payment_detail_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        event_payment_id: {
            type: Sequelize.INTEGER
        },
        event_payment_id: {
            type: Sequelize.INTEGER
        },
        talent_id: {
            type: Sequelize.INTEGER
        }, 
        amount: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.INTEGER,
            default: 0
        },
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    });

    return EventPaymentDetails;
};
