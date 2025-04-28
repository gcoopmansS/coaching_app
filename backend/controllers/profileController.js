const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  const { userId, city, dateOfBirth, bio } = req.body;

  try {
    const update = {};
    if (city) update.city = city;
    if (dateOfBirth) update.dateOfBirth = dateOfBirth;
    if (bio) update.bio = bio;
    if (req.file) update.profilePicture = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: updatedUser });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
