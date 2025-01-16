const express = require("express");
const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const User = require("../models/User");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "socialMediaTask",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });
const router = express.Router();

router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const { name, handle } = req.body;
    const imageUrls = req.files.map((file) => file.path);

    const user = await User.create({
      name,
      handle,
      images: imageUrls,
    });

    await user.save();
    res.status(201).json({ message: "User data submitted successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
