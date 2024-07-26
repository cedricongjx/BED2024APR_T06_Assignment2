const sql = require("mssql");
const dbConfig = require("../dbConfig");
const { number } = require("joi");
//const event = require("../models/event");


// User class definition with methods to interact with the database
class User {
  constructor(userId, username, password, role = 'U') {
    this.userId = userId;
    this.username = username;
    this.password = password;
    this.role = role;
  }

  // Retrieve all users with their associated events
  static async getAllUserWithEvents() {
    const connection = await sql.connect(dbConfig);
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
    const result = await connection.request().query(sqlQuery);
    const usersWithEvents = {};

    // Process each row to map users and their events
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
    return Object.values(usersWithEvents);
  }

  // Retrieve a specific user with their associated events by user ID
  static async getUserWithEventsById(userId) {
    const connection = await sql.connect(dbConfig);
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
      WHERE u.Userid = @userId
      ORDER BY 
          u.Userid;
    `;
    const result = await connection.request()
      .input('userId', sql.Int, userId)
      .query(sqlQuery);

    const usersWithEvents = {};

    // Process each row to map the user and their events
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

    return Object.values(usersWithEvents);
  }

  // Retrieve users associated with a specific event by event ID
  static async getUserForEvent(eventid) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `
      SELECT 
          ev.Eventid AS Eventid, 
          ev.eventName, 
          ev.eventDescription, 
          ev.eventDateTime, 
          u.Userid AS userid, 
          u.username
      FROM 
          Event ev
      INNER JOIN 
          EventsWithUsers ewu ON ev.eventid = ewu.eventid
      INNER JOIN 
          users u ON u.Userid = ewu.userid
      WHERE ev.Eventid = @eventid
      ORDER BY 
          ev.Eventid;
    `;
    const result = await connection.request()
      .input('eventid', sql.Int, eventid)
      .query(sqlQuery);

    // Process the result to map events and their associated users
    const EventsWithUsers = {};
    result.recordset.forEach(row => {
      const { Eventid, eventName, eventDescription, eventDateTime, userid, username } = row;
      if (!EventsWithUsers[Eventid]) {
        EventsWithUsers[Eventid] = {
          Eventid,
          eventName,
          eventDescription,
          eventDateTime,
          users: []
        };
      }
      EventsWithUsers[Eventid].users.push({
        userid,
        username
      });
    });

    return Object.values(EventsWithUsers);
  }

  // Create a new user in the database
  static async createUser({ username, password, role = 'U' }) {
    const connection = await sql.connect(dbConfig);
    try {
      const query = `
        INSERT INTO Users (username, password, role)
        VALUES (@username, @password, @role);
        SELECT SCOPE_IDENTITY() AS Userid;
      `;

      const request = connection.request();
      request.input("username", sql.VarChar, username);
      request.input("password", sql.VarChar, password);
      request.input("role", sql.Char, role);

      const result = await request.query(query);
      const userId = result.recordset[0].Userid;

      return new User(userId, username, password, role);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    } finally {
      await connection.close();
    }
  }

  // Retrieve a user by their username
  static async getUserByUsername(username) {
    const connection = await sql.connect(dbConfig);
    try {
      const query = `
        SELECT Userid, username, password, role
        FROM Users
        WHERE username = @username;
      `;

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
      await connection.close();
    }
  }

// Retrieve all users from the database
static async getAllUsers() {
  const connection = await sql.connect(dbConfig);
  try {
    const query = `SELECT * FROM Users`;
    const result = await connection.request().query(query);
    return result.recordset.map(row => new User(row.Userid, row.username, row.password, row.role));
  } catch (error) {
    console.error('Error retrieving users:', error);
    throw error;
  } finally {
    await connection.close();
  }
}

static async getUserById(userId) {
  const connection = await sql.connect(dbConfig);
  try {
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
    await connection.close();
  }
}

static async updateUser(userId, newUserData) {
  const connection = await sql.connect(dbConfig);
  try {
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
    await connection.close();
  }
}

static async deleteUser(userId) {
  const connection = await sql.connect(dbConfig);
  try {
    const query = `
      DELETE FROM Users
      WHERE Userid = @userId;
    `;
    const request = connection.request();
    request.input('userId', sql.Int, userId);
    const result = await request.query(query);
    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  } finally {
    await connection.close();
  }
}

static async searchUsers(searchTerm) {
  const connection = await sql.connect(dbConfig);
  try {
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
    await connection.close();
  }
}
}

module.exports = User;
