const Newsletter = require('../models/newsletter');

const joinNewsletter = async (req, res) => {
    const email = req.body.email;
    try {
      const newJoin = await Newsletter.joinNewsletter(email);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Error joining newsletter' });
    }
};

module.exports = {
    joinNewsletter
};