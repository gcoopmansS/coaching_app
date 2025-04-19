const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const User = require("./models/User");
const Connection = require("./models/Connection");
const Workout = require("./models/Workout");

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

    // After await request.save();

    const coach = await User.findById(coachId);
    const runner = await User.findById(runnerId); // ✅ fetch the runner too

    if (coach && runner) {
      const notification = {
        message: `${runner.name} requested coaching`,
        type: "info",
        createdAt: new Date(),
        seen: false,
      };
      coach.notifications.push(notification);
      console.log("📬 Pushing notification to coach:", notification);

      await coach.save();
      console.log("✅ Coach after save:", coach);
    }

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

app.get("/api/users/:id/notifications", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user.notifications || []);
  } catch (err) {
    console.error("Fetch user notifications error:", err);
    res.status(500).json({ message: "Failed to load notifications" });
  }
});

app.patch("/api/users/:id/notifications/mark-seen", async (req, res) => {
  try {
    const result = await User.updateOne(
      { _id: req.params.id },
      { $set: { "notifications.$[elem].seen": true } },
      { arrayFilters: [{ "elem.seen": false }] }
    );

    res.json({ message: "Notifications marked as seen", result });
  } catch (err) {
    console.error("Error marking notifications:", err);
    res.status(500).json({ message: "Failed to mark notifications as seen" });
  }
});

app.patch("/api/connections/:id/status", async (req, res) => {
  const { status } = req.body;

  try {
    const connection = await Connection.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("runnerId coachId");

    if (!connection) {
      return res.status(404).json({ message: "Connection not found." });
    }

    const runnerId = connection.runnerId?._id || connection.runnerId;
    const coachName = connection.coachId?.name || "a coach";

    const message =
      status === "accepted"
        ? `🎉 Coach ${coachName} accepted your coaching request!`
        : `❌ Coach ${coachName} rejected your coaching request.`;

    const notification = {
      message,
      type: status === "accepted" ? "success" : "error",
      createdAt: new Date(),
      seen: false,
    };

    const updateResult = await User.updateOne(
      { _id: runnerId },
      { $push: { notifications: notification } }
    );

    console.log("📡 Notification update result:", updateResult);

    if (updateResult.modifiedCount === 0) {
      console.warn("⚠️ Notification was not pushed. Runner ID may not match.");
    }

    res.json(connection);
  } catch (err) {
    console.error("🔥 Update request status error:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
});

app.get("/api/connections/coach/:coachId", async (req, res) => {
  try {
    const requests = await Connection.find({
      coachId: req.params.coachId,
    }).populate("runnerId");
    res.json(requests);
  } catch (err) {
    console.error("Error loading coach requests:", err);
    res.status(500).json({ message: "Failed to load requests" });
  }
});

app.post("/api/workouts", async (req, res) => {
  try {
    const workout = new Workout(req.body);
    await workout.save();
    res.status(201).json({ message: "Workout saved!", workout });
  } catch (err) {
    console.error("Workout save error:", err);
    res.status(500).json({ message: "Failed to save workout" });
  }
});

app.get("/api/workouts/runner/:id", async (req, res) => {
  try {
    const workouts = await Workout.find({ runnerId: req.params.id });
    res.json(workouts);
  } catch (err) {
    console.error("Failed to fetch workouts:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("❌ Fetch user by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
