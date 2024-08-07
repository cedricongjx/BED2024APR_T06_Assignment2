const sql = require("mssql");
const dbConfig  = require("../config/dbConfig");

class Feedback
{
    constructor(id,title,description,category,verified,time,userid,adminid)
    {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.verified = verified;
        this.time = time;
        this.userid = userid;
        this.adminid = adminid;
    }

    //Getting all feedback from database
    static async getAllFeedback()
    {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Feedback`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map
        (
            (row) => new Feedback(row.id,row.title,row.description,row.category,row.verified,row.time,row.userid,row.adminid)
        );
    }
    //Getting all not verified feedback from database
    static async getAllNotVerifiedFeedback()
    {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Feedback WHERE verified = 'N'`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map
        (
            (row) => new Feedback(row.id,row.title,row.description,row.category,row.verified,row.time,row.userid,row.adminid)
        );
    }
    //Getting all  verified feedback from database
    static async getAllVerifiedFeedback()
    {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Feedback WHERE verified = 'Y'`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map
        (
            (row) => new Feedback(row.id,row.title,row.description,row.category,row.verified,row.time,row.userid,row.adminid)
        );
    }
    //Getting all bug feedback from database
    static async getAllBugFeedback()
    {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Feedback WHERE verified = 'N' AND category = 'Bug'`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map
        (
            (row) => new Feedback(row.id,row.title,row.description,row.category,row.verified,row.time,row.userid,row.adminid)
        );
    }
    //Getting all customer service feedback from database
    static async getAllCustomerServiceFeedback()
    {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Feedback WHERE verified = 'N' AND category = 'Customer Service'`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map
        (
            (row) => new Feedback(row.id,row.title,row.description,row.category,row.verified,row.time,row.userid,row.adminid)
        );
    }
    //Getting all feedback category feedback from database
    static async getAllfeedbackFeedback()
    {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Feedback WHERE verified = 'N' AND category = 'Feedback'`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        console.log(result)
        return result.recordset.map
        (
            (row) => new Feedback(row.id,row.title,row.description,row.category,row.verified,row.time,row.userid,row.adminid)
        );
    }

    //Getting all other feedback from database
    static async getAllOtherFeedback()
    {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Feedback WHERE verified = 'N' AND category = 'Other'`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map
        (
            (row) => new Feedback(row.id,row.title,row.description,row.category,row.verified,row.time,row.userid,row.adminid)
        );
    }
    //Getting all feedback by name from database
    static async getFeedbackByName(name)
    {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Feedback WHERE title LIKE '%${name}%'`
        const request = connection.request();
        const result = await request.query(sqlQuery);
        return result.recordset
        
    }
    //Create feedback that takes in title, description from the user
    static async createFeedback(newFeedbackData)
    {
        const connection = await sql.connect(dbConfig)
        const sqlQuery = `INSERT INTO Feedback(title, description,category,verified, user_id) VALUES (@title,@description,@category,@verified, @user_id); SELECT SCOPE_IDENTITY() AS id;`;
        const request = connection.request();
        request.input('title',newFeedbackData.title);
        request.input('description',newFeedbackData.description);
        request.input('category',newFeedbackData.category);
        request.input('verified','N');
        request.input('user_id',newFeedbackData.user_id);
        const result = await request.query(sqlQuery);
    }

    //Update feedback to database
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
    //Delete Feedback from database
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


    //Creating the justification for the feedback
    static async addJustification(justification,id)
    {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO FeedbackVerified(justification,feedback_id) VALUES (@justification,@feedback_id); SELECT SCOPE_IDENTITY() AS id;`;
        const request = connection.request();
        request.input('justification',justification);
        request.input('feedback_id',id);
        const result = await request.query(sqlQuery);
        connection.close();
        return true;
        
    }
    //Edit the response
    static async editResponse(response,feedback_id)
    {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE FeedbackVerified SET response = @response WHERE feedback_id = @feedback_id`
        const request = connection.request();
        request.input('response', response);
        request.input('feedback_id', feedback_id);
        const result = await request.query(sqlQuery);
        connection.close();
        return true;
    }
    //Get response from database
    static async getResponse(userid)
    {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = 
        `
            SELECT fv.id, fv.justification, fv.response, fv.feedback_Id, f.title,f.description,f.category,f.verified,f.user_id,u.username,u.password
            FROM FeedbackVerified fv INNER JOIN Feedback f
            ON fv.feedback_Id = f.id
            INNER JOIN Users u
            ON u.Userid = f.user_id
            WHERE u.Userid = @userid
        `
        const request = connection.request();
        request.input("userid", userid)
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset;
    }
    //Getting all feedback count by all category from database
    static async getFeedbackCountByAllCategory()
    {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT category ,Count(category) AS 'Feedback_Count' FROM Feedback GROUP BY category`
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset;
    }

}

module.exports = Feedback;


