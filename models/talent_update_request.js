module.exports = (sequelize, Sequelize) => {
    const TalentUpdateRequest = sequelize.define("talent_update_request", {
        talent_request_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        talent_id: {
            type: Sequelize.INTEGER
        },
        type: {
            type: Sequelize.STRING
        },
        genre: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        lat: {
            type: Sequelize.DECIMAL(10, 7),
            defaultValue: null
        },
        lng: {
            type: Sequelize.DECIMAL(10, 7),
            defaultValue: null
        },

        genre: {
            type: Sequelize.STRING
        },
        birthday_rate_per_day: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        debut_rate_per_day: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        wedding_rate_per_day: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        baptismal_rate_per_day: {
            type: Sequelize.INTEGER
        },
        seminar_rate_per_day: {
            type: Sequelize.INTEGER
        },
        company_party_rate_per_day: {
            type: Sequelize.INTEGER
        },
        school_event_rate_per_day: {
            type: Sequelize.INTEGER
        },
        duration: {
            type: Sequelize.INTEGER
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

        phone_number: {
            type: Sequelize.STRING
        },
        gcash_no: {
            type: Sequelize.STRING
        },

        status: {
            type: Sequelize.STRING
        },


        // PARTNERS
        venue_type: {
            type: Sequelize.STRING,
            defaultValue: ''
        },
        area_coverage: {
            type: Sequelize.STRING
        },
        led_dimension: {
            type: Sequelize.STRING
        },
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    });

    return TalentUpdateRequest;
};
