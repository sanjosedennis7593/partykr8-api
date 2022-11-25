module.exports = (sequelize, Sequelize) => {
    const Faq = sequelize.define("faq", {
        faq_id: {
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

    return Faq;
};
