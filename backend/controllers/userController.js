const User = require("../models/User");

// Fetch all coaches
exports.getCoaches = async (req, res) => {
  try {
    const coaches = await User.find({ role: "coach" });
    res.json(coaches);
  } catch (err) {
    console.error("Error fetching coaches:", err);
    res.status(500).json({ message: "Failed to fetch coaches" });
  }
};

// Fetch user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("❌ Fetch user by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
