const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

class Documentary {
    constructor(id, title, documentary, date, image) {
      this.id = id;
      this.title = title;
      this.documentary = documentary;
      this.date = date;
      this.image = image;
    }

    static async getDocbyID(id) {
        const connection = await sql.connect(dbConfig);
        try
        {
        const query = `
        SELECT * from documentary where docid = @id
        `;
        const request = connection.request();
        request.input('id', id);
        const result = await request.query(query);
        return result.recordset[0];
        } catch (error) {
        console.error('Error getting documentary:', error);
        throw error;
        } finally {
        await connection.close();
        }
    }

}

module.exports =  Documentary;