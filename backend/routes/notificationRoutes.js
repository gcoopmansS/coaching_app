const express = require("express");
const {
  getNotifications,
  markNotificationsSeen,
} = require("../controllers/notificationController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Protected routes
router.get("/users/:id/notifications", protect, getNotifications);
router.patch(
  "/users/:id/notifications/mark-seen",
  protect,
  markNotificationsSeen
);

module.exports = router;
