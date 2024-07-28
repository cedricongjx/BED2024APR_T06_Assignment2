// Import required modules
const sql = require("mssql");
const dbConfig = require("../dbConfig");
const { number } = require("joi");

// Define User class
class User {
  constructor(userId, username, password, role = 'U') {
    this.userId = userId;
    this.username = username;
    this.password = password;
    this.role = role;
  }

  // Method to get all users with their associated events
  static async getAllUserWithEvents() {
    // Establish connection to the database
    const connection = await sql.connect(dbConfig);
    
    // SQL query to get user data along with their events
    const sqlQuery = `
      SELECT 
          u.Userid AS userid, 
          u.username, 
          ev.Eventid AS Eventid, 
          ev.eventName, 
          ev.eventDescription, 
          ev.eventDateTime
      FROM 
          users u
      LEFT JOIN 
          EventsWithUsers ewu ON ewu.userid = u.Userid
      LEFT JOIN 
          Event ev ON ev.eventid = ewu.eventid
      ORDER BY 
          u.Userid;
    `;
    
    // Execute the query
    const result = await connection.request().query(sqlQuery);
    
    // Process the result to structure the data
    const usersWithEvents = {};
    result.recordset.forEach(row => {
      const { userid, username, password, Eventid, eventName, eventDescription, eventDateTime } = row;
      if (!usersWithEvents[userid]) {
        usersWithEvents[userid] = {
          userid,
          username,
          password,
          events: []
        };
      }
      if (Eventid) {
        usersWithEvents[userid].events.push({
          Eventid,
          eventName,
          eventDescription,
          eventDateTime
        });
      }
    });
    
    // Return the structured data
    return Object.values(usersWithEvents);
  }

  // Method to get a specific user by ID along with their events
  static async getUserWithEventsById(userId) {
    // Establish connection to the database
    const connection = await sql.connect(dbConfig);
    
    // SQL query to get a specific user's data along with their events
    const sqlQuery = `
      SELECT 
          u.Userid AS userid, 
          u.username, 
          ev.Eventid AS Eventid, 
          ev.eventName, 
          ev.eventDescription, 
          ev.eventDateTime,
          ev.Image,
          ev.location
      FROM 
          users u
      LEFT JOIN 
          EventWithUsers ewu ON ewu.userid = u.Userid
      LEFT JOIN 
          Event ev ON ev.eventid = ewu.eventid
      WHERE u.Userid = @userId
      ORDER BY 
          u.Userid;
    `;
    
    // Execute the query
    const result = await connection.request()
        .input('userId', sql.Int, userId)
        .query(sqlQuery);
    
    // Process the result to structure the data
    const usersWithEvents = {};
    result.recordset.forEach(row => {
      const { userid, username, Eventid, eventName, eventDescription, eventDateTime, Image, location } = row;
      if (!usersWithEvents[userid]) {
        usersWithEvents[userid] = {
          userid,
          username,
          events: []
        };
      }
      if (Eventid) {
        usersWithEvents[userid].events.push({
          Eventid,
          EventName: eventName, // Change the key to EventName
          eventDescription,
          eventDateTime,
          Image: Image ? `${Image}` : 'https://via.placeholder.com/400x300', // Properly assign the image URL
          location // Include the location in the event object
        });
      }
    });
    
    // Return the structured data
    return Object.values(usersWithEvents);
  }

  // Method to create a new user
  static async createUser({ username, password, role = 'U' }) {
    // Establish connection to the database
    const connection = await sql.connect(dbConfig);
    try {
      // SQL query to insert a new user
      const query = `
        INSERT INTO Users (username, password, role)
        VALUES (@username, @password, @role);
        SELECT SCOPE_IDENTITY() AS Userid;
      `;
      
      // Prepare and execute the query
      const request = connection.request();
      request.input("username", sql.VarChar, username);
      request.input("password", sql.VarChar, password);
      request.input("role", sql.Char, role);

      const result = await request.query(query);
      const userId = result.recordset[0].Userid;

      // Return the newly created user
      return new User(userId, username, password, role);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    } finally {
      // Close the connection
      await connection.close();
    }
  }

  // Method to get a user by username
  static async getUserByUsername(username) {
    // Establish connection to the database
    const connection = await sql.connect(dbConfig);
    try {
      // SQL query to get a user by username
      const query = `
        SELECT Userid, username, password, role
        FROM Users
        WHERE username = @username;
      `;

      // Prepare and execute the query
      const request = connection.request();
      request.input("username", sql.VarChar, username);

      const result = await request.query(query);
      if (result.recordset.length > 0) {
        const user = result.recordset[0];
        return new User(user.Userid, user.username, user.password, user.role);
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    } finally {
      // Close the connection
      await connection.close();
    }
  }

  // Method to get all users
  static async getAllUsers() {
    // Establish connection to the database
    const connection = await sql.connect(dbConfig);
    try {
      // SQL query to get all users
      const query = `SELECT * FROM Users`;
      const result = await connection.request().query(query);
      return result.recordset.map(row => new User(row.Userid, row.username, row.password));
    } catch (error) {
      console.error('Error retrieving users:', error);
      throw error;
    } finally {
      // Close the connection
      await connection.close();
    }
  }

  // Method to get a user by ID
  static async getUserById(userId) {
    // Establish connection to the database
    const connection = await sql.connect(dbConfig);
    try {
      // SQL query to get a user by ID
      const query = `SELECT * FROM Users WHERE Userid = @userId`;
      const request = connection.request();
      request.input('userId', sql.Int, userId);
      const result = await request.query(query);
      if (result.recordset.length === 0) {
        return null;
      }
      const user = result.recordset[0];
      return new User(user.Userid, user.username, user.password, user.role);
    } catch (error) {
      console.error('Error retrieving user by ID:', error);
      throw error;
    } finally {
      // Close the connection
      await connection.close();
    }
  }

  // Method to update a user's information
  static async updateUser(userId, newUserData) {
    // Establish connection to the database
    const connection = await sql.connect(dbConfig);
    try {
      // SQL query to update a user
      const query = `
        UPDATE Users
        SET username = @username, password = @password
        WHERE Userid = @userId;
        SELECT * FROM Users WHERE Userid = @userId;
      `;
      const request = connection.request();
      request.input('userId', sql.Int, userId);
      request.input('username', sql.VarChar, newUserData.username);
      request.input('password', sql.VarChar, newUserData.password);
      const result = await request.query(query);
      if (result.recordset.length === 0) {
        return null;
      }
      const updatedUser = result.recordset[0];
      return new User(updatedUser.Userid, updatedUser.username, updatedUser.password, updatedUser.role);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    } finally {
      // Close the connection
      await connection.close();
    }
  }

  // Method to delete a user
  static async deleteUser(userId) {
    // Establish connection to the database
    const connection = await sql.connect(dbConfig);
    try {
      // SQL query to delete a user
      const query = `
        DELETE FROM Users
        WHERE Userid = @userId;
      `;
      const request = connection.request();
      request.input('userId', sql.Int, userId);
      const result = await request.query(query);
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error deleting user in database:', error);
      throw error;
    } finally {
      // Close the connection
      await connection.close();
    }
  }

  // Method to search users by a search term
  static async searchUsers(searchTerm) {
    // Establish connection to the database
    const connection = await sql.connect(dbConfig);
    try {
      // SQL query to search for users
      const query = `
        SELECT * FROM Users
        WHERE username LIKE @searchTerm
      `;
      const request = connection.request();
      request.input('searchTerm', sql.VarChar, `%${searchTerm}%`);
      const result = await request.query(query);
      return result.recordset.map(row => new User(row.Userid, row.username, row.password, row.role));
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    } finally {
      // Close the connection
      await connection.close();
    }
  }

  // Method to get users for a specific event
  static async getUsersForEvent(id) {
    // Establish connection to the database
    const connection = await sql.connect(dbConfig);
    // SQL query to get users for a specific event
    const sqlQuery = `
      SELECT 
          u.username
      FROM 
          EventWithUsers eu
      JOIN 
          Users u ON eu.userid = u.userid
      WHERE 
          eu.Eventid = @Eventid;
    `;
    const request = connection.request();
    request.input("Eventid", sql.Int, id); 
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset;
  }

  // Method to register a user for an event
  static async registerUserEvent(details) {
    // Establish connection to the database
    const connection = await sql.connect(dbConfig);
    // SQL query to register a user for an event
    const sqlQuery = `Insert into EventWithUsers (Eventid, userid) values (@Eventid, @userid)`;
    const request = connection.request();
    request.input("Eventid", details.eventid);
    request.input("userid", details.userid);
    await request.query(sqlQuery);
    connection.close();
    return true;
  }

  // Method to remove a user from an event
  static async removeUserFromEvent(details) {
    // Establish connection to the database
    const connection = await sql.connect(dbConfig);
    // SQL query to remove a user from an event
    const sqlQuery = `Delete from EventWithUsers where userid = @userid and Eventid = @Eventid`;
    const request = connection.request();
    request.input("Eventid", sql.Int, details.eventid);
    request.input("userid", sql.Int, details.userid);
    await request.query(sqlQuery);
    connection.close();
    return true;
  }

  // Method to check if a user is registered for an event
  static async isUserRegisteredForEvent(details) {
    // Establish connection to the database
    const connection = await sql.connect(dbConfig);
    // SQL query to check if a user is registered for an event
    const sqlQuery = `SELECT COUNT(*) AS count
                      FROM EventWithUsers
                      WHERE userid = @userid AND Eventid = @Eventid`;
    const request = connection.request();
    request.input("Eventid", sql.Int, details.eventid);
    request.input("userid", sql.Int, details.userid);
    
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset[0].count > 0;
  }
}

// Export the User class
module.exports = User;
