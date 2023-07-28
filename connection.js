const mysql = require('mysql2');
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'placement_tracker',
    waitForConnections: true,
    connectionLimit: 11,
    queueLimit: 0
});

module.exports = {db};