module.exports = (sequelize, Sequelize) => {
    const EventPayments = sequelize.define("event_payments", {
        event_payment_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        event_id: {
            type: Sequelize.INTEGER
        },
        payment_source_id: {
            type: Sequelize.STRING
        },
        payment_type: {
            type: Sequelize.STRING
        },
        payment_id: {
            type: Sequelize.STRING
        },
        amount: {
            type: Sequelize.INTEGER
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

    return EventPayments;
};
