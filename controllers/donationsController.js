const Donation = require("../models/donation");

const createDonation = async (req, res) => {
  const { firstName, amount, donationType, months } = req.body;
  const userId = req.user && req.user.id;
  console.log("Creating donation for user ID:", userId);

  if (!userId) {
    return res.status(400).json({ error: "User ID is missing" });
  }

  if (!firstName || typeof firstName !== "string") {
    return res.status(400).json({ error: "Invalid or missing firstName" });
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: "Invalid or missing amount" });
  }

  try {
    const newDonation = await Donation.createDonation({
      DonatorID: userId,
      Name: firstName,
      Amount: parsedAmount,
      DonationDate: new Date(),
      DonationType: donationType,
      Months: months ? parseInt(months) : null
    });
    res.status(201).json(newDonation);
  } catch (error) {
    console.error("Error creating donation:", error);
    res.status(500).json({ error: "Error creating donation" });
  }
};

const getTopDonors = async (req, res) => {
  const donationType = req.query.type || 'one-time';
  try {
    const topDonors = await Donation.getTopDonorsByType(donationType);
    res.json(topDonors);
  } catch (error) {
    console.error("Error fetching top donors:", error);
    res.status(500).json({ error: "Error fetching top donors" });
  }
};

module.exports = {
  createDonation,
  getTopDonors,
};
