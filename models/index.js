import db from '../config/database.js';

const models = {};

models.announcements = require("./announcements")(db.connection, db.library);
models.users = require("./users")(db.connection, db.library);
models.talents = require("./talents")(db.connection, db.library);
models.talent_photos = require("./talent_photos")(db.connection, db.library);
models.talent_valid_ids = require("./talent_valid_ids")(db.connection, db.library);
models.events = require("./events")(db.connection, db.library);
models.event_guests = require("./event_guests")(db.connection, db.library);
models.event_refund = require("./event_refund")(db.connection, db.library);
models.event_talents = require("./event_talents")(db.connection, db.library);
models.event_payments = require("./event_payments")(db.connection, db.library);
models.event_payment_details = require("./event_payment_details")(db.connection, db.library);
models.talent_update_request = require("./talent_update_request")(db.connection, db.library);
models.talent_ratings = require("./talent_ratings")(db.connection, db.library);
models.user_ratings = require("./user_ratings")(db.connection, db.library);
models.service_package = require("./service_package")(db.connection, db.library);
models.talent_event_type = require("./talent_event_type")(db.connection, db.library);

models.Sequelize = db.library;
models.sequelize = db.connection;

models.talents.belongsTo(models.users, {
    foreignKey: 'user_id',
    sourceKey: 'id'
});

models.talents.hasMany(models.talent_valid_ids, {
    foreignKey: 'talent_id',
    sourceKey: 'id'
});

models.talent_valid_ids.belongsTo(models.talents, {
    foreignKey: 'talent_id',
    sourceKey: 'id'
});

models.talents.hasMany(models.talent_photos, {
    foreignKey: 'talent_id',
    sourceKey: 'id'
});

models.talent_photos.belongsTo(models.talents, {
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

models.event_guests.belongsTo(models.events, {
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


models.events.hasMany(models.event_payments, {
    foreignKey: 'event_id',
    sourceKey: 'id'
});

models.event_payments.belongsTo(models.events, {
    foreignKey: 'event_id',
    sourceKey: 'id'
});

models.event_payments.hasMany(models.event_payment_details, {
    foreignKey: 'event_payment_id',
    sourceKey: 'event_payment_id'
});

models.event_payment_details.belongsTo(models.talents, {
    foreignKey: 'talent_id',
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


models.talents.hasMany(models.talent_ratings, {
    foreignKey: 'talent_id',
    sourceKey: 'id'
});


models.talent_ratings.belongsTo(models.talents, {
    foreignKey: 'talent_id',
    sourceKey: 'id'
});

models.users.hasMany(models.talent_ratings, {
    foreignKey: 'user_id',
    sourceKey: 'id'
});

models.talent_ratings.belongsTo(models.users, {
    foreignKey: 'user_id',
    sourceKey: 'id'
});


models.talents.hasMany(models.user_ratings, {
    foreignKey: 'talent_id',
    sourceKey: 'id'
});


models.user_ratings.belongsTo(models.talents, {
    foreignKey: 'talent_id',
    sourceKey: 'id'
});

models.users.hasMany(models.user_ratings, {
    foreignKey: 'user_id',
    sourceKey: 'id'
});

models.user_ratings.belongsTo(models.users, {
    foreignKey: 'user_id',
    sourceKey: 'id'
});


models.events.hasOne(models.event_refund, {
    foreignKey: 'event_id',
    sourceKey: 'id'
});


models.event_refund.belongsTo(models.events, {
    foreignKey: 'event_id',
    sourceKey: 'id'
});

models.talents.hasMany(models.service_package, {
    foreignKey: 'talent_id',
    sourceKey: 'id'
});


models.service_package.belongsTo(models.talents, {
    foreignKey: 'talent_id',
    sourceKey: 'id'
});


models.announcements.belongsTo(models.users, {
    foreignKey: 'user_id',
    sourceKey: 'id'
});

models.users.hasMany(models.announcements, {
    foreignKey: 'user_id',
    sourceKey: 'id'
});



models.talents.hasMany(models.talent_event_type, {
    foreignKey: 'talent_id',
    sourceKey: 'id'
});
models.talent_event_type.belongsTo(models.talents, {
    foreignKey: 'talent_id',
    sourceKey: 'id'
});







module.exports = models;