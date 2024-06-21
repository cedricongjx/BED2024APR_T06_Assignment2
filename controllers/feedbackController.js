const Feedback = require("../models/feedback");

const getAllFeedback = async(req,res)=>
    {
        try
        {
            const feedback = await Feedback.getAllFeedback();
            res.json(feedback);
        }
        catch(error)
        {
            console.error(error);
            res.status(500).send("Error retrieving feedbacks")
        }
    };

const createFeedback = async(req,res) =>
    {
        const newFeedback = req.body;
        try
        {
            const createdFeedback = await Feedback.createFeedback(newFeedback);
            res.status(201).send("Feedback successfully created");
        }
        catch(error)
        {
            console.error(error);
            res.status(500).send("Error creating feedback");
        }
    }

module.exports =
{
    createFeedback,
    getAllFeedback,
};

