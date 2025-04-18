const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
  role: {
    type: String,
    enum: ["runner", "coach"],
    required: true,
  },
  profilePicture: String,
  city: String,
  dateOfBirth: Date,
  bio: String,
});

module.exports = mongoose.model("User", userSchema);
