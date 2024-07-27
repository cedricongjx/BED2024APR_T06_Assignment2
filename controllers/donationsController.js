const Donation = require("../models/donation");

// Controller function to create a new donation
const createDonation = async (req, res) => {
  // Destructure donation details from request body
  const { firstName, amount, donationType, months } = req.body;

  // Extract user ID from authenticated user (assumed to be set by a middleware)
  const userId = req.user && req.user.id;
  console.log("Creating donation for user ID:", userId);

  // Check if user ID is available
  if (!userId) {
    return res.status(400).json({ error: "User ID is missing" });
  }

  // Validate firstName to ensure it is a non-empty string
  if (!firstName || typeof firstName !== "string") {
    return res.status(400).json({ error: "Invalid or missing firstName" });
  }

  // Parse amount to a float and validate it to ensure it's a positive number
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: "Invalid or missing amount" });
  }

  try {
    // Create a new donation record in the database
    const newDonation = await Donation.createDonation({
      DonatorID: userId,
      Name: firstName,
      Amount: parsedAmount,
      DonationDate: new Date(),
      DonationType: donationType,
      Months: months ? parseInt(months) : null // Convert months to integer if provided
    });

    // Respond with the newly created donation record
    res.status(201).json(newDonation);
  } catch (error) {
    console.error("Error creating donation:", error);
    res.status(500).json({ error: "Error creating donation" });
  }
};

// Controller function to get top donors based on donation type
const getTopDonors = async (req, res) => {
  // Retrieve donation type from query parameters, default to 'one-time' if not specified
  const donationType = req.query.type || 'one-time';
  try {
    // Fetch top donors based on the specified donation type
    const topDonors = await Donation.getTopDonorsByType(donationType);

    // Respond with the list of top donors
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
