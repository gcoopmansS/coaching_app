import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import GradientButton from "../components/GradientButton";
import { authFetch } from "../utils/api"; // ✅ authFetch import

const API_URL = import.meta.env.VITE_API_URL;

export default function SavedWorkoutsPage({ user, setUser }) {
  const [workouts, setWorkouts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "coach") return;

    authFetch(`${API_URL}/api/saved-workouts/${user.id}`, {}, () => {
      setUser(null);
      navigate("/login");
    })
      .then((res) => res.json())
      .then((data) => setWorkouts(data))
      .catch((err) => console.error("Error loading saved workouts:", err));
  }, [user, setUser, navigate]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this workout?");
    if (!confirmed) return;

    try {
      await authFetch(
        `${API_URL}/api/saved-workouts/${id}`,
        {
          method: "DELETE",
        },
        () => {
          setUser(null);
          navigate("/login");
        }
      );

      setWorkouts((prev) => prev.filter((w) => w._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleView = (workout) => {
    console.log("Viewing workout:", workout);
    // You could open a preview modal here
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Saved Workouts
      </Typography>

      {workouts.length === 0 ? (
        <Typography>No saved workouts yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {workouts.map((workout) => (
            <Grid item xs={12} md={6} lg={4} key={workout._id}>
              <Card elevation={4}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {workout.title}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 1,
                    }}
                  >
                    <IconButton onClick={() => handleView(workout)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(workout._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 4 }}>
        <GradientButton onClick={() => navigate("/coach")}>
          ← Back to Dashboard
        </GradientButton>
      </Box>
    </Box>
  );
}
