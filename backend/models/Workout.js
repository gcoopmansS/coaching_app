const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema({
  type: { type: String, required: true },
  description: String,
  durationType: String,
  duration: String,
  intensityType: String,
  intensity: String,
  blocks: [this], // allows nested loops
  repeat: String,
});

const workoutSchema = new mongoose.Schema(
  {
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
    title: { type: String, required: true },
    blocks: [blockSchema], // ✅ include blocks
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);
