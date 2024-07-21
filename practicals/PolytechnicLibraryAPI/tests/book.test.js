const Book = require("../models/book");
const sql = require("mssql");

jest.mock("mssql"); // Mock the mssql library

describe("Book.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all books from the database", async () => {
    const mockBooks = [
      {
        id: 1,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        availability: "Y",
      },
      {
        id: 2,
        title: "The Hitchhiker's Guide to the Galaxy",
        author: "Douglas Adams",
        availability: "N",
      },
    ];

    const mockRequest = {
      query: jest.fn().mockResolvedValue({ recordset: mockBooks }),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

    const books = await Book.getAll();

    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(books).toHaveLength(2);
    expect(books[0]).toBeInstanceOf(Book);
    expect(books[0].id).toBe(1);
    expect(books[0].title).toBe("The Lord of the Rings");
    expect(books[0].author).toBe("J.R.R. Tolkien");
    expect(books[0].availability).toBe("Y");
    // ... Add assertions for the second book
  });

  it("should handle errors when retrieving books", async () => {
    const errorMessage = "Database Error";
    sql.connect.mockRejectedValue(new Error(errorMessage));
    await expect(Book.getAll()).rejects.toThrow(errorMessage);
  });
});



// book.test.js (continue in the same file)
describe("Book.updateBookAvailability", () => {
  // ... mock mssql and other necessary components
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should update the availability of a book", async () => {
    const mockBook = 
    {
      id: 1,
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      availability: "Y",
    }
    const mockRequest = {
      query: jest.fn().mockResolvedValue({ recordset: mockBook }),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };
    sql.connect.mockResolvedValue(mockConnection);

    const books = await Book.updateAvailability();
    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(books).toHaveLength(1);
    expect(books[0]).toBeInstanceOf(Book);
    expect(books[0].availability).toBe("Y");

    // ... arrange: set up mock book data and mock database interaction
    // ... act: call updateBookAvailability with the test data
    // ... assert: check if the database was updated correctly and the updated book is returned
  });

  it("should return null if book with the given id does not exist", async () => {
    const mockBook = 
    {
      id: -1,
      title: "Fake",
      author: "Fake",
      availability: "Y",
    }
    const mockRequest = {
      query: jest.fn().mockResolvedValue({ recordset: mockBook }),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };
    const book = await Book.updateAvailability(mockBook.id,mockBook.availability);
    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(book).toBe(null);


    // ... arrange: set up mocks for a non-existent book id
    // ... act: call updateBookAvailability
    // ... assert: expect the function to return null
  });

  // Add more tests for error scenarios (e.g., database error)
  it("should handle errors when retrieving books", async () => {
    const errorMessage = "Database Error";
    sql.connect.mockRejectedValue(new Error(errorMessage));
    await expect(Book.updateAvailability()).rejects.toThrow(errorMessage);
  });
});



