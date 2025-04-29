/**
 * @swagger
 * tags:
 *   name: Connections
 *   description: Coaching request and connection management routes
 */

const express = require("express");
const {
  createConnection,
  updateConnectionStatus,
  getCoachConnections,
  checkConnection,
} = require("../controllers/connectionController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/connections:
 *   post:
 *     summary: Request coaching from a coach
 *     tags: [Connections]
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
 *             properties:
 *               runnerId:
 *                 type: string
 *               coachId:
 *                 type: string
 *               goal:
 *                 type: string
 *               distance:
 *                 type: number
 *               pace:
 *                 type: string
 *     responses:
 *       201:
 *         description: Connection created successfully
 *       400:
 *         description: Duplicate or invalid request
 *       500:
 *         description: Server error
 */

router.post("/connections", protect, createConnection);

/**
 * @swagger
 * /api/connections/{id}/status:
 *   patch:
 *     summary: Accept or reject a coaching request
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Connection ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [accepted, rejected]
 *     responses:
 *       200:
 *         description: Connection status updated
 *       404:
 *         description: Connection not found
 *       500:
 *         description: Server error
 */

router.patch("/connections/:id/status", protect, updateConnectionStatus);

/**
 * @swagger
 * /api/connections/coach/{coachId}:
 *   get:
 *     summary: Get all coaching requests for a coach
 *     tags: [Connections]
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
 *         description: List of coaching requests
 *       500:
 *         description: Server error
 */

router.get("/connections/coach/:coachId", protect, getCoachConnections);

/**
 * @swagger
 * /api/connections/check/{runnerId}/{coachId}:
 *   get:
 *     summary: Check if a runner already has a coaching connection with a coach
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: runnerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Runner's user ID
 *       - in: path
 *         name: coachId
 *         required: true
 *         schema:
 *           type: string
 *         description: Coach's user ID
 *     responses:
 *       200:
 *         description: Returns whether a connection exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                 status:
 *                   type: string
 *                   description: Status of the connection (pending/accepted)
 *       500:
 *         description: Server error
 */

router.get("/connections/check/:runnerId/:coachId", protect, checkConnection);
module.exports = router;
