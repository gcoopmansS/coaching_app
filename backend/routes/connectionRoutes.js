const express = require("express");
const {
  createConnection,
  updateConnectionStatus,
  getCoachConnections,
  checkConnection,
} = require("../controllers/connectionController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/connections", protect, createConnection);
router.patch("/connections/:id/status", protect, updateConnectionStatus);
router.get("/connections/coach/:coachId", protect, getCoachConnections);
router.get("/connections/check/:runnerId/:coachId", protect, checkConnection);
module.exports = router;
