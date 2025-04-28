const express = require("express");
const {
  createWorkout,
  getRunnerWorkouts,
} = require("../controllers/workoutController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/workouts", protect, createWorkout);
router.get("/workouts/runner/:id", getRunnerWorkouts);

module.exports = router;
