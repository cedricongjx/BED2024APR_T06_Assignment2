// dbconfig.js

const sql = require('mssql');

const config = {
    user: 'your_username',
    password: 'your_password',
    server: 'localhost', // You can change this based on your SQL Server instance
    database: 'practical',
    options: {
        encrypt: true, // Use if you're on Azure
        enableArithAbort: true,
    },
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Database connection failed:', err);
        process.exit(1);
    });

module.exports = {
    sql,
    poolPromise,
};
