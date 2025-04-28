const Connection = require("../models/Connection");
const User = require("../models/User");

exports.createConnection = async (req, res) => {
  try {
    const { runnerId, coachId, goal, distance, pace } = req.body;

    // Check if a connection already exists
    const existing = await Connection.findOne({
      runnerId,
      coachId,
      status: { $in: ["pending", "accepted"] },
    });

    if (existing) {
      return res.status(400).json({
        message:
          "You already have an active or pending request with this coach.",
      });
    }

    const newConnection = new Connection({
      runnerId,
      coachId,
      goal,
      distance,
      pace,
      status: "pending",
    });

    await newConnection.save();
    res.status(201).json(newConnection);
  } catch (err) {
    console.error("Error creating connection:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateConnectionStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const connection = await Connection.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("runnerId coachId");

    if (!connection) {
      return res.status(404).json({ message: "Connection not found." });
    }

    const runnerId = connection.runnerId?._id || connection.runnerId;
    const coachName = connection.coachId?.name || "a coach";

    const message =
      status === "accepted"
        ? `🎉 Coach ${coachName} accepted your coaching request!`
        : `❌ Coach ${coachName} rejected your coaching request.`;

    const notification = {
      message,
      type: status === "accepted" ? "success" : "error",
      createdAt: new Date(),
      seen: false,
    };

    const updateResult = await User.updateOne(
      { _id: runnerId },
      { $push: { notifications: notification } }
    );

    console.log("📡 Notification update result:", updateResult);

    if (updateResult.modifiedCount === 0) {
      console.warn("⚠️ Notification was not pushed. Runner ID may not match.");
    }

    res.json(connection);
  } catch (err) {
    console.error("🔥 Update request status error:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};
exports.getCoachConnections = async (req, res) => {
  try {
    const requests = await Connection.find({
      coachId: req.params.coachId,
    }).populate("runnerId");
    res.json(requests);
  } catch (err) {
    console.error("Error loading coach requests:", err);
    res.status(500).json({ message: "Failed to load requests" });
  }
};
exports.checkConnection = async (req, res) => {
  try {
    const connection = await Connection.findOne({
      runnerId: req.params.runnerId,
      coachId: req.params.coachId,
    });

    if (connection) {
      return res.json({ exists: true, status: connection.status });
    }

    return res.json({ exists: false });
  } catch (err) {
    console.error("Error checking connection:", err);
    res.status(500).json({ message: "Server error" });
  }
};
