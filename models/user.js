const sql = require("mssql");
const dbConfig = require("../dbConfig");
const { number } = require("joi");
//const event = require("../models/event");

class user{
    constructor(Username,password)
    {
        this.Username = Username;
        this.password = password;
    }
    static async getAllUserWithEvents(){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = 
        `    
        SELECT 
            u.Userid AS userid, 
            u.username, 
        
            ev.Eventid AS Eventid, 
            ev.eventName, 
            ev.eventDescription, 
            ev.eventDateTime
        FROM 
            users u
        LEFT JOIN 
            EventsWithUsers ewu ON ewu.userid = u.Userid
        LEFT JOIN 
            Event ev ON ev.eventid = ewu.eventid
        ORDER BY 
            u.Userid;
        
        `
        const result = await connection.request().query(sqlQuery);
        const usersWithEvents = {};
        result.recordset.forEach(row => {
            const { userid, username, password, Eventid, eventName, eventDescription, eventDateTime } = row;
            if (!usersWithEvents[userid]) {
                usersWithEvents[userid] = {
                    userid,
                    username,
                    password,
                    events: []
                };
            }
            if (Eventid) {
                usersWithEvents[userid].events.push({
                    Eventid,
                    eventName,
                    eventDescription,
                    eventDateTime
                });
            }
        });
        return Object.values(usersWithEvents);
    }
    static async getUserWithEventsById(userId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
        SELECT 
            u.Userid AS userid, 
            u.username, 

            ev.Eventid AS Eventid, 
            ev.eventName, 
            ev.eventDescription, 
            ev.eventDateTime
        FROM 
            users u
        LEFT JOIN 
            EventsWithUsers ewu ON ewu.userid = u.Userid
        LEFT JOIN 
            Event ev ON ev.eventid = ewu.eventid
        where u.Userid = @userId
        ORDER BY 
            u.Userid;
        `   ;
        const result = await connection.request()
            .input('userId', sql.Int, userId)
            .query(sqlQuery);
    
        const usersWithEvents = {};
        
        result.recordset.forEach(row => {
            const { userid, username, password, Eventid, eventName, eventDescription, eventDateTime } = row;
    
            if (!usersWithEvents[userid]) {
                usersWithEvents[userid] = {
                    userid,
                    username,
                    password,
                    events: []
                };
            }
    
            if (Eventid) {
                usersWithEvents[userid].events.push({
                    Eventid,
                    eventName,
                    eventDescription,
                    eventDateTime
                });
            }
        });
    
        return Object.values(usersWithEvents);
    }
    static async getUserForEvent(eventid){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT 
            ev.Eventid AS Eventid, 
            ev.eventName, 
            ev.eventDescription , 
            ev.eventDateTime, 
            u.Userid AS userid, 
            u.username
        FROM 
            Event ev
        INNER JOIN 
            EventsWithUsers ewu ON ev.eventid = ewu.eventid
        INNER JOIN 
            users u ON u.Userid = ewu.userid
        where ev.Eventid = @eventid
        ORDER BY 
            ev.Eventid;`
    const result = await connection.request()
    .input('eventid', sql.Int, eventid)
    .query(sqlQuery);
    const EventsWithUsers = {}

    }
}
module.exports = user;