import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import GradientButton from "../components/GradientButton";
import { authFetch } from "../utils/api"; // ✅ import helper

const API_URL = import.meta.env.VITE_API_URL;

export default function CoachRequests({ user, setUser }) {
  const [requests, setRequests] = useState([]);
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;

    authFetch(`${API_URL}/api/connections/coach/${user.id}`, {}, () => {
      setUser(null);
      navigate("/login");
    })
      .then((res) => res.json())
      .then(setRequests)
      .catch((err) => console.error("Error loading coach requests:", err));
  }, [user?.id, setUser, navigate]);

  const respondToRequest = async (id, status) => {
    try {
      const res = await authFetch(
        `${API_URL}/api/connections/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
        () => {
          setUser(null);
          navigate("/login");
        }
      );

      if (res.ok) {
        const updated = await res.json();
        setRequests((prev) =>
          prev.map((r) => (r._id === updated._id ? updated : r))
        );
      }
    } catch (err) {
      console.error("Error responding to request:", err);
    }
  };

  const filtered = {
    pending: requests.filter((r) => r.status === "pending"),
    accepted: requests.filter((r) => r.status === "accepted"),
    rejected: requests.filter((r) => r.status === "rejected"),
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Coaching Requests
      </Typography>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label={`Pending (${filtered.pending.length})`} />
        <Tab label={`Accepted (${filtered.accepted.length})`} />
        <Tab label={`Rejected (${filtered.rejected.length})`} />
      </Tabs>

      {tab === 0 &&
        filtered.pending.map((r) => (
          <Paper key={r._id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{r.runnerId.name}</Typography>
            <Typography>Goal: {r.goal}</Typography>
            <Typography>Distance: {r.distance} km</Typography>
            <Typography>Pace: {r.pace}</Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <GradientButton
                variant="contained"
                color="success"
                onClick={() => respondToRequest(r._id, "accepted")}
              >
                Accept
              </GradientButton>
              <Button
                variant="outlined"
                color="error"
                onClick={() => respondToRequest(r._id, "rejected")}
              >
                Reject
              </Button>
            </Stack>
          </Paper>
        ))}

      {tab === 1 &&
        filtered.accepted.map((r) => (
          <Paper key={r._id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{r.runnerId.name}</Typography>
            <Typography>Goal: {r.goal}</Typography>
            <Typography>Distance: {r.distance} km</Typography>
            <Typography>Pace: {r.pace}</Typography>
            <Typography color="success.main" fontWeight="bold">
              Active Coaching
            </Typography>
          </Paper>
        ))}

      {tab === 2 &&
        filtered.rejected.map((r) => (
          <Paper key={r._id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{r.runnerId.name}</Typography>
            <Typography>Goal: {r.goal}</Typography>
            <Typography color="error.main" fontWeight="bold">
              Rejected
            </Typography>
          </Paper>
        ))}
    </Box>
  );
}
