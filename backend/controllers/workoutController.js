const Workout = require("../models/Workout");

exports.createWorkout = async (req, res) => {
  try {
    const newWorkout = new Workout({
      coachId: req.body.coachId,
      runnerId: req.body.runnerId,
      title: req.body.title,
      date: req.body.date,
      distance: req.body.distance,
    });

    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (err) {
    console.error("Workout save error:", err);
    res.status(500).json({ message: "Failed to save workout" });
  }
};
exports.getRunnerWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ runnerId: req.params.id });
    res.json(workouts);
  } catch (err) {
    console.error("Failed to fetch workouts:", err);
    res.status(500).json({ message: "Server error" });
  }
};

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
