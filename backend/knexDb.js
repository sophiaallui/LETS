require("dotenv").config();
const knex = require("knex");
const { DB_URI } = require("./config");
const db = knex({
  client : 'pg',
  connection : {
    host : '127.0.0.1',
    port : 5432,
    // user : process.env.PGUSER,
    // password : process.env.PGPASSWORD,
    database : DB_URI
  }
});

module.exports = db;