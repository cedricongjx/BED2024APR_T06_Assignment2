const Joi = require("joi");

const validateFeedback = (req, res, next) =>
{
    const schema = Joi.object({
        title: Joi.string().min(1).max(50).required(),
        description: Joi.string().min(1).max(250).required(),
        category: Joi.string().min(1).required(),
        user_id: Joi.number().min(1).required(),
    })
    const validation = schema.validate(req.body, {abortEarly: false});

    if(validation.error)
    {
        const errors = validation.error.details.map((error) => error.message);
        res.status(400).json({message: "Validation error" , errors});
        console.log(errors);
        return;
    }
    next();
}

const validateJustification = (req,res,next) =>
{
    const schema = Joi.object({
        justification: Joi.string().min(1).max(250).required(),
        feedback_id : Joi.number().min(1).required(),
        
    })
    const validation = schema.validate(req.body, {abortEarly: false});

    if(validation.error)
    {
        const errors = validation.error.details.map((error) => error.message);
        res.status(400).json({message: "Validation error" , errors});
        return;
    }
    next();
}

module.exports = 
{
    validateFeedback,
    validateJustification,

}
