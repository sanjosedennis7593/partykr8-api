module.exports = (sequelize, Sequelize) => {
    const UserRatings = sequelize.define("user_ratings", {
        user_rating_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        talent_id: {
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

    return UserRatings;
};
