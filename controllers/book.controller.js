const Book = require('../models/book');

exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json({ books });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
};


/**
 * Add a new book
 */
exports.addBook = async (req, res) => {
    try {
        const { title, author } = req.body;
        const coverImage = req.file ? `/uploads/${req.file.filename}` : null; 

        const newBook = new Book({ title, author, coverImage });
        await newBook.save();

        res.status(201).json({ message: 'Book added', book: newBook });
    } catch (error) {
        res.status(500).json({ message: 'Error adding book', error });
    }
};

/**
 * Rent a book
 */
exports.rentBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user.id; // user ID is stored in `req.user` after authentication

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        if (!book.available) return res.status(400).json({ message: 'Book is already rented' });

        book.available = false;
        book.rentedBy = userId;
        await book.save();

        res.json({ message: 'Book rented successfully', book });
    } catch (error) {
        res.status(500).json({ message: 'Error renting book', error });
    }
};

/**
 * Return a rented book
 */
exports.returnBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user.id; 

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        if (book.available) return res.status(400).json({ message: 'Book is already available' });
        if (book.rentedBy.toString() !== userId) return res.status(403).json({ message: 'You did not rent this book' });

        book.available = true;
        book.rentedBy = null;
        await book.save();

        res.json({ message: 'Book returned successfully', book });
    } catch (error) {
        res.status(500).json({ message: 'Error returning book', error });
    }
};

/**
 * Delete a book
 */
exports.deleteBook = async (req, res) => {
    try {
        const { bookId } = req.params;

        const book = await Book.findByIdAndDelete(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error });
    }
};
