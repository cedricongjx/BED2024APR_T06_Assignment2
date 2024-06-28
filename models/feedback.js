const sql = require("mssql");
const dbConfig  = require("../config/dbConfig");

class Feedback
{
    constructor(id,title,description,category,verified,userid,adminid)
    {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.verified = verified;
        this.userid = userid;
        this.adminid = adminid;
    }

    static async getAllFeedback()
    {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Feedback WHERE verified = 'N'`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map
        (
            (row) => new Feedback(row.id,row.title,row.description,row.category,row.verified,row.userid,row.adminid)
        );
    }

    static async getAllBugFeedback()
    {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Feedback WHERE verified = 'N' AND category = 'Bug'`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map
        (
            (row) => new Feedback(row.id,row.title,row.description,row.category,row.verified,row.userid,row.adminid)
        );
    }

    static async getAllCustomerServiceFeedback()
    {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Feedback WHERE verified = 'N' AND category = 'Customer Service'`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map
        (
            (row) => new Feedback(row.id,row.title,row.description,row.category,row.verified,row.userid,row.adminid)
        );
    }

    static async getAllfeedbackFeedback()
    {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Feedback WHERE verified = 'N' AND category = 'Feedback'`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map
        (
            (row) => new Feedback(row.id,row.title,row.description,row.category,row.verified,row.userid,row.adminid)
        );
    }

    static async getAllOtherFeedback()
    {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Feedback WHERE verified = 'N' AND category = 'Other'`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map
        (
            (row) => new Feedback(row.id,row.title,row.description,row.category,row.verified,row.userid,row.adminid)
        );
    }

    static async createFeedback(newFeedbackData)
    {
        const connection = await sql.connect(dbConfig)
        const sqlQuery = `INSERT INTO Feedback(title, description,category,verified) VALUES (@title,@description,@category,@verified); SELECT SCOPE_IDENTITY() AS id;`;
        const request = connection.request();
        request.input('title',newFeedbackData.title);
        request.input('description',newFeedbackData.description);
        request.input('category',newFeedbackData.category);
        request.input('verified','N');
        const result = await request.query(sqlQuery);
    }

    static async updateFeedback(id)
    {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE Feedback SET verified = @verified WHERE id = @id`;
        const request = connection.request();
        request.input("verified","Y");
        request.input("id", id);
        await request.query(sqlQuery);
        connection.close();
        return true;
    }

    static async deleteFeedback(id)
    {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `DELETE FROM Feedback WHERE id = @id`;
        const request = connection.request();
        request.input("id",id);
        const result = await request.query(sqlQuery);
        connection.close();

        return result.rowsAffected > 0;
    }
}

module.exports = Feedback;


