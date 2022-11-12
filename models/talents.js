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
        alias: {
            type: Sequelize.STRING,
            defaultValue: ''
        },
        service_type: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT('long')
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
            type: Sequelize.STRING,
            defaultValue: ''
        },
        commission_rate: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        equipment_provided: {
            type: Sequelize.STRING,
            defaultValue: ''
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
        duration: {
            type: Sequelize.STRING,
            defaultValue: ''
        },
        birthday_rate_per_day: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        birthday_duration: {
            type: Sequelize.STRING,
            defaultValue: ''
        },
        debut_rate_per_day: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        debut_duration: {
            type: Sequelize.STRING,
            defaultValue: ''
        },
        wedding_rate_per_day: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        wedding_duration: {
            type: Sequelize.STRING,
            defaultValue: ''
        },
        baptismal_rate_per_day: {
            type: Sequelize.INTEGER
        },
        baptismal_duration: {
            type: Sequelize.STRING,
            defaultValue: ''
        },
        seminar_rate_per_day: {
            type: Sequelize.INTEGER
        },
        seminar_duration: {
            type: Sequelize.STRING,
            defaultValue: ''
        },

        company_party_rate_per_day: {
            type: Sequelize.INTEGER
        },
        company_duration: {
            type: Sequelize.STRING,
            defaultValue: ''
        },
        school_event_rate_per_day: {
            type: Sequelize.INTEGER
        },
        school_event_duration: {
            type: Sequelize.STRING,
            defaultValue: ''
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
        youtube_url: {
            type: Sequelize.STRING
        },
        gcash_no: {
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
        status: {
            type: Sequelize.STRING,
            defaultValue: 'pending'
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

    return Talents;
};
