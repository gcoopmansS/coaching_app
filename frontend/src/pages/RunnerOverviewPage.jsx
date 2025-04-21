import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Paper, Avatar, Stack, Divider } from "@mui/material";
import GradientButton from "../components/GradientButton";
import WorkoutModal from "../components/WorkoutModal";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

// Styles for calendar (you can customize later)

import "../styles/fullcalendar.css";

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

  const calendarEvents = workouts.map((workout) => ({
    id: workout._id,
    title: workout.title,
    start: workout.date,
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Runner Overview
      </Typography>

      {runner && (
        <Paper sx={{ p: 2, mb: 3, display: "flex", alignItems: "center" }}>
          <Avatar
            src={`http://localhost:3000${runner.profilePicture || ""}`}
            sx={{ width: 64, height: 64, mr: 2 }}
          />
          <Box>
            <Typography variant="h6">{runner.name}</Typography>
            <Typography>Email: {runner.email}</Typography>
            <Typography>City: {runner.city || "—"}</Typography>
          </Box>
        </Paper>
      )}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6">Planned Workouts</Typography>
        <GradientButton variant="contained" onClick={() => setShowModal(true)}>
          + Schedule Workout
        </GradientButton>
      </Stack>

      <Paper sx={{ p: 2, mb: 3 }}>
        {workouts.length > 0 ? (
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridWeek"
            events={calendarEvents}
            firstDay={1} // Monday
            height="auto"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
          />
        ) : (
          <Typography>No workouts scheduled yet.</Typography>
        )}
      </Paper>

      <Divider sx={{ my: 3 }} />

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
  );
}
