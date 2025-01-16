const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const router = express.Router();

// Predefined admin password (hashed)
const ADMIN_PASSWORD_HASH = bcrypt.hashSync("admin123", 10);

// Admin login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the password matches the predefined admin password
    const isPasswordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid admin password" });

    let admin = await Admin.findOne({ username });

    if (!admin) {
      console.log("Admin not found, creating a new one");
      // Create a new admin entry for this username
      admin = new Admin({ username });
      await admin.save();
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token });
  } catch (error) {
    console.log("Error during login:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
