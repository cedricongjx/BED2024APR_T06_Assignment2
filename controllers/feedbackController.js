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
const getAllNotVerifiedFeedback = async(req,res)=>
    {
        try
        {
            const feedback = await Feedback.getAllNotVerifiedFeedback();
            res.json(feedback);
        }
        catch(error)
        {
            console.error(error);
            res.status(500).send("Error retrieving feedbacks")
        }
    };
const getAllVerifiedFeedback = async(req,res)=>
    {
        try
        {
            const feedback = await Feedback.getAllVerifiedFeedback();
            res.json(feedback);
        }
        catch(error)
        {
            console.error(error);
            res.status(500).send("Error retrieving feedbacks")
        }
    };

const getAllBugFeedback = async(req,res)=>
    {
        try
        {
            const feedback = await Feedback.getAllBugFeedback();
            res.json(feedback);
        }
        catch(error)
        {
            console.error(error);
            res.status(500).send("Error retrieving feedbacks")
        }
    };
    
const getAllCustomerServiceFeedback = async(req,res)=>
    {
        try
        {
            const feedback = await Feedback.getAllCustomerServiceFeedback();
            res.json(feedback);
        }
        catch(error)
        {
            console.error(error);
            res.status(500).send("Error retrieving feedbacks")
        }
    };
    
const getAllfeedbackFeedback = async(req,res)=>
    {
        try
        {
            const feedback = await Feedback.getAllfeedbackFeedback();
            res.json(feedback);
        }
        catch(error)
        {
            console.error(error);
            res.status(500).send("Error retrieving feedbacks")
        }
    };
    
const getAllOtherFeedback = async(req,res)=>
    {
        try
        {
            const feedback = await Feedback.getAllOtherFeedback();
            res.json(feedback);
        }
        catch(error)
        {
            console.error(error);
            res.status(500).send("Error retrieving feedbacks")
        }
    };

const getFeedbackByName = async(req,res)=>
    {
        const feedback_name = req.query.searchTermFeedback;
        try
        {
            const feedback = await Feedback.getFeedbackByName(feedback_name);

            res.json(feedback);
        }
        catch(error)
        {
            console.error(error);
            res.status(500).send("Error retrieving feedback");
        }
    }

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
    };
    
const updateFeedback = async(req,res)=>
    {
        const feedback_id = parseInt(req.params.id);
        try
        {
            const success = await Feedback.updateFeedback(feedback_id);
            if(!success)
                {
                    return res.status("404").send("Feedback not found");
                }
            res.status(200).send("Updated successfully");
        }
        catch(error)
        {
            console.error(error);
            res.status(500).send("Error updating Feedback");
        }
    };

const deleteFeedback = async(req,res) =>
    {
        const feedback_id = parseInt(req.params.id);
        try
        {
            const success = await Feedback.deleteFeedback(feedback_id)
            if(!success)
                {
                    return res.status(404).send("Feedback not found");
                }
            res.status(204).send();
        }
        catch(error)
        {
            console.error(error);
            res.status(500).send("Error deleting feedback");
        }
    };

const addJustification = async(req,res)=>
    {
        const newFeedback_justification = req.body;
        try
        {
            const addedJustification = await Feedback.addJustification(newFeedback_justification.justification, newFeedback_justification.feedback_id);
            if(!addedJustification)
                {
                    return res.status(404).send("Feedback not found");

                }
            res.status(204).send();

        }
        catch(error)
        {
            console.error(error);
            res.status(500).send("Error deleting feedback");
        }
    };

const editResponse = async(req,res)=>
{
    const response = req.body
    try
    {
        const addedResponse = await Feedback.editResponse(response.response, response.feedback_id)
        if(!addedResponse)
        {
            return res.status(404).send("Feedback not found");
        }
        res.status(200).send(response);
    }
    catch(error)
        {
            console.error(error);
            res.status(500).send("Error updating Response");
        }
}

const getResponse = async(req,res) =>
    {
        const user_id = parseInt(req.params.id);
        try
        {
            const response = await Feedback.getResponse(user_id);
            if(!(response.length > 0 ))
                {
                    return res.status(404).send("Response not found");
                }      
            res.json(response);
        }
        catch(error)
        {
            console.error(error);
            res.status(500).send("Error getting response");
        }

    }

module.exports =
{
    createFeedback,
    getAllFeedback,
    getAllNotVerifiedFeedback,
    getAllVerifiedFeedback,
    getAllBugFeedback,
    getAllCustomerServiceFeedback,
    getAllfeedbackFeedback,
    getAllOtherFeedback,
    getFeedbackByName,
    updateFeedback,
    deleteFeedback,
    addJustification,
    editResponse,
    getResponse,
};

