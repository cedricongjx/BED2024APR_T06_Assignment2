const Book = require('../models/book');

// Get all books (accessible to both members and librarians)
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.getAll();
    res.json(books);
  } catch (error) {
    console.error('Error retrieving books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update book availability (accessible only to librarians)
const updateBookAvailability = async (req, res) => {
  const { bookId } = req.params;
  const { availability } = req.body;

  try {
    const updated = await Book.updateAvailability(bookId, availability);
    if (updated) {
      res.json({ message: 'Book availability updated successfully' });
    } else {
      throw new Error('Failed to update book availability');
    }
  } catch (error) {
    console.error('Error updating book availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllBooks,
  updateBookAvailability,
};
