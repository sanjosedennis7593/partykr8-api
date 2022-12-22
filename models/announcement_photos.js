module.exports = (sequelize, Sequelize) => {
    const AnnouncementPhotos = sequelize.define("announcement_photos", {
        announcement_photo_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        announcement_id: {
            type: Sequelize.INTEGER
        },
        photo_url: {
            type: Sequelize.STRING
        },
   
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    });

    return AnnouncementPhotos;
};
