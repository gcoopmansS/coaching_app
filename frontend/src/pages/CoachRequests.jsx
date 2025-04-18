import { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, Stack } from "@mui/material";
import Navbar from "../components/Navbar";

export default function CoachRequests() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/connections/coach/${user.id}`)
      .then((res) => res.json())
      .then((data) => setRequests(data.filter((r) => r.status === "pending")))
      .catch((err) => console.error("Failed to load requests:", err));
  }, [user.id]);

  const respondToRequest = async (id, status) => {
    const res = await fetch(
      `http://localhost:3000/api/connections/${id}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );

    if (res.ok) {
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Incoming Requests
        </Typography>

        {requests.length === 0 && <Typography>No pending requests.</Typography>}

        {requests.map((r) => (
          <Paper key={r._id} sx={{ p: 2, mb: 2 }}>
            <Typography>
              <strong>From:</strong> {r.runnerId.name}
            </Typography>
            <Typography>
              <strong>Goal:</strong> {r.goal}
            </Typography>
            <Typography>
              <strong>Distance:</strong> {r.distance}
            </Typography>
            <Typography>
              <strong>Pace:</strong> {r.pace}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => respondToRequest(r._id, "accepted")}
              >
                Accept
              </Button>
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
      </Box>
    </>
  );
}
