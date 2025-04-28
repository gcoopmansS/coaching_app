const SavedWorkout = require("../models/SavedWorkout");

exports.createSavedWorkout = async (req, res) => {
  try {
    const { title, blocks, coachId } = req.body;
    const newWorkout = new SavedWorkout({ title, blocks, coachId });
    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (err) {
    console.error("Error creating saved workout:", err);
    res.status(500).json({ message: "Failed to save workout" });
  }
};
exports.getSavedWorkoutsByCoach = async (req, res) => {
  try {
    const workouts = await SavedWorkout.find({ coachId: req.params.coachId });
    res.json(workouts);
  } catch (err) {
    console.error("Error fetching saved workouts:", err);
    res.status(500).json({ message: "Failed to load saved workouts" });
  }
};
exports.deleteSavedWorkout = async (req, res) => {
  try {
    await SavedWorkout.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Error deleting saved workout:", err);
    res.status(500).json({ message: "Failed to delete" });
  }
};
