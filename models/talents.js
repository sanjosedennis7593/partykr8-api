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
            type: Sequelize.DECIMAL(10, 5),
            defaultValue: null
        },
        lng: {
            type: Sequelize.DECIMAL(10, 5),
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
