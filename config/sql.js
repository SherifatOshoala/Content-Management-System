require("dotenv").config();
const mysql = require("mysql2");


const connection = mysql.createConnection({
    host: process.env.APP_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });

  module.exports = connection