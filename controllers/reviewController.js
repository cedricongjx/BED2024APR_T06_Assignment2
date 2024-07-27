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

const createdReview = async (req, res) => {
  const docid = req.params.id
  const userid = req.query.userid
  try {
    const hasReview = await Review.createdReview(docid, userid);
    res.json(hasReview);
    } catch (error) {
    res.status(500).json({ error: 'Error getting reviews ' });
  }
};

const getAverageStar = async (req, res) => {
  const docid = req.params.id;
  try {
    const avgStar = await Review.getAverageStar(docid);
    res.json(avgStar);
    } catch (error) {
    res.status(500).json({ error: 'Error getting reviews ' });
  }
}

const getNumberofReviews = async (req, res) => {
  const docid = req.params.id;
  try {
    const total = await Review.getNumberofReviews(docid);
    res.json(total);
    } catch (error) {
    res.status(500).json({ error: 'Error getting reviews ' });
  }
}

module.exports = {
    getReviewbyID,
    getReviewsbyDoc,
    createReview,
    createdReview,
    getAverageStar,
    getNumberofReviews
};