import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import { formatDate } from "../utils/formatDate";
import GradientButton from "../components/GradientButton";

export default function CoachProfileModal({ coach, open, onClose }) {
  const runner = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({ goal: "", distance: "", pace: "" });
  const [success, setSuccess] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("none"); // none | pending | accepted

  useEffect(() => {
    const checkConnection = async () => {
      if (!coach || !runner) return;

      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:3000/api/connections/check/${runner.id}/${coach._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();

        if (data.exists) {
          setConnectionStatus(data.status); // "pending" or "accepted"
        } else {
          setConnectionStatus("none");
        }
      } catch (err) {
        console.error("Error checking connection:", err);
      }
    };

    checkConnection();
  }, [coach, runner]);

  const handleRequest = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/connections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      body: JSON.stringify({
        runnerId: runner.id,
        coachId: coach._id,
        ...form,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setSuccess("✅ Request sent!");
      setForm({ goal: "", distance: "", pace: "" });
      setConnectionStatus("pending");
    } else {
      setSuccess(data.message || "❌ Failed to send request");
    }
  };

  if (!coach) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Coach Profile</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            src={`http://localhost:3000${coach.profilePicture || ""}`}
            sx={{ width: 100, height: 100 }}
          />
          <Typography variant="h6">{coach.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {coach.email}
          </Typography>
          <Typography variant="body2">📍 {coach.city}</Typography>
          <Typography variant="body2">
            🎂 {formatDate(coach.dateOfBirth)}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {coach.bio}
          </Typography>

          {connectionStatus === "accepted" ? (
            <Typography color="success.main" sx={{ mt: 2 }}>
              🎉 You're already being coached by this coach!
            </Typography>
          ) : connectionStatus === "pending" ? (
            <Typography color="warning.main" sx={{ mt: 2 }}>
              📨 Coaching request already sent!
            </Typography>
          ) : (
            <Box sx={{ width: "100%", mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Request Coaching
              </Typography>

              <input
                placeholder="Your goal (e.g. run a marathon)"
                value={form.goal}
                onChange={(e) => setForm({ ...form, goal: e.target.value })}
                style={{ width: "100%", padding: 8, marginBottom: 8 }}
              />
              <input
                placeholder="Preferred distance (e.g. 10km)"
                value={form.distance}
                onChange={(e) => setForm({ ...form, distance: e.target.value })}
                style={{ width: "100%", padding: 8, marginBottom: 8 }}
              />
              <input
                placeholder="Pace (e.g. 5:00 min/km)"
                value={form.pace}
                onChange={(e) => setForm({ ...form, pace: e.target.value })}
                style={{ width: "100%", padding: 8, marginBottom: 8 }}
              />

              <GradientButton onClick={handleRequest} fullWidth>
                Request coaching
              </GradientButton>

              {success && (
                <Typography color="success.main" sx={{ mt: 1 }}>
                  {success}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
