module.exports = (sequelize, Sequelize) => {
    const Features = sequelize.define("features", {
        feature_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING
        },
        value: {
            type: Sequelize.INTEGER
        },
      
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    });

    return Features;
};
