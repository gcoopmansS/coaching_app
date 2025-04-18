const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const User = require("./models/User");
const Connection = require("./models/Connection");

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/coaching_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "uploads");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// === ROUTES ===

// Sign Up
app.post("/api/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await require("bcrypt").hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
        dateOfBirth: user.dateOfBirth,
        bio: user.bio,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});

// Log In
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await require("bcrypt").compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      message: `Welcome, ${user.name}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
        dateOfBirth: user.dateOfBirth,
        bio: user.bio,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

app.post("/api/connections", async (req, res) => {
  const { runnerId, coachId, goal, distance, pace } = req.body;

  try {
    const existing = await Connection.findOne({
      runnerId,
      coachId,
      status: "pending",
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "You already have a pending request to this coach." });
    }

    const request = new Connection({ runnerId, coachId, goal, distance, pace });
    await request.save();

    res.status(201).json({ message: "Request sent!", connection: request });
  } catch (err) {
    console.error("Request error:", err);
    res.status(500).json({ message: "Failed to send request" });
  }
});

// Profile update (with image)
app.post("/api/profile", upload.single("profilePicture"), async (req, res) => {
  const { userId, city, dateOfBirth, bio } = req.body;

  try {
    const update = {};
    if (city) update.city = city;
    if (dateOfBirth) update.dateOfBirth = dateOfBirth;
    if (bio) update.bio = bio;
    if (req.file) update.profilePicture = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: updatedUser });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

app.get("/api/coaches", async (req, res) => {
  try {
    const coaches = await User.find({ role: "coach" });
    res.json(coaches);
  } catch (err) {
    console.error("Failed to fetch coaches:", err);
    res.status(500).json({ message: "Could not load coaches" });
  }
});
