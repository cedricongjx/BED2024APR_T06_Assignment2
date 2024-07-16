const sql = require("mssql");
const dbConfig = require("../config/dbConfig");

const getStatistics = async (req, res) => {
  const period = req.query.period || 'weekly';

  try {
    const connection = await sql.connect(dbConfig);

    const oneTimeQuery = `
      SELECT 'one-time' AS donationType, SUM(Amount) AS totalAmount
      FROM Donations
      WHERE DonationType = 'one-time'
        AND DonationDate >= DATEADD(${period === 'weekly' ? 'WEEK' : 'MONTH'}, -1, GETDATE())
    `;

    const monthlyQuery = `
      SELECT 'monthly' AS donationType, SUM(Amount * ISNULL(Months, 1)) AS totalAmount
      FROM Donations
      WHERE DonationType = 'monthly'
        AND DonationDate >= DATEADD(${period === 'weekly' ? 'WEEK' : 'MONTH'}, -1, GETDATE())
    `;

    const [oneTimeResult, monthlyResult] = await Promise.all([
      connection.request().query(oneTimeQuery),
      connection.request().query(monthlyQuery)
    ]);

    const statistics = [
      oneTimeResult.recordset[0],
      monthlyResult.recordset[0]
    ].filter(record => record.donationType !== null);

    res.json(statistics);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Error fetching statistics" });
  }
};

module.exports = {
  getStatistics,
};
