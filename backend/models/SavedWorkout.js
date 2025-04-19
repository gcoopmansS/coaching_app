const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema({
  type: { type: String, required: true },
  description: String,
  durationType: String,
  durationValue: String,
  durationUnit: String,
  intensityType: String,
  intensity: String,
  duration: String,
  repeat: Number,
  blocks: [this],
});

const savedWorkoutSchema = new mongoose.Schema({
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  blocks: [blockSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SavedWorkout", savedWorkoutSchema);
