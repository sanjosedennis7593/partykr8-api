module.exports = (sequelize, Sequelize) => {
    const EventRefund = sequelize.define("event_refund", {
        event_refund_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        event_id: {
            type: Sequelize.INTEGER
        },
        refund_id: {
            type: Sequelize.STRING
        },
        amount: {
            type: Sequelize.INTEGER
        },
        reason: {
            type: Sequelize.STRING
        },

        status: {
            type: Sequelize.STRING
        },
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    });

    return EventRefund;
};
