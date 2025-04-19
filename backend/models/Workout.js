const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["warmup", "run", "cooldown", "rest", "loop"],
    required: true,
  },
  description: String,
  distance: String, // e.g. "200m"
  pace: String, // e.g. "5:00/km"
  duration: String, // optional
  repeat: Number, // only for loops
  blocks: [this], // nested blocks for loops
});

const workoutSchema = new mongoose.Schema({
  runnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: Date, required: true },
  title: String,
  notes: String,
  blocks: [blockSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Workout", workoutSchema);
