// dbconfig.js

// const sql = require('mssql');

// const config = {
//     user: 'bed_login',
//     password: 'Bedlogin2024',
//     server: 'localhost', // You can change this based on your SQL Server instance
//     database: 'practical',
//     options: {
//         encrypt: true, // Use if you're on Azure
//         enableArithAbort: true,
//     },
// };

// const poolPromise = new sql.ConnectionPool(config)
//     .connect()
//     .then(pool => {
//         console.log('Connected to SQL Server');
//         return pool;
//     })
//     .catch(err => {
//         console.error('Database connection failed:', err);
//         process.exit(1);
//     });

// module.exports = {
//     sql,
//     poolPromise,
// };

module.exports = {
    user: process.env.DB_USER || 'bed_login', // Use environment variables or default values
    password: process.env.DB_PASSWORD || 'Bedlogin2024',
    server: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'practical',
    trustServerCertificate: true, // Use this if you're on Windows Azure
    options: {
      port: parseInt(process.env.DB_PORT) || 1433, // Default SQL Server port
      connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 60000, // Connection timeout in milliseconds
    },
  };

