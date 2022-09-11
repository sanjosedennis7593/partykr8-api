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
        avatar_url_1: {
            type: Sequelize.STRING
        },
        avatar_url_2: {
            type: Sequelize.STRING
        },
        avatar_url_3: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },
        genre: {
            type: Sequelize.STRING
        },
        private_fee: {
            type: Sequelize.INTEGER
        },
        service_rate: {
            type: Sequelize.INTEGER
        },
        service_rate_type: {
            type: Sequelize.STRING
        },

        address: {
            type: Sequelize.STRING
        },
        lat: {
            type: Sequelize.FLOAT(10, 6),
            defaultValue: null
        },
        lng: {
            type: Sequelize.FLOAT(10, 6),
            defaultValue: null
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

    return Talents;
};
