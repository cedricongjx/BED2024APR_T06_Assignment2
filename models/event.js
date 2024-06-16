const sql = require("mssql");
const dbConfig = require("../dbConfig");
const { number } = require("joi");

class Event{
    constructor(Eventid,Eventname,eventDescription,eventDateTime,Adminid)
    {
        this.Eventid = Eventid;
        this.Eventname = Eventname;
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
            (row) => new Event(row.Eventid,row.Eventname,row.eventDescription,row.eventDateTime,row.Adminid)
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
                result.recordset[0].Eventname,
                result.recordset[0].eventDescription,
                result.recordset[0].eventDateTime,
                result.recordset[0].Adminid,
            )
            :null;
    }
}
module.exports = Event;