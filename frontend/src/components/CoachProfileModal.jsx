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
import { authFetch } from "../utils/api"; // ✅ import
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function CoachProfileModal({ coach, open, onClose, setUser }) {
  const runner = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({ goal: "", distance: "", pace: "" });
  const [success, setSuccess] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("none");
  const navigate = useNavigate();

  useEffect(() => {
    if (!open || !coach?._id || !runner?.id) return;

    const checkConnection = async () => {
      try {
        const res = await authFetch(
          `${API_URL}/api/connections/check/${runner.id}/${coach._id}`,
          {},
          () => {
            setUser(null);
            navigate("/login");
          }
        );
        const data = await res.json();
        setConnectionStatus(data.exists ? data.status : "none");
      } catch (err) {
        console.error("Error checking connection:", err);
      }
    };

    checkConnection();
  }, [open, coach?._id, runner?.id, setUser, navigate]);

  const handleRequest = async () => {
    try {
      const res = await authFetch(
        `${API_URL}/api/connections`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            runnerId: runner.id,
            coachId: coach._id,
            ...form,
          }),
        },
        () => {
          setUser(null);
          navigate("/login");
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess("Request sent!");
        setForm({ goal: "", distance: "", pace: "" });
        setConnectionStatus("pending");
      } else {
        setSuccess(data.message || "Failed to send request");
      }
    } catch (err) {
      console.error("Request error:", err);
      setSuccess("Something went wrong.");
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
            src={`${API_URL}${coach.profilePicture || ""}`}
            sx={{ width: 100, height: 100 }}
          />
          <Typography variant="h6">{coach.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {coach.email}
          </Typography>
          <Typography variant="body2">City: {coach.city}</Typography>
          <Typography variant="body2">
            DOB: {formatDate(coach.dateOfBirth)}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {coach.bio}
          </Typography>

          {connectionStatus === "accepted" ? (
            <Typography color="success.main" sx={{ mt: 2 }}>
              You're already being coached by this coach!
            </Typography>
          ) : connectionStatus === "pending" ? (
            <Typography color="warning.main" sx={{ mt: 2 }}>
              Coaching request already sent!
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
