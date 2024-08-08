const mysql = require('mysql2');

module.exports = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Irvin@Metro24',
    database: 'employees',
    multipleStatements: true
});