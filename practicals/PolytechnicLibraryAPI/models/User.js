const sql = require('mssql');
const bcrypt = require('bcryptjs');
const dbConfig = require('../dbConfigs');

class User {
  constructor(user_id, username, passwordHash, role) {
    this.user_id = user_id;
    this.username = username;
    this.passwordHash = passwordHash;
    this.role = role;
  }

  static async findByUsername(username) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool
        .request()
        .input('username', sql.VarChar, username)
        .query('SELECT * FROM Users WHERE username = @username');

      if (result.recordset.length > 0) {
        const { user_id, username, passwordHash, role } = result.recordset[0];
        return new User(user_id, username, passwordHash, role);
      }
      return null;
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  }

  static async register(username, password, role) {
    try {
      const pool = await sql.connect(dbConfig);

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Insert user into database
      const result = await pool
        .request()
        .input('username', sql.VarChar, username)
        .input('passwordHash', sql.VarChar, passwordHash)
        .input('role', sql.VarChar, role)
        .query(
          'INSERT INTO Users (username, passwordHash, role) VALUES (@username, @passwordHash, @role); SELECT SCOPE_IDENTITY() AS user_id;'
        );

      const user_id = result.recordset[0].user_id;

      return new User(user_id, username, passwordHash, role);
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
}

module.exports = User;
