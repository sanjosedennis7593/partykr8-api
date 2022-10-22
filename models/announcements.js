module.exports = (sequelize, Sequelize) => {
    const Announcements = sequelize.define("announcements", {
        announcement_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT('long')
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    });

    return Announcements;
};
