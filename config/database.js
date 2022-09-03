import Sequelize from 'sequelize';

const dbConnection = new Sequelize(
  process.env.DB_SCHEMA,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || '3306',
    dialect:'mysql'
  }
);

const db = {
  connection: dbConnection,
  library: Sequelize
}

export default db;