const User = require("../models/User");

// Fetch notifications
exports.getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.notifications || []);
  } catch (err) {
    console.error("Fetch user notifications error:", err);
    res.status(500).json({ message: "Failed to load notifications" });
  }
};

// Mark notifications as seen
exports.markNotificationsSeen = async (req, res) => {
  try {
    const result = await User.updateOne(
      { _id: req.params.id },
      { $set: { "notifications.$[elem].seen": true } },
      { arrayFilters: [{ "elem.seen": false }] }
    );

    res.json({ message: "Notifications marked as seen", result });
  } catch (err) {
    console.error("Error marking notifications:", err);
    res.status(500).json({ message: "Failed to mark notifications as seen" });
  }
};
