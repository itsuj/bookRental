const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const authMiddleware = require('../middlewares/upload');
const bookController = require('');

// Middleware to protect routes
const { verifyToken, isAdmin } = authMiddleware;

// Route to get all books (accessible to all users)
router.get('/books', bookController.getBooks);

// Route to add a new book (only accessible to Admins)
router.post('/book/add', [verifyToken, isAdmin], upload.single('coverImage'), bookController.addBook);

// Route to rent a book (only authenticated users)
router.post('/rent/:bookId', verifyToken, bookController.rentBook);

// Route to return a rented book (only authenticated users)
router.post('/return/:bookId', verifyToken, bookController.returnBook);

// Route to delete a book (only accessible to Admins)
router.delete('/book/:bookId', [verifyToken, isAdmin], bookController.deleteBook);

module.exports = router;
