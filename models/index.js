import db from '../config/database.js';

const models = {};

models.users = require("./users")(db.connection, db.library);
models.talents = require("./talents")(db.connection, db.library);

models.Sequelize = db.library;
models.sequelize = db.connection;

models.talents.belongsTo(models.users ,{
    foreignKey: 'user_id',
    sourceKey: 'id'
});
  
  

module.exports = models;