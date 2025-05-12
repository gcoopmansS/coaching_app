const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  message: String,
  type: {
    type: String,
    enum: ["info", "success", "warning", "error"],
    default: "info",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  seen: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  profilePicture: String,
  city: String,
  dateOfBirth: Date,
  bio: String,
  notifications: [notificationSchema], // ✅ this must exist

  strava: {
    accessToken: String,
    refreshToken: String,
    expiresAt: Number, // Unix timestamp
    athleteId: Number,
    username: String,
    firstname: String,
    lastname: String,
    city: String,
    country: String,
    profile: String, // large avatar URL
    profileMedium: String, // medium avatar URL
  },
});

module.exports = mongoose.model("User", userSchema);
