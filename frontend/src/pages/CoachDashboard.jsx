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
import Navbar from "../components/Navbar";

export default function CoachDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/api/connections/coach/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        const accepted = data.filter((r) => r.status === "accepted");
        setRequests(accepted);
      })
      .catch((err) => console.error("Failed to load athletes:", err));
  }, [user.id]);

  return (
    <>
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
                    image={`http://localhost:3000${
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
    </>
  );
}
