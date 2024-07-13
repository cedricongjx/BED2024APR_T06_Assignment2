const user = require("../models/user")

const getAllUserWithEvents = async (req,res) =>{
    try{
        const userWithEvent = await user.getAllUserWithEvents();
        res.json(userWithEvent);
    }catch(error){
        console.log(error);
        res.status(500).send("error retreiving events");
    }
};
const getUserWithEventsById = async (req,res) =>{
    const userId = parseInt(req.params.id);
    try{
        const userwithevent = await user.getUserWithEventsById(userId);
        if (!userwithevent){
            return res.status(404).send("Event not found");
        }
        res.json(userwithevent);
    }catch(error){
        console.error(error)
        res.status(500).send("Error retreiving user with event");
    }
}
module.exports = {
    getAllUserWithEvents,
    getUserWithEventsById,
}