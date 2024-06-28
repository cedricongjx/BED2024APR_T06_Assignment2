const Donation = require('../models/donation');

const createDonation = async (req, res) => {
  const { firstName, amount } = req.body;
  const userId = req.user.id;
  console.log("Creating donation for user ID:", userId); // Log the user ID

  try {
    const newDonation = await Donation.createDonation({
      DonatorID: userId,
      Name: firstName,
      Amount: parseFloat(amount), // Ensure amount is a number
      DonationDate: new Date() // Automatically use the current date
    });
    res.status(201).json(newDonation);
  } catch (error) {
    res.status(500).json({ error: 'Error creating donation' });
  }
};

module.exports = {
  createDonation,
};
