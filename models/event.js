const sql = require("mssql");
const dbConfig = require("../dbConfig");
const { number } = require("joi");

class Event{
    constructor(Eventid,EventName,eventDescription,eventDateTime,Adminid)
    {
        this.Eventid = Eventid;
        this.EventName = EventName;
        this.eventDescription = eventDescription;
        this.eventDateTime = eventDateTime;
        this.Adminid = Adminid
    }

    static async getAllEvent(){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `select * from event`;
        const request = connection.request();
        
        const result = await request.query(sqlQuery);
        console.log(result.recordset);
        

        connection.close();
        return result.recordset.map(
            (row) => new Event(row.Eventid,row.EventName,row.eventDescription,row.eventDateTime,row.Adminid)
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
                result.recordset[0].Adminid,
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
            (row) => new Event(row.Eventid, row.EventName, row.eventDescription, row.eventDateTime, row.Adminid)
        );
    }
    static async createEvent(newEventData){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO EVENT(EventName,eventDescription,eventDateTime,Adminid) values(@EventName,@eventDescription,@eventDateTime,@Adminid); 
                          select scope_identity() AS Eventid`;
        const request = connection.request();
        request.input("EventName",newEventData.Eventname);
        request.input("eventDescription",newEventData.eventDescription);
        request.input("eventDateTime",sql.DateTime,new Date(newEventData.eventDateTime));
        request.input("Adminid",sql.Int,newEventData.Adminid);
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
                result.recordset[0].Adminid,
            )
            :null;
    }
    static async getAllUserWithEvents(){//get all user with events
        const connection = await sql.connect(dbconfig);
        const sqlQuery = `SELECT u.Userid, u.username, u.password, e.Eventid, e.EventName, e.eventDescription, e.eventDateTime
                            FROM Users u
                            JOIN EventsWithUsers ewu ON u.Userid = ewu.userid
                            JOIN Event e ON ewu.Eventid = e.Eventid;`
        const request = connection.request();

        const result = await request.query(sqlQuery);
        connection.close();
    }
    static async deleteExpiredEvent(){//for delete events after datetime.Now
        const connection = await sql.connect(dbConfig);
        const sqlQuery = ``
        const request = connection.request();

        const result = await request.query(sqlQuery);
        connection.close()
    
    }
    static async eventsTiedtospecificUser(id){// finding event tied to specific users.
        const connection = await sql.connect(dbconfig);
        const sqlQuery =   ``
        const request = connection.request();
        
        const result = await request.query(sqlQuery);
        connection.close()
    }
    static async updateEvent(id, newEventData){// updating event details.
        const connection = await sql.connect(dbconfig);
        const sqlQuery =   `UPDATE EVENT SET Eventid = @Eventid, EventName = @EventName,eventDescription = @eventDescription, eventDateTime = @eventDateTime,Adminid = @Adminid;`
        const request = connection.request();
        request.input("Eventid",id);
        request.input("EventName",newEventData.EventName || null);
        request.input("EventDescription",newEventData.eventDescription || null);
        request.input("EventDateTime",newEventData.eventDateTime || null);
        request.input("Adminid",1)
        await request.query(sqlQuery);
        connection.close()
        return this.getEventById(id);
    }
}
module.exports = Event;