const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

class Newsletter {
    constructor(id, email) {
      this.id = id;
      this.email = email;
    }

    static async joinNewsletter(email) {
        const connection = await sql.connect(dbConfig);
        try {
        const query = `
            INSERT INTO Newsletter (email)
            VALUES (@email)
            SELECT SCOPE_IDENTITY() AS newsid;
        `;
        const request = connection.request();
        request.input('email', email);
        const result = await request.query(query);
        const newsId = result.recordset[0].id;
        return new Newsletter(newsId, email);
        } catch (error) {
        console.error('Error adding email:', error);
        throw error;
        } finally {
        await connection.close();
        }
    }

}

module.exports =  Newsletter;