// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
