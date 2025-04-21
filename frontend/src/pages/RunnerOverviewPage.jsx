import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Paper, Stack } from "@mui/material";
import WorkoutModal from "../components/WorkoutModal";
import GradientButton from "../components/GradientButton";

export default function RunnerOverviewPage() {
  const { runnerId } = useParams();
  const [runner, setRunner] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchWorkouts = useCallback(() => {
    fetch(`http://localhost:3000/api/workouts/runner/${runnerId}`)
      .then((res) => res.json())
      .then(setWorkouts)
      .catch((err) => console.error("Error loading workouts:", err));
  }, [runnerId]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/users/${runnerId}`)
      .then((res) => res.json())
      .then(setRunner)
      .catch((err) => console.error("Error loading runner:", err));

    fetchWorkouts();
  }, [runnerId, fetchWorkouts]);

  return (
    <>
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

        <Paper sx={{ p: 2, mb: 3 }}>
          {workouts.length > 0 ? (
            <ul>
              {workouts.map((w) => (
                <li key={w._id}>
                  {new Date(w.date).toLocaleDateString()} – {w.title}
                </li>
              ))}
            </ul>
          ) : (
            <Typography>No workouts scheduled yet.</Typography>
          )}
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography>📊 Weekly stats coming soon...</Typography>
        </Paper>

        <WorkoutModal
          open={showModal}
          onClose={(refresh) => {
            setShowModal(false);
            if (refresh) fetchWorkouts();
          }}
          runnerId={runnerId}
        />
      </Box>
    </>
  );
}
