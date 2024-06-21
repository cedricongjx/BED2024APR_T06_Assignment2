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
            VALUES (@email);
            SELECT SCOPE_IDENTITY() AS id;
        `;
        const request = connection.request();
        request.input('email', sql.VarChar, email);
        const result = await request.query(query);
        const Newsid = result.recordset[0].id;
        return new Newsletter(Newsid, email);
        } catch (error) {
        console.error('Error adding email:', error);
        throw error;
        } finally {
        await connection.close();
        }
    }

}

module.exports =  Newsletter;