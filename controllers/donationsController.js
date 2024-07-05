const Donation = require("../models/donation");

const createDonation = async (req, res) => {
  const { firstName, amount } = req.body;
  const userId = req.user && req.user.id; 
  console.log("Creating donation for user ID:", userId); // Log the user ID

  if (!userId) {
    console.log("No authenticated user ID found.");
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
      Amount: parsedAmount, // Ensure amount is a valid number
      DonationDate: new Date(), // Automatically use the current date
    });
    res.status(201).json(newDonation);
  } catch (error) {
    console.error("Error creating donation:", error); // Log the actual error
    res.status(500).json({ error: "Error creating donation" });
  }
};

module.exports = {
  createDonation,
};
