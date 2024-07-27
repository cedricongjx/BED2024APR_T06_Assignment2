const sql = require("mssql");
const dbConfig = require("../config/dbConfig");

// Donation class definition
class Donation {
  constructor(donationId, donatorId, name, amount, donationDate, donationType, months) {
    this.donationId = donationId;
    this.donatorId = donatorId;
    this.name = name;
    this.amount = amount;
    this.donationDate = donationDate;
    this.donationType = donationType;
    this.months = months;
  }

  // Method to create a new donation record in the database
  static async createDonation(donation) {
    const connection = await sql.connect(dbConfig); // Connect to the database
    try {
      const query = `
        INSERT INTO Donations (DonatorID, Name, Amount, DonationDate, DonationType, Months)
        VALUES (@DonatorID, @Name, @Amount, @DonationDate, @DonationType, @Months);
        SELECT SCOPE_IDENTITY() AS DonationID;
      `;

      const request = connection.request();
      request.input("DonatorID", sql.Int, donation.DonatorID);
      request.input("Name", sql.VarChar, donation.Name);
      request.input("Amount", sql.Decimal(10, 2), donation.Amount);
      request.input("DonationDate", sql.DateTime, donation.DonationDate || new Date());
      request.input("DonationType", sql.VarChar, donation.DonationType);
      request.input("Months", sql.Int, donation.Months);

      const result = await request.query(query);
      const donationId = result.recordset[0]?.DonationID;

      if (!donationId) {
        throw new Error("Failed to retrieve the DonationID"); // Throw error if DonationID is not retrieved
      }

      return new Donation(
        donationId,
        donation.DonatorID,
        donation.Name,
        donation.Amount,
        donation.DonationDate,
        donation.DonationType,
        donation.Months
      );
    } catch (error) {
      throw error; // Rethrow any errors for further handling
    } finally {
      await connection.close(); // Close the database connection
    }
  }

  // Method to get top donors by donation type
  static async getTopDonorsByType(donationType) {
    const connection = await sql.connect(dbConfig); // Connect to the database
    try {
      let query = `
        SELECT Name, SUM(Amount * ISNULL(Months, 1)) AS TotalAmount
        FROM Donations
        WHERE DonationType = @DonationType
        GROUP BY Name
        ORDER BY TotalAmount DESC
      `;

      const request = connection.request();
      request.input("DonationType", sql.VarChar, donationType);

      const result = await request.query(query);
      return result.recordset; // Return the result set
    } catch (error) {
      throw error; // Rethrow any errors for further handling
    } finally {
      await connection.close(); // Close the database connection
    }
  }

  // Method to get donation statistics over a period (weekly or monthly)
  static async getStatistics(period) {
    const connection = await sql.connect(dbConfig); // Connect to the database
    try {
      let query = `
        SELECT DonationType, SUM(Amount * ISNULL(Months, 1)) AS TotalAmount
        FROM Donations
        WHERE DonationDate >= DATEADD(${period === 'weekly' ? 'WEEK' : 'MONTH'}, -1, GETDATE())
        GROUP BY DonationType
      `;

      const result = await connection.request().query(query);
      return result.recordset; // Return the result set
    } catch (error) {
      throw error; // Rethrow any errors for further handling
    } finally {
      await connection.close(); // Close the database connection
    }
  }
}

// Export the Donation class for use in other modules
module.exports = Donation;
