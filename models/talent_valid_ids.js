module.exports = (sequelize, Sequelize) => {
    const TalentValidIds = sequelize.define("talent_valid_ids", {
        talent_valid_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        talent_id: {
            type: Sequelize.INTEGER
        },
        valid_id_url: {
            type: Sequelize.STRING
        },
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    });

    return TalentValidIds;
};
