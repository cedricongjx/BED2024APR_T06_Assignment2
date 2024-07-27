// middlewares/validateEventDate.js

const moment = require('moment'); // You might need to install this package if not already installed

const validateEventDate = (req, res, next) => {
    const eventDateTime = req.body.eventDateTime || req.query.eventDateTime;

    if (!eventDateTime) {
        return res.status(400).send('Event date and time must be provided');
    }

    const eventDate = new Date(eventDateTime);
    const now = new Date();

    if (eventDate <= now) {
        return res.status(400).send('Event date and time must be in the future');
    }

    next();
};

module.exports = validateEventDate;
