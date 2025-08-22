const sql = require('mssql');

const config = {
    user: 'kehilapp_user',
    password: 'Kehilapp123!',
    server: 'localhost',
    database: 'kehilapp',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

module.exports = { sql, config };
