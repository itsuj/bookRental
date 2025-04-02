const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    coverImage: { type: String }, // URL for the uploaded book cover
    available: { type: Boolean, default: true }, // If false, the book is rented
    rentedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // User renting the book
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', BookSchema);
