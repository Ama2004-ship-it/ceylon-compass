const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ceylon_compass',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

if (process.env.DB_SSL_CA) {
  dbConfig.ssl = {
    ca: process.env.DB_SSL_CA.replace(/\\n/g, '\n'),
    rejectUnauthorized: true,
  };
}

const pool = mysql.createPool(dbConfig);

module.exports = pool;