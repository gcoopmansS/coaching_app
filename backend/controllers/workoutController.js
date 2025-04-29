const Workout = require("../models/Workout");

// ✅ Create a new workout (including blocks)
exports.createWorkout = async (req, res) => {
  try {
    const {
      coachId,
      runnerId,
      title,
      date,
      distance,
      blocks, // ✅ now destructured
    } = req.body;

    const newWorkout = new Workout({
      coachId,
      runnerId,
      title,
      date,
      distance,
      blocks, // ✅ ensure it's passed correctly
    });

    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (err) {
    console.error("Workout save error:", err);
    res.status(500).json({ message: "Failed to save workout" });
  }
};

// ✅ Get all workouts for a runner (includes blocks)
exports.getRunnerWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ runnerId: req.params.id });
    res.json(workouts);
  } catch (err) {
    console.error("Failed to fetch workouts:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ PATCH: Update only the date of a workout
exports.updateWorkoutDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    const updatedWorkout = await Workout.findByIdAndUpdate(
      id,
      { date },
      { new: true }
    );

    if (!updatedWorkout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json(updatedWorkout);
  } catch (error) {
    console.error("Error updating workout date:", error);
    res.status(500).json({ message: "Server error" });
  }
};
