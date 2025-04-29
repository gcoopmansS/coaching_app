/**
 * @swagger
 * tags:
 *   name: Workouts
 *   description: Manage assigning and fetching workouts
 */

const express = require("express");
const {
  createWorkout,
  getRunnerWorkouts,
} = require("../controllers/workoutController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/workouts:
 *   post:
 *     summary: Create a new workout assigned to a runner
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - runnerId
 *               - coachId
 *               - title
 *               - date
 *               - blocks
 *             properties:
 *               runnerId:
 *                 type: string
 *               coachId:
 *                 type: string
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               blocks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   description: Workout steps
 *     responses:
 *       201:
 *         description: Workout created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

router.post("/workouts", protect, createWorkout);

/**
 * @swagger
 * /api/workouts/runner/{id}:
 *   get:
 *     summary: Get all workouts assigned to a specific runner
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Runner's user ID
 *     responses:
 *       200:
 *         description: List of assigned workouts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */

router.get("/workouts/runner/:id", getRunnerWorkouts);

module.exports = router;
