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
            type: Sequelize.FLOAT(10, 6),
            defaultValue: null
        },
        lng: {
            type: Sequelize.FLOAT(10, 6),
            defaultValue: null
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
        gcash_no: {
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

    return TalentUpdateRequest;
};
