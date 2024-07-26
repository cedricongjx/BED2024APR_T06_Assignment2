const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

class Documentary {
  constructor(docid, title, documentary, docdate, image,doccategory) {
    this.docid = docid;
    this.title = title;
    this.documentary = documentary;
    this.docdate = docdate;
    this.image = image;
    this.doccategory = doccategory
  }

  static async getAllDocs() {
    const connection = await sql.connect(dbConfig);
    try
    {
    const query = `
    SELECT * from documentary;
    `;
    const request = connection.request();
    const result = await request.query(query);
    return result.recordset.map(
      (row) => new Documentary(row.docid,row.title,row.documentary,row.docdate,row.image, row.doccategory)
    );
    } catch (error) {
    console.error('Error getting documentary:', error);
    throw error;
    } finally {
    await connection.close();
    }
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
      return result.recordset[0]
          ? new Documentary(
              result.recordset[0].docid,
              result.recordset[0].title,
              result.recordset[0].documentary,
              result.recordset[0].docdate,
              result.recordset[0].image,
              result.recordset[0].doccategory
          )
          :null;
      } catch (error) {
      console.error('Error getting documentary:', error);
      throw error;
      } finally {
      await connection.close();
      }
  }
  
  static async updateDocByID(id, title, documentary, docdate, image, doccategory) {
    const connection = await sql.connect(dbConfig);
    try {
      const query = `
        UPDATE documentary
        SET title = @title, docdate = @docdate, documentary = @documentary, image = @image, doccategory = @doccat
        WHERE docid = @id
      `;
      const request = connection.request();
      request.input('id', sql.Int, id);
      request.input('title', title);
      request.input('docdate', sql.Date, docdate);
      request.input('documentary', sql.NVarChar, documentary);
      request.input('image', sql.NVarChar, image);
      request.input('doccat', doccategory);
      const result = await request.query(query);
      return this.getDocbyID(id);
    } catch (error) {
      console.error('Error updating documentary:', error);
      throw error;
    } 
  }

  static async createDoc(title, documentary, docdate, image) {
    const connection = await sql.connect(dbConfig);
    try
    {
    const query = `
    INSERT into Documentary(title, documentary, docdate, image, doccategory) values (@title, @documentary, @docdate, @image, @doccat) select scope_identity() AS docid`;
    ;
    const request = connection.request();
    request.input('title', sql.NVarChar, title);
    request.input('docdate', sql.Date, docdate);
    request.input('documentary', sql.NVarChar, documentary);
    request.input('image', sql.NVarChar, image);
    request.input('doccat', doccategory)
    const result = await request.query(query);
    const docid = result.recordset[0].docid;
    return this.getDocbyID(docid);
    } catch (error) {
    console.error('Error creating documentary:', error);
    throw error;
    }
  }

  static async deleteDocbyID(id) {
    const connection = await sql.connect(dbConfig);
    try {
      const query = `
        DELETE FROM documentary WHERE docid = @id;
      `;
      const request = connection.request();
      request.input('id', sql.Int, id);
      const result = await request.query(query);
      return result.rowsAffected[0];
    } catch (error) {
      console.error('Error updating documentary:', error);
      throw error;
    } finally {
      await connection.close();
    }
  }

  static async getDocsbyCat(doccategory) {
    const connection = await sql.connect(dbConfig);
    try
    {
    const query = `
      SELECT * from documentary where doccategory = @doccategory
    `;
    const request = connection.request();
    request.input('doccategory', doccategory);
    const result = await request.query(query);
    return result.recordset.map(
      (row) => new Documentary(row.docid,row.title,row.documentary,row.docdate,row.image, row.doccategory)
    );
    } catch (error) {
    console.error('Error getting documentaries:', error);
    throw error;
    } finally {
    await connection.close();
    }
  }

  static async searchDoc(searchTerm) {
    const connection = await sql.connect(dbConfig);
    try{
      const query = `SELECT * FROM documentary WHERE title LIKE '%${searchTerm}%'`;
      const request = connection.request();
      const result = await request.query(query);
      return result.recordset.map(
        (row) => new Documentary(row.docid,row.title,row.documentary,row.docdate,row.image, row.doccategory)
      );
    } catch (error) {
    console.error('Error getting documentaries:', error);
    throw error;
    } finally {
    await connection.close();
    }
    
}

}

module.exports =  Documentary;