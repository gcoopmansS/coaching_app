/**
 * @swagger
 * tags:
 *   name: Saved Workouts
 *   description: Manage saved workout templates for coaches
 */

const express = require("express");
const {
  createSavedWorkout,
  getSavedWorkoutsByCoach,
  deleteSavedWorkout,
} = require("../controllers/savedWorkoutController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/saved-workouts:
 *   post:
 *     summary: Save a new workout template
 *     tags: [Saved Workouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - blocks
 *               - coachId
 *             properties:
 *               title:
 *                 type: string
 *               blocks:
 *                 type: array
 *                 items:
 *                   type: object
 *               coachId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Saved workout created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

router.post("/saved-workouts", protect, createSavedWorkout);

/**
 * @swagger
 * /api/saved-workouts/{coachId}:
 *   get:
 *     summary: Get all saved workouts for a coach
 *     tags: [Saved Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: coachId
 *         required: true
 *         schema:
 *           type: string
 *         description: Coach's user ID
 *     responses:
 *       200:
 *         description: List of saved workouts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.get("/saved-workouts/:coachId", getSavedWorkoutsByCoach);

/**
 * @swagger
 * /api/saved-workouts/{id}:
 *   delete:
 *     summary: Delete a saved workout template
 *     tags: [Saved Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Saved Workout ID
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Saved workout not found
 *       500:
 *         description: Server error
 */

router.delete("/saved-workouts/:id", protect, deleteSavedWorkout);

module.exports = router;
