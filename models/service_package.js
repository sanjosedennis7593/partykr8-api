module.exports = (sequelize, Sequelize) => {
    const ServicePackage = sequelize.define("service_packages", {
        service_package_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        talent_id: {
            type: Sequelize.INTEGER
        },
        package_name: {
            type: Sequelize.STRING
        },
        package_description: {
            type: Sequelize.TEXT('long')
        },
        amount: {
            type: Sequelize.INTEGER
        },
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    });

    return ServicePackage;
};
