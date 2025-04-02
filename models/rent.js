const mongoose = require('mongoose');

const RentalSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // CUSTOMER renting the book
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    status: { type: String, enum: ["RENTED", "RETURNED"], default: "RENTED" },
    rentedAt: { type: Date, default: Date.now },
    returnedAt: { type: Date, default: null } // Updated when the book is returned
});

// Ensure that a user can rent only one book at a time
RentalSchema.index({ user: 1 }, { unique: true, partialFilterExpression: { status: "RENTED" } });

module.exports = mongoose.model('Rental', RentalSchema);
