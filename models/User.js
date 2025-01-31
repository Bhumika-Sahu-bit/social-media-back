const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  handle: { type: String, required: true },
  images: [String], // Array of image URLs
});

module.exports = mongoose.model("User", userSchema);
