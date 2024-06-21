const sql = require("mssql");
const dbConfig  = require("../config/dbConfig");

class Feedback
{
    constructor(id,title,description,verified,userid,adminid)
    {
        this.id = id;
        this.title = title;
        this.description = description;
        this.verified = verified;
        this.userid = userid;
        this.adminid = adminid;
    }

    static async getAllFeedback()
    {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Feedback`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map
        (
            (row) => new Feedback(row.id,row.title,row.description,row.verified,row.userid,row.adminid)
        );
    }

    // static async getFeedbackById(id)
    // {
    //     const connection = await sql.connection(dbConfig);
    //     const sqlQuery = `SELECT * FROM Feedback WHERE id = `
    // }

    static async createFeedback(newFeedbackData)
    {
        const connection = await sql.connect(dbConfig)
        const sqlQuery = `INSERT INTO Feedback(title, description,verified) VALUES (@title,@description,@verified); SELECT SCOPE_IDENTITY() AS id;`;
        const request = connection.request();
        request.input('title',newFeedbackData.title);
        request.input('description',newFeedbackData.description);
        request.input('verified','N');
        const result = await request.query(sqlQuery);
    }

}

module.exports = Feedback;


