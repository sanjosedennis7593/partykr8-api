import db from '../config/database.js';

const models = {};


models.users = require("./users")(db.connection, db.library);
models.talents = require("./talents")(db.connection, db.library);
models.events = require("./events")(db.connection, db.library);
models.event_guests = require("./event_guests")(db.connection, db.library);
models.event_talents = require("./event_talents")(db.connection, db.library);

models.Sequelize = db.library;
models.sequelize = db.connection;

models.talents.belongsTo(models.users, {
    foreignKey: 'user_id',
    sourceKey: 'id'
});

models.events.belongsTo(models.users, {
    foreignKey: 'user_id',
    sourceKey: 'id'
});


models.users.hasMany(models.events, {
    foreignKey: 'user_id',
    sourceKey: 'id'
});
// models.event_guests.belongsTo(models.events ,{
//     foreignKey: 'event_id',
//     sourceKey: 'id'
// });

models.events.hasMany(models.event_guests, {
    foreignKey: 'event_id',
    sourceKey: 'id'
});

models.events.hasMany(models.event_talents, {
    foreignKey: 'event_id',
    sourceKey: 'id'
});

models.event_talents.belongsTo(models.talents, {
    foreignKey: 'talent_id',
    sourceKey: 'id'
});

// models.event_talents.belongsToMany(models.event_talents ,{
//     foreignKey: 'talent_id',
//     sourceKey: 'id'
// });

// models.talents.belongsToMany(models.events, { through: 'event_talents' });

// models.event_talents.belongsTo(models.talents ,{
//     foreignKey: 'talent_id',
//     sourceKey: 'id'
// });

// models.talents.hasMany(models.event_talents ,{
//     foreignKey: 'talent_id',
//     sourceKey: 'id'
// });

// models.event_talents.belongs(models.talents ,{
//     foreignKey: 'talent_id',
//     sourceKey: 'id'
// });



module.exports = models;