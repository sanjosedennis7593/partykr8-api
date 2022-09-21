import db from '../config/database.js';

const models = {};


models.users = require("./users")(db.connection, db.library);
models.talents = require("./talents")(db.connection, db.library);
models.talent_valid_ids = require("./talent_valid_ids")(db.connection, db.library);
models.events = require("./events")(db.connection, db.library);
models.event_guests = require("./event_guests")(db.connection, db.library);
models.event_talents = require("./event_talents")(db.connection, db.library);
models.event_payments = require("./event_payments")(db.connection, db.library);
models.talent_update_request = require("./talent_update_request")(db.connection, db.library);

models.Sequelize = db.library;
models.sequelize = db.connection;

models.talents.belongsTo(models.users, {
    foreignKey: 'user_id',
    sourceKey: 'id'
});

models.talent_valid_ids.belongsTo(models.talents, {
    foreignKey: 'talent_id',
    sourceKey: 'id'
});

models.talents.hasMany(models.talent_valid_ids, {
    foreignKey: 'talent_id',
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

models.users.hasOne(models.talents, {
    foreignKey: 'user_id',
    sourceKey: 'id'
});



models.events.hasMany(models.event_guests, {
    foreignKey: 'event_id',
    sourceKey: 'id'
});

models.events.hasMany(models.event_talents, {
    foreignKey: 'event_id',
    sourceKey: 'id'

});

models.event_talents.belongsTo(models.events, {
    foreignKey: 'event_id',
    sourceKey: 'id'

});

models.talents.hasMany(models.event_talents, {
    foreignKey: 'talent_id',
    sourceKey: 'id'
});

models.event_talents.belongsTo(models.talents, {
    foreignKey: 'talent_id',
    sourceKey: 'id'
});


models.events.hasOne(models.event_payments, {
    foreignKey: 'event_id',
    sourceKey: 'id'
});

models.event_payments.belongsTo(models.events, {
    foreignKey: 'event_id',
    sourceKey: 'id'
});


models.talents.hasMany(models.talent_update_request, {
    foreignKey: 'talent_id',
    sourceKey: 'id'
});

models.talent_update_request.belongsTo(models.talents, {
    foreignKey: 'talent_id',
    sourceKey: 'id'
});




module.exports = models;