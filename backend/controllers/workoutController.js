const Workout = require("../models/Workout");

// ✅ Create a new workout
exports.createWorkout = async (req, res) => {
  try {
    const { coachId, runnerId, title, date, distance, blocks } = req.body;

    const newWorkout = new Workout({
      coachId,
      runnerId,
      title,
      date,
      distance,
      blocks,
    });

    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (err) {
    console.error("Workout save error:", err);
    res.status(500).json({ message: "Failed to save workout" });
  }
};

// ✅ Get all workouts for a runner
exports.getRunnerWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ runnerId: req.params.id });
    res.json(workouts);
  } catch (err) {
    console.error("Failed to fetch workouts:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update full workout (title, date, blocks)
exports.updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, blocks } = req.body;

    const updatedWorkout = await Workout.findByIdAndUpdate(
      id,
      { title, date, blocks },
      { new: true }
    );

    if (!updatedWorkout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json(updatedWorkout);
  } catch (error) {
    console.error("Error updating workout:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedWorkout = await Workout.findByIdAndDelete(id);

    if (!deletedWorkout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.status(200).json({ message: "Workout deleted successfully" });
  } catch (error) {
    console.error("Error deleting workout:", error);
    res.status(500).json({ message: "Server error" });
  }
};
