module.exports = (sequelize, Sequelize) => {
    const TalentEventType = sequelize.define("talent_event_type", {
        talent_event_type_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        talent_id: {
            type: Sequelize.INTEGER
        },
        event_type: {
            type: Sequelize.STRING
        },
        event_type_label: {
            type: Sequelize.STRING
        },
        duration: {
            type: Sequelize.INTEGER
        },
        amount: {
            type: Sequelize.INTEGER
        },
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    });

    return TalentEventType;
};
