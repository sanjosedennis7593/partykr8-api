module.exports = (sequelize, Sequelize) => {
    const Talents = sequelize.define("talents", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        type: {
            type: Sequelize.STRING
        },
        genre: {
            type: Sequelize.STRING
        },
        service_rate: {
            type: Sequelize.INTEGER
        },

        address: {
            type: Sequelize.STRING
        },
        phone_number: {
            type: Sequelize.STRING
        },

        facebook_url: {
            type: Sequelize.STRING
        },
        instagram_url: {
            type: Sequelize.STRING
        },


        twitter_url: {
            type: Sequelize.STRING
        },
        tiktok_url: {
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

    return Talents;
};
