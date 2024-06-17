const Event = require("../models/event")

const getAllEvent = async (req,res) => {
    try{
        const events = await Event.getAllEvent();
        return res.json(events);
    }catch(error){
        console.log(error);
        res.status(500).send("error retreiving events");
    }
};
const getEventById = async (req,res)=>{
    const EventId = parseInt(req.params.id);
    try{
        const event = await Event.getEventById(EventId);
        if (!event){
            return res.status(404).send("Event not found");
        }
        res.json(event);
    }catch(error){
        console.error(error);
        res.status(500).send("Error retreiving event");
    }
};
const createEvent = async (req,res)=>{
    const newEvent = req.body;
    try{
        const createdEvent = await Event.createEvent(newEvent);
        res.status(201).json(createdEvent);
    }catch(error){
        console.log(error);
        res.status(500).send("Error creating event");
    }
}
module.exports={
    getAllEvent,
    getEventById,
    createEvent,

}