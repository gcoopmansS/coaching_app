import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, Stack } from "@mui/material";
import Navbar from "../components/Navbar";
import WorkoutModal from "../components/WorkoutModal";
import GradientButton from "../components/GradientButton";

export default function RunnerOverviewPage() {
  const { id } = useParams();
  const [runner, setRunner] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/api/users/${id}`)
      .then((res) => res.json())
      .then(setRunner);

    fetchWorkouts();
  }, [id]);

  const fetchWorkouts = () => {
    fetch(`http://localhost:3000/api/workouts/runner/${id}`)
      .then((res) => res.json())
      .then(setWorkouts)
      .catch((err) => console.error("Error loading workouts:", err));
  };

  return (
    <>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Runner Overview
        </Typography>

        {runner && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6">{runner.name}</Typography>
            <Typography>Email: {runner.email}</Typography>
            <Typography>City: {runner.city || "—"}</Typography>
          </Paper>
        )}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h6">Planned Workouts</Typography>
          <GradientButton
            variant="contained"
            onClick={() => setShowModal(true)}
          >
            + Schedule Workout
          </GradientButton>
        </Stack>

        {/* Placeholder workout list */}
        <Paper sx={{ p: 2, mb: 3 }}>
          {workouts.length > 0 ? (
            <ul>
              {workouts.map((w) => (
                <li key={w._id}>
                  {w.date} – {w.title} ({w.distance} km)
                </li>
              ))}
            </ul>
          ) : (
            <Typography>No workouts scheduled yet.</Typography>
          )}
        </Paper>

        {/* Placeholder for future stats/chart */}
        <Paper sx={{ p: 2 }}>
          <Typography>📊 Weekly stats coming soon...</Typography>
        </Paper>

        <WorkoutModal
          open={showModal}
          onClose={(refresh) => {
            setShowModal(false);
            if (refresh) fetchWorkouts();
          }}
          runnerId={id}
        />
      </Box>
    </>
  );
}
