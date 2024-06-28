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
  
    static async updateDocByID(id, title, docdate, documentary, image) {
      const connection = await sql.connect(dbConfig);
      try {
        const query = `
          UPDATE documentary
          SET title = @title, docdate = @docdate, documentary = @documentary, image = @image
          WHERE docid = @id
        `;
        const request = connection.request();
        request.input('id', sql.Int, id);
        request.input('title', sql.NVarChar, title);
        request.input('docdate', sql.Date, docdate);
        request.input('documentary', sql.NVarChar, documentary);
        request.input('image', sql.NVarChar, image);
        const result = await request.query(query);
        return result.rowsAffected[0]; // Returns the number of rows affected
      } catch (error) {
        console.error('Error updating documentary:', error);
        throw error;
      } finally {
        await connection.close();
      }
    }


}

module.exports =  Documentary;