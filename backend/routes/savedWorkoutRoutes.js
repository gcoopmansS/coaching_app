const express = require("express");
const {
  createSavedWorkout,
  getSavedWorkoutsByCoach,
  deleteSavedWorkout,
} = require("../controllers/savedWorkoutController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/saved-workouts", protect, createSavedWorkout);
router.get("/saved-workouts/:coachId", getSavedWorkoutsByCoach);
router.delete("/saved-workouts/:id", protect, deleteSavedWorkout);

module.exports = router;
