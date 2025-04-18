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
});

module.exports = mongoose.model("User", userSchema);
