const pgp = require('pg-promise')();
require('dotenv').config();

const dbConfig = {
  host: process.env.host,
  port: process.env.port,
  database: process.env.database,
  user: process.env.user,
  password: process.env.password,
};

const db = pgp(dbConfig);
module.exports = db
