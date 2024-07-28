// Import necessary modules
const sql = require("mssql");
const dbConfig = require("../config/dbConfig");

// Function to get donation statistics
const getStatistics = async (req, res) => {
  // Connect to the database
  const connection = await sql.connect(dbConfig);
  const { month } = req.query; // Get the month parameter from the query

  try {
    // Base SQL query to get total donation amounts grouped by donation type
    let query = `
      SELECT DonationType, SUM(Amount * ISNULL(Months, 1)) AS TotalAmount
      FROM Donations
    `;

    // If a specific month is provided, add a WHERE clause to the query
    if (month && month !== 'all') {
      query += ` WHERE MONTH(DonationDate) = @month `;
    }

    // Group the results by DonationType
    query += ` GROUP BY DonationType `;

    const request = connection.request();
    // If a specific month is provided, add the month parameter to the request
    if (month && month !== 'all') {
      request.input('month', sql.Int, month);
    }

    // Execute the query and get the result
    const result = await request.query(query);
    res.json(result.recordset); // Send the result as JSON response
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Error fetching statistics" });
  } finally {
    // Close the database connection
    await connection.close();
  }
};

// Function to get average donation amounts
const getAverageDonations = async (req, res) => {
  // Connect to the database
  const connection = await sql.connect(dbConfig);
  const { month } = req.query; // Get the month parameter from the query

  try {
    // Base SQL query to get average donation amounts grouped by donation type
    let query = `
      SELECT DonationType, AVG(Amount * ISNULL(Months, 1)) AS AverageAmount
      FROM Donations
    `;

    // If a specific month is provided, add a WHERE clause to the query
    if (month && month !== 'all') {
      query += ` WHERE MONTH(DonationDate) = @month `;
    }

    // Group the results by DonationType
    query += ` GROUP BY DonationType `;

    const request = connection.request();
    // If a specific month is provided, add the month parameter to the request
    if (month && month !== 'all') {
      request.input('month', sql.Int, month);
    }

    // Execute the query and get the result
    const result = await request.query(query);
    res.json(result.recordset); // Send the result as JSON response
  } catch (error) {
    console.error("Error fetching average donations:", error);
    res.status(500).json({ error: "Error fetching average donations" });
  } finally {
    // Close the database connection
    await connection.close();
  }
};

// Export the functions for use in routes
module.exports = {
  getStatistics,
  getAverageDonations,
};
