const sql = require("mssql");
const dbConfig = require("../dbConfig");
const { number } = require("joi");


class Event{
    constructor(Eventid,EventName,eventDescription,eventDateTime,location,Image)
    {
        this.Eventid = Eventid;
        this.EventName = EventName;
        this.eventDescription = eventDescription;
        this.eventDateTime = eventDateTime;
        this.location = location
        this.Image = Image
    }

    static async getAllEvent(){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `select * from event`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        console.log(result.recordset);
        connection.close();
        return result.recordset.map(
            (row) => new Event(row.Eventid,row.EventName,row.eventDescription,row.eventDateTime,row.location,row.Image)
        );
    }
    static async getEventById(id){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `select * from event where Eventid = @id`; 
        const request = connection.request();
        request.input("id",id);
        const result = await request.query(sqlQuery);
        console.log(result.recordset);
        connection.close();
        return result.recordset[0]
            ? new Event(
                result.recordset[0].Eventid,
                result.recordset[0].EventName,
                result.recordset[0].eventDescription,
                result.recordset[0].eventDateTime,
                result.recordset[0].location,
                result.recordset[0].Image,
            )
            :null;
    }
    static async getEventByName(EventName) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM event WHERE EventName LIKE @EventName`;
        const request = connection.request();
        request.input("EventName", sql.VarChar, `%${EventName}%`); // Use wildcard for partial matches
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map(
            (row) => new Event(row.Eventid,row.EventName,row.eventDescription,row.eventDateTime,row.location,row.Image)
        );
    }
    static async createEvent(newEventData){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO EVENT(EventName,eventDescription,eventDateTime,image,location) values(@EventName,@eventDescription,@eventDateTime,@image,@location); 
                          select scope_identity() AS Eventid`;
        const request = connection.request();
        request.input("EventName",newEventData.EventName);
        request.input("eventDescription",newEventData.eventDescription);
        request.input("eventDateTime",sql.DateTime,new Date(newEventData.eventDateTime));
        request.input("image",newEventData.Image);
        request.input("location",newEventData.location);
        const result = await request.query(sqlQuery);
        connection.close();
        const eventid = result.recordset[0].Eventid;
        if (!eventid){
            console.log("Event creation failed, no id returned");
        }
        return this.getEventById(eventid);
    }
    static async latestEvent(){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `Select * from Event Where EventID = (SELECT MAX(Eventid) FROM Event);`
        const request = connection.request();
        
        const result = await request.query(sqlQuery);
        console.log(result.recordset);
        connection.close();
        return result.recordset[0]
            ? new Event(
                result.recordset[0].Eventid,
                result.recordset[0].EventName,
                result.recordset[0].eventDescription,
                result.recordset[0].eventDateTime,
                result.recordset[0].location,
                result.recordset[0].Image,
            )
            :null;
    }
    static async getAllUserWithEvents(){//get all user with events
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT u.Userid, u.username, u.password, e.Eventid, e.EventName, e.eventDescription, e.eventDateTime
                            FROM Users u
                            JOIN EventsWithUsers ewu ON u.Userid = ewu.userid
                            JOIN Event e ON ewu.Eventid = e.Eventid;`
        const request = connection.request();

        const result = await request.query(sqlQuery);
        connection.close();
    }
    static async updateEvent(id, newEventData) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE EVENT SET 
                            EventName = @EventName, 
                            eventDescription = @eventDescription, 
                            eventDateTime = @eventDateTime,
                            Location = @Location,
                            Image = @Image,
                          WHERE EventId = @EventId`;
        const request = connection.request();
        request.input("EventId", sql.Int, id);
        request.input("EventName", sql.VarChar, newEventData.EventName);
        request.input("eventDescription", sql.VarChar, newEventData.eventDescription);
        request.input("Location", sql.VarChar, newEventData.Location);
        request.input("Image", sql.VarChar, newEventData.Image); // Save the image path
        request.input("eventDateTime", sql.DateTime, new Date(newEventData.eventDateTime));
    
        await request.query(sqlQuery);
        connection.close();
        return this.getEventById(id);
      }
    static async getEventsWithCategories() {
        const connection = await sql.connect(dbConfig);
    
        try {
            const sqlQuery = `
                SELECT e.eventId AS event_id, e.EventName, e.eventDescription, e.eventDateTime, e.Image, e.location, c.catId AS category_id, c.categoryName
                FROM Event e
                LEFT JOIN EventWithCategory ec ON ec.eventId = e.eventId
                LEFT JOIN Categories c ON ec.catId = c.catId
                ORDER BY e.eventName;
            `;
    
            const result = await connection.request().query(sqlQuery);
    
            // Group events and their categories
            const eventsWithCategories = {};
            for (const row of result.recordset) {
                const eventId = row.event_id;
                if (!eventsWithCategories[eventId]) {
                    eventsWithCategories[eventId] = {
                        eventId: eventId,
                        eventName: row.EventName,
                        eventDescription: row.eventDescription,
                        eventDateTime: row.eventDateTime,
                        image: row.Image,
                        location: row.location,
                        categories: [],
                    };
                }
                if (row.category_id) {
                    eventsWithCategories[eventId].categories.push({
                        categoryId: row.category_id,
                        categoryName: row.categoryName,
                    });
                }
            }
    
            return Object.values(eventsWithCategories);
        } catch (error) {
            throw new Error("Error fetching events with categories");
        } finally {
            await connection.close();
        }
    }
    static async detailedEventById(eventid){
        const connection = await sql.connect(dbConfig);
        try{
            const sqlQuery = `
            SELECT e.eventId AS event_id, e.EventName, e.eventDescription, e.eventDateTime, e.Image, e.location, c.catId AS category_id, c.categoryName
            FROM Event e
            LEFT JOIN EventWithCategory ec ON ec.eventId = e.eventId
            LEFT JOIN Categories c ON ec.catId = c.catId
            WHERE e.eventId = @eventId
            ORDER BY e.eventName;
        `;
        const request = connection.request();
        request.input("eventId",eventid);
        const result = await request.query(sqlQuery);
        const eventWithCategories = {
            eventId: null,
            eventName: '',
            eventDescription: '',
            eventDateTime: '',
            image: '',
            location: '',
            categories: []
        };

        for (const row of result.recordset) {
            if (!eventWithCategories.eventId) {
                eventWithCategories.eventId = row.event_id;
                eventWithCategories.eventName = row.EventName;
                eventWithCategories.eventDescription = row.eventDescription;
                eventWithCategories.eventDateTime = row.eventDateTime;
                eventWithCategories.image = row.Image;
                eventWithCategories.location = row.location;
            }
            if (row.category_id) {
                eventWithCategories.categories.push({
                    categoryId: row.category_id,
                    categoryName: row.categoryName,
                });
            }
        }

            return eventWithCategories;
        } catch (error) {
            throw new Error("Error fetching event by ID with categories");
        } finally {
            await connection.close();
        }     
    }
    static async addCategoryToEvent(eventDetails) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO EventWithCategory (eventId, catId) VALUES (@eventId, @catId)`;
        const request = connection.request();
        request.input("eventId", sql.Int, eventDetails.eventid);
        request.input("catId", sql.Int, eventDetails.catid);
        await request.query(sqlQuery)
        connection.close();
        return this.detailedEventById(eventDetails.eventid);
    }
    static async removeCategoryFromEvent(eventDetails){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `delete from EventWithCategory where Eventid = @eventId and CatId = @catId`;
        const request = connection.request();
        request.input("eventId",sql.Int,eventDetails.eventid);
        request.input("catId",sql.Int,eventDetails.catid);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.rowsAffected > 0;
    }
    static async getEventsByCategory(categoryId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            SELECT e.eventId AS event_id, e.EventName, e.eventDescription, e.eventDateTime, e.location, e.Image
            FROM Event e
            JOIN EventWithCategory ec ON e.eventId = ec.eventId
            WHERE ec.catId = @categoryId
        `;
        const request = connection.request();
        request.input("categoryId", sql.Int, categoryId);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map(
            (row) => new Event(row.event_id, row.EventName, row.eventDescription, row.eventDateTime, row.location, row.Image)
        );
    }
}
module.exports = Event;