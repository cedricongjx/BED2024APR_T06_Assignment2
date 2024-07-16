const sql = require("mssql");
const dbConfig = require("../config/dbConfig");

class Donation {
  constructor(donationId, donatorId, name, amount, donationDate) {
    this.donationId = donationId;
    this.donatorId = donatorId;
    this.name = name;
    this.amount = amount;
    this.donationDate = donationDate;
  }

  static async createDonation(donation) {
    const connection = await sql.connect(dbConfig);
    try {
      console.log("Donation Inputs:", donation);

      if (!donation.DonatorID || !donation.Name || !donation.Amount) {
        throw new Error("Invalid donation input");
      }

      const query = `
        INSERT INTO Donations (DonatorID, Name, Amount, DonationDate)
        VALUES (@DonatorID, @Name, @Amount, @DonationDate);
        SELECT SCOPE_IDENTITY() AS DonationID;
      `;

      const request = connection.request();
      request.input("DonatorID", sql.Int, donation.DonatorID);
      request.input("Name", sql.VarChar, donation.Name);
      request.input("Amount", sql.Decimal(10, 2), donation.Amount);
      request.input(
        "DonationDate",
        sql.DateTime,
        donation.DonationDate || new Date()
      );

      const result = await request.query(query);
      console.log("Query Result:", result);

      const donationId = result.recordset[0]?.DonationID;

      if (!donationId) {
        throw new Error("Failed to retrieve the DonationID");
      }

      return new Donation(
        donationId,
        donation.DonatorID,
        donation.Name,
        donation.Amount,
        donation.DonationDate
      );
    } catch (error) {
      console.error("Error creating donation:", error);
      throw error;
    } finally {
      await connection.close();
    }
  }

  static async getTopDonors() {
    const connection = await sql.connect(dbConfig);
    try {
      const query = `
        SELECT TOP 10 Name, SUM(Amount) AS TotalAmount
        FROM Donations
        GROUP BY Name
        ORDER BY TotalAmount DESC
      `;

      const result = await connection.request().query(query);
      return result.recordset;
    } catch (error) {
      console.error("Error fetching top donors:", error);
      throw error;
    } finally {
      await connection.close();
    }
  }
}

module.exports = Donation;
