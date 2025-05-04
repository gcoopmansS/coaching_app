import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function CoachDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user?.id) {
      console.error(
        "No token or user ID found. Skipping coach dashboard fetch."
      );
      return;
    }

    fetch(`${API_URL}/api/connections/coach/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.status === 401) {
          console.warn("Unauthorized, clearing session...");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch athletes");

        const data = await res.json();
        setRequests(data.filter((r) => r.status === "accepted"));
      })
      .catch((err) => console.error("Failed to load athletes:", err))
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Athletes
      </Typography>

      {loading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card>
                <Skeleton variant="rectangular" height={160} />
                <CardContent>
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                  <Skeleton width="50%" />
                  <Skeleton width="30%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : requests.length === 0 ? (
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
