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
        alias: {
            type: Sequelize.STRING
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
        city: {
            type: Sequelize.STRING,
            defaultValue: ''
        },
        state: {
            type: Sequelize.STRING,
            defaultValue: ''
        },

        lat: {
            type: Sequelize.DECIMAL(10, 7),
            defaultValue: null
        },
        lng: {
            type: Sequelize.DECIMAL(10, 7),
            defaultValue: null
        },

        description: {
            type: Sequelize.TEXT('long')
        },
        genre: {
            type: Sequelize.STRING
        },
        birthday_rate_per_day: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        birthday_duration: {
            type: Sequelize.STRING,
            defaultValue: 0
        },
        debut_rate_per_day: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        debut_duration: {
            type: Sequelize.STRING,
            defaultValue: 0
        },
        wedding_rate_per_day: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        wedding_duration: {
            type: Sequelize.STRING,
            defaultValue: 0
        },
        baptismal_rate_per_day: {
            type: Sequelize.INTEGER
        },
        baptismal_duration: {
            type: Sequelize.STRING,
            defaultValue: 0
        },
        seminar_rate_per_day: {
            type: Sequelize.INTEGER
        },
        seminar_duration: {
            type: Sequelize.STRING,
            defaultValue: 0
        },

        company_party_rate_per_day: {
            type: Sequelize.INTEGER
        },
        company_duration: {
            type: Sequelize.STRING,
            defaultValue: 0
        },
        school_event_rate_per_day: {
            type: Sequelize.INTEGER
        },
        school_event_duration: {
            type: Sequelize.STRING,
            defaultValue: 0
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
        youtube_url: {
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


        bank_account_no: {
            type: Sequelize.STRING
        },
        bank_account_name: {
            type: Sequelize.STRING
        },
        paypal_account: {
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
        talent_event_types: {
            type: Sequelize.TEXT('long')
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
