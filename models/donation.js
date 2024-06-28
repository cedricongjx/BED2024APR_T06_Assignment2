const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

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
      console.log("Donation Inputs:", donation); // Log the inputs
      const query = `
        INSERT INTO Donations (DonatorID, Name, Amount, DonationDate)
        VALUES (@DonatorID, @Name, @Amount, @DonationDate);
        SELECT SCOPE_IDENTITY() AS DonationID;
      `;
      const request = connection.request();
      request.input('DonatorID', sql.Int, donation.DonatorID);
      request.input('Name', sql.VarChar, donation.Name);
      request.input('Amount', sql.Decimal(10, 2), donation.Amount);
      request.input('DonationDate', sql.DateTime, donation.DonationDate);
      const result = await request.query(query);
      const donationId = result.recordset[0].DonationID;
      return new Donation(donationId, donation.DonatorID, donation.Name, donation.Amount, donation.DonationDate);
    } catch (error) {
      console.error('Error creating donation:', error);
      throw error;
    } finally {
      await connection.close();
    }
  }
}

module.exports = Donation;
