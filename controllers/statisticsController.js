const sql = require("mssql");
const dbConfig = require("../config/dbConfig");

const getStatistics = async (req, res) => {
  const connection = await sql.connect(dbConfig);
  const { month } = req.query;

  try {
    let query = `
      SELECT DonationType, SUM(Amount * ISNULL(Months, 1)) AS TotalAmount
      FROM Donations
    `;

    if (month && month !== 'all') {
      query += ` WHERE MONTH(DonationDate) = @month `;
    }

    query += ` GROUP BY DonationType `;

    const request = connection.request();
    if (month && month !== 'all') {
      request.input('month', sql.Int, month);
    }

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Error fetching statistics" });
  } finally {
    await connection.close();
  }
};

const getAverageDonations = async (req, res) => {
  const connection = await sql.connect(dbConfig);
  const { month } = req.query;

  try {
    let query = `
      SELECT DonationType, AVG(Amount * ISNULL(Months, 1)) AS AverageAmount
      FROM Donations
    `;

    if (month && month !== 'all') {
      query += ` WHERE MONTH(DonationDate) = @month `;
    }

    query += ` GROUP BY DonationType `;

    const request = connection.request();
    if (month && month !== 'all') {
      request.input('month', sql.Int, month);
    }

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching average donations:", error);
    res.status(500).json({ error: "Error fetching average donations" });
  } finally {
    await connection.close();
  }
};

module.exports = {
  getStatistics,
  getAverageDonations,
};
