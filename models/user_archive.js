module.exports = (sequelize, Sequelize) => {
    const UserArchive = sequelize.define("user_archive", {
        user_archive_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        talent: {
            type: Sequelize.TEXT('long')
        },
        user: {
            type: Sequelize.TEXT('long')
        },
        events: {
            type: Sequelize.TEXT('long')
        },
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    });

    return UserArchive;
};
