const sql = require('mssql');
const dbConfig = require('../config/dbConfig');

class User {
  constructor(id, username, password) {
    this.id = id;
    this.username = username;
    this.password = password;
  }

  static async createUser(user) {
    const connection = await sql.connect(dbConfig);
    try {
      const query = `
        INSERT INTO Users (username, password)
        VALUES (@username, @password);
        SELECT SCOPE_IDENTITY() AS id;
      `;
      const request = connection.request();
      request.input('username', sql.VarChar, user.username);
      request.input('password', sql.VarChar, user.password);
      const result = await request.query(query);
      const userId = result.recordset[0].id;
      return new User(userId, user.username, user.password);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    } finally {
      await connection.close();
    }
  }

  static async getUserByUsername(username) {
    const connection = await sql.connect(dbConfig);
    try {
      const query = `SELECT * FROM Users WHERE username = @username`;
      const request = connection.request();
      request.input('username', sql.VarChar, username);
      const result = await request.query(query);
      if (result.recordset.length === 0) {
        return null;
      }
      const user = result.recordset[0];
      return new User(user.UserID, user.username, user.password); // Ensure column names match database schema
    } catch (error) {
      console.error('Error retrieving user by username:', error);
      throw error;
    } finally {
      await connection.close();
    }
  }
}

module.exports = User;
