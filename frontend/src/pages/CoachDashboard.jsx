import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/api"; // ✅ import the utility

const API_URL = import.meta.env.VITE_API_URL;

export default function CoachDashboard({ user, setUser }) {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;

    const fetchAthletes = async () => {
      try {
        const res = await authFetch(
          `${API_URL}/api/connections/coach/${user.id}`,
          {},
          () => {
            setUser(null);
            navigate("/login");
          }
        );

        const data = await res.json();
        setRequests(data.filter((r) => r.status === "accepted"));
      } catch (err) {
        console.error("Failed to load athletes:", err);
      }
    };

    fetchAthletes();
  }, [user?.id, setUser, navigate]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Athletes
      </Typography>

      {requests.length === 0 ? (
        <Typography>No active coaching connections yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {requests.map((r) => (
            <Grid item xs={12} sm={6} md={4} key={r._id}>
              <Card
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={() => navigate(`/coach/runner/${r.runnerId._id}`)}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={`${API_URL.replace("/api", "")}${
                    r.runnerId.profilePicture || ""
                  }`}
                  alt={r.runnerId.name}
                />
                <CardContent>
                  <Typography variant="h6">{r.runnerId.name}</Typography>
                  <Typography variant="body2">🎯 {r.goal}</Typography>
                  <Typography variant="body2">
                    🏃 Distance: {r.distance}
                  </Typography>
                  <Typography variant="body2">⏱️ Pace: {r.pace}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
