const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'dbuser',
  password: 'password',
  database: 'exapp',
});

module.exports = pool;