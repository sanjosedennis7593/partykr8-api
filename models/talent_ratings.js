module.exports = (sequelize, Sequelize) => {
    const TalentRatings = sequelize.define("talent_ratings", {
        talent_rating_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        talent_id: {
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        event_id: {
            type: Sequelize.INTEGER
        },
        rating: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        feedback: {
            type: Sequelize.STRING
        },
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    });

    return TalentRatings;
};
