require('dotenv').config();
const mysql = require('mysql2');
const os = require('os');
const connectionLimit = os.cpus().length;

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: connectionLimit,
    queueLimit: 0
});

module.exports = {db};