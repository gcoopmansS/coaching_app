/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Manage user notifications (fetch, mark seen)
 */

const express = require("express");
const {
  getNotifications,
  markNotificationsSeen,
} = require("../controllers/notificationController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Protected routes

/**
 * @swagger
 * /api/users/{id}/notifications:
 *   get:
 *     summary: Fetch all notifications for a user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   type:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   seen:
 *                     type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.get("/users/:id/notifications", protect, getNotifications);

/**
 * @swagger
 * /api/users/{id}/notifications/mark-seen:
 *   patch:
 *     summary: Mark all unseen notifications as seen
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Notifications marked as seen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.patch(
  "/users/:id/notifications/mark-seen",
  protect,
  markNotificationsSeen
);

module.exports = router;
