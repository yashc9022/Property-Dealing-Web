const mongoose = require('mongoose'); // ✅ This line was missing

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  address: { type: String, required: true },
  images: [String], // Multiple images as an array
  contact: {
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // for later use
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
