module.exports = (sequelize, Sequelize) => {
    const TalentRateRequest = sequelize.define("talent_rate_request", {
        talent_rate_request_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        talent_id: {
            type: Sequelize.INTEGER
        },
        private_fee: {
            type: Sequelize.INTEGER
        },
        rate: {
            type: Sequelize.INTEGER
        },
        rate_type: {
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

    return TalentRateRequest;
};
