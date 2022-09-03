import db from '../config/database.js';

const models = {};

models.users = require("./users")(db.connection, db.library);

models.Sequelize = db.library;
models.sequelize = db.connection;



module.exports = models;