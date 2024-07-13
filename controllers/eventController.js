const Event = require("../models/event")
const path = require('path');

const getAllEvent = async (req,res) => {
    try{
        const events = await Event.getAllEvent();
        res.json(events);
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
const getEventByName = async (req, res) => {
    const EventName = req.query.name; 
    try {
        const events = await Event.getEventByName(EventName);
        if (events.length === 0) {
            return res.status(404).send("No events found");
        }
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving events");
    }
};
const createEvent = async (req,res)=>{
    const newEvent = req.body;
    console.log('Request Body:', req.body);
    try{
        const createdEvent = await Event.createEvent(newEvent);
        res.status(201).json(createdEvent);
    }catch(error){
        console.log(error);
        res.status(500).send("Error creating event");
    }
}
const latestEvent = async (req,res) =>{
    try{
        const latestevent = await Event.latestEvent();
        return res.json(latestevent);
    }catch(error){
        console.log(error);
        res.status(500).send("error retreiving events");
    }
}
const updateEvent = async (req, res) => {
    const EventId = parseInt(req.params.id);
    const newEventData = req.body;
    try {
        const updatedEvent = await Event.updateEvent(EventId, newEventData);
        if (!updatedEvent) {
            return res.status(404).send("Event not found");
        }
        res.json(updatedEvent);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating event");
    }
};
module.exports={
    getAllEvent,
    getEventById,
    createEvent,
    latestEvent,
    updateEvent,
    getEventByName,

}