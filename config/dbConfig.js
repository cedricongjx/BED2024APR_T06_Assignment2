/*module.exports = {
    user: "bed_login", // Replace with your SQL Server login username
    password: "Bedlogin2024", // Replace with your SQL Server login password
    server: "localhost",
    database: "BEDASSIGNMENT_DB",
    trustServerCertificate: true,
    options: {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000, // Connection timeout in milliseconds
    },
  }; */


  module.exports = {
    user: process.env.DB_USER || 'bed_login', // Use environment variables or default values
    password: process.env.DB_PASSWORD || 'Bedlogin2024',
    server: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'BEDASSIGNMENT_DB',
    trustServerCertificate: true, // Use this if you're on Windows Azure
    options: {
      port: parseInt(process.env.DB_PORT) || 1433, // Default SQL Server port
      connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 60000, // Connection timeout in milliseconds
    },
  };
  

  