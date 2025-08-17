const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");

const Property = require("../models/Property");
const Review = require("../models/Review");
const authenticateUser = require("../middleware/authenticate");

const router = express.Router();

// Multer config for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ Add Property (Authenticated)
router.post("/", authenticateUser, upload.array("images", 5), async (req, res) => {
  try {
    const { title, description, price, address, phone, email } = req.body;

    if (!title || !description || !price || !address || !phone || !email) {
      return res.status(400).json({ message: "All fields (including phone & email) are required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image" });
    }

    const images = req.files.map((file) => file.filename);

    const newProperty = new Property({
      title,
      description,
      price,
      address,
      images,
      contact: { phone, email },
      createdBy: req.user._id,
    });

    const savedProperty = await newProperty.save();
    console.log("✅ Property saved to DB:", savedProperty);

    res.status(200).json({ message: "Property added successfully!" });
  } catch (error) {
    console.error("❌ Error saving property:", error);
    res.status(500).json({ message: "Error saving property", error: error.message });
  }
});

// ✅ Get All Properties (Public)
router.get("/", async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    console.error("❌ Error fetching properties:", error);
    res.status(500).json({ message: "Failed to fetch properties", error: error.message });
  }
});

// ✅ Get properties created by logged-in user (Authenticated)
router.get("/my-properties", authenticateUser, async (req, res) => {
  try {
    const userId = req.user._id;

    const myProperties = await Property.find({ createdBy: userId });

    if (myProperties.length === 0) {
      return res.status(404).json({ message: "You have not uploaded any properties yet." });
    }

    console.log("📄 User's properties:", myProperties);

    res.status(200).json(myProperties);
  } catch (error) {
    console.error("❌ Error fetching user's properties:", error);
    res.status(500).json({ message: "Failed to fetch user's properties", error: error.message });
  }
});

// ✅ Get Single Property by ID (Authenticated)
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const propertyId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error("❌ Error fetching property by ID:", error);
    res.status(500).json({ message: "Error fetching property", error: error.message });
  }
});

// ✅ Delete Property (Authenticated)
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const propertyId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this property" });
    }

    await Property.findByIdAndDelete(propertyId);

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting property:", error);
    res.status(500).json({ message: "Failed to delete property", error: error.message });
  }
});

// ✅ Update Property (Authenticated)
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const propertyId = req.params.id;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this property" });
    }

    const updatedProperty = await Property.findByIdAndUpdate(propertyId, updateData, { new: true });

    res.status(200).json({ message: "Property updated successfully", updatedProperty });
  } catch (error) {
    console.error("❌ Error updating property:", error);
    res.status(500).json({ message: "Failed to update property", error: error.message });
  }
});

// ✅ Add Review to Property (Public)
router.post("/:id/reviews", async (req, res) => {
  try {
    const propertyId = req.params.id;
    const { userName, rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    if (!userName || !rating) {
      return res.status(400).json({ message: "userName and rating are required" });
    }

    const newReview = new Review({
      propertyId,
      userName,
      rating,
      comment,
    });

    await newReview.save();

    res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("❌ Error adding review:", error);
    res.status(500).json({ message: "Failed to add review", error: error.message });
  }
});

// ✅ Get All Reviews for Property (Public)
router.get("/:id/reviews", async (req, res) => {
  try {
    const propertyId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    const reviews = await Review.find({ propertyId }).sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
});

module.exports = router;
