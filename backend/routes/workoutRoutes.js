const express = require("express");
const {
  createWorkout,
  getRunnerWorkouts,
  updateWorkout,
} = require("../controllers/workoutController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/workouts", protect, createWorkout);
router.get("/workouts/runner/:id", protect, getRunnerWorkouts);
router.patch("/workouts/:id", protect, updateWorkout); // 👈 NEW: full update (title, date, blocks)

module.exports = router;
