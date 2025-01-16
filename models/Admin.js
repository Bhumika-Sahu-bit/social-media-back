const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true, // Ensure usernames are unique
    required: true,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
