const Review = require('../models/review');

const getReviewbyID = async (req, res) => {
    const reviewid = req.params.id;
    try {
      const reviews = await Review.getReviewbyID(reviewid);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: 'Error getting review ' });
    }
};

const getReviewsbyDoc = async (req, res) => {
    const docid = req.params.id;
    try {
      const reviews = await Review.getReviewsbyDoc(docid);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: 'Error getting reviews ' });
    }
};

const createReview = async (req, res) => {
    const docid = req.params.id
    const { review, stars, date, userid } = req.body
    try {
      const newReview = await Review.createReview(docid, review, stars, date, userid);
      res.json(newReview);
    } catch (error) {
      res.status(500).json({ error: 'Error getting reviews ' });
    }
};

module.exports = {
    getReviewbyID,
    getReviewsbyDoc,
    createReview
};