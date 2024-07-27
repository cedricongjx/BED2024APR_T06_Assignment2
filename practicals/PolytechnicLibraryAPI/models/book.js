const sql = require('mssql');
const dbConfig = require('../dbConfigs');

class Book {
  constructor(book_id, title, author, availability) {
    this.book_id = book_id;
    this.title = title;
    this.author = author;
    this.availability = availability;
  }

  static async getAll() {
    try {
      const pool = await sql.connect(dbConfig);

      const result = await pool
        .request()
        .query('SELECT * FROM Books');

      const books = result.recordset.map(book => new Book(book.book_id, book.title, book.author, book.availability));
      return books;
    } catch (error) {
      console.error('Error retrieving books:', error);
      throw error;
    }
  }

  static async updateAvailability(bookId, availability) {
    try {
      const pool = await sql.connect(dbConfig);

      const result = await pool
        .request()
        .input('bookId', sql.Int, bookId)
        .input('availability', sql.Char, availability)
        .query('UPDATE Books SET availability = @availability WHERE book_id = @bookId');

      if (result.rowsAffected[0] !== 1) {
        throw new Error('Failed to update book availability');
      }

      return true;
    } catch (error) {
      console.error('Error updating book availability:', error);
      throw error;
    }
  }
}



module.exports = Book;
