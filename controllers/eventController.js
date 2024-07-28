const { error } = require("console");
const Event = require("../models/event")
const path = require('path');

// Handler to get all events
const getAllEvent = async (req,res) => {
    try{
        const events = await Event.getAllEvent();
        res.json(events);
    }catch(error){
        console.log(error);
        res.status(500).send("error retreiving events");
    }
};

// Handler to get an event by ID
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

// Handler to get events by name
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

// Handler to create a new event
const createEvent = async (req,res)=>{
    const newEvent = req.body;
    console.log('Request Body:', req.body);
    try{
        const createdEvent = await Event.createEvent(newEvent);
        res.status(201).json(createdEvent);
    }catch(error){
        console.error(error);
        res.status(500).send("Error creating event");
    }
}

// Handler to get the latest event
const latestEvent = async (req,res) =>{
    try{
        const latestevent = await Event.latestEvent();
        return res.json(latestevent);
    }catch(error){
        console.error(error);
        res.status(500).send("error retreiving events");
    }
}

// Handler to update an event
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

// Handler to get events with categories
async function getEventsWithCategories(req,res){
    try{
        const events = await Event.getEventsWithCategories();
        res.json(events);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Error fetching Events with Category" });
    }
}

// Handler to get detailed event by ID
const detailedEventById = async (req,res)=>{
    const EventId = parseInt(req.params.id);
    try{
        const detailedEvent = await Event.detailedEventById(EventId);
        if (!detailedEvent){
            return res.status(404).send("Detailed Event not found");
        }
        res.json(detailedEvent)
    }catch(error){
        console.error(error);
        res.status(500).send("Error retreiving Detailed Event");
    }
}

// Handler to add category to an event
const addCategoryToEvent = async(req,res)=>{
    const categoryForEvent = req.body;
    try{
        const createdCategoryForEvent = await Event.addCategoryToEvent(categoryForEvent);
        res.status(201).json(createdCategoryForEvent);
    }catch(error){
        console.error(error)
        res.status(500).send ("Error creating category for category")
    }
}

// Handler to remove a category from an event
const removeCategoryFromEvent = async (req, res) => {
    const categoryForEvent = req.body;
    try {
        const success = await Event.removeCategoryFromEvent(categoryForEvent);
        if (!success) {
            return res.status(404).send("Event or Category not found");
        }
        res.status(204).send("Category removed successfully");
    } catch (error) {
        console.error('Error deleting category for event:', error);
        res.status(500).send("Error deleting category for event"+ error.message);
    }
};

// Handler to get events by category ID
const getEventsByCategory = async(req,res) =>{
    const catId = parseInt(req.params.id);
    try{
        const events = await Event.getEventsByCategory(catId)
        if(!events || events.length === 0){
            return res.status(404).send("Events not found")
        }
        res.json(events)
    }catch(error){
        console.error(error);
        res.status(500).send("Error retreiving event by category")
    }
}

// Handler to get categories for an event
const getCategoryForEvent = async (req,res)=>{
    const id = parseInt(req.params.id);
    try{
        const category = await Event.getCategoryForEvent(id);
        res.status(200).json(category);
    }catch (error){
        console.error('Error fetching categories for event:', error);
        res.status(500).send("Error fetching categories for event"); 
    }
}

// Exporting the handlers
module.exports={
    getAllEvent,
    getEventById,
    createEvent,
    latestEvent,
    updateEvent,
    getEventByName,
    getEventsWithCategories,
    detailedEventById,
    addCategoryToEvent,
    removeCategoryFromEvent,
    getEventsByCategory,
    getCategoryForEvent,
}
