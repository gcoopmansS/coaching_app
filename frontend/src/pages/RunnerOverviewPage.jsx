import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GradientButton from "../components/GradientButton";
import WorkoutModal from "../components/WorkoutModal";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function RunnerOverviewPage() {
  const { runnerId } = useParams();
  const [runner, setRunner] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);

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
    date: workout.date,
    extendedProps: {
      blocks: workout.blocks,
    },
  }));

  const handleEventClick = (info) => {
    const clickedWorkout = workouts.find((w) => w._id === info.event.id);
    if (clickedWorkout) {
      setSelectedWorkout(clickedWorkout);
      setOpenPreview(true);
    }
  };

  const getBlockColor = (type) => {
    switch (type) {
      case "warmup":
        return "#ff6b6b"; // red
      case "run":
        return "#339af0"; // blue
      case "rest":
        return "#ffd43b"; // yellow
      case "cooldown":
        return "#69db7c"; // green
      case "loop":
        return "#845ef7"; // purple
      default:
        return "#adb5bd"; // gray fallback
    }
  };

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
            plugins={[dayGridPlugin]}
            initialView="dayGridWeek"
            firstDay={1}
            events={calendarEvents}
            eventClick={handleEventClick}
            height="auto"
          />
        ) : (
          <Typography>No workouts scheduled yet.</Typography>
        )}
      </Paper>

      {/* Workout Scheduling Modal */}
      <WorkoutModal
        open={showModal}
        onClose={(refresh) => {
          setShowModal(false);
          if (refresh) fetchWorkouts();
        }}
        runnerId={runnerId}
      />

      {/* Workout Preview Modal */}
      <Dialog
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {selectedWorkout?.title}
          <IconButton onClick={() => setOpenPreview(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            📅 {new Date(selectedWorkout?.date).toLocaleDateString()}
          </Typography>

          <Stack spacing={2}>
            {selectedWorkout?.blocks?.map((block, i) => (
              <Box
                key={i}
                sx={{
                  borderLeft: `6px solid ${getBlockColor(block.type)}`,
                  p: 2,
                  background: "#fafafa",
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {block.type?.toUpperCase()}
                </Typography>
                {block.description && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {block.description}
                  </Typography>
                )}
                <Stack direction="row" spacing={2}>
                  <Typography variant="body2">
                    ⏱ {block.duration} {block.durationType}
                  </Typography>
                  {block.intensityType !== "none" && block.intensity && (
                    <Typography variant="body2">
                      🔥 {block.intensityType}: {block.intensity}
                    </Typography>
                  )}
                </Stack>
                {block.type === "loop" && block.blocks?.length > 0 && (
                  <Box sx={{ mt: 1, pl: 2 }}>
                    {block.blocks.map((inner, idx) => (
                      <Typography
                        key={idx}
                        variant="body2"
                        sx={{ fontStyle: "italic" }}
                      >
                        🔁 {inner.type} - {inner.duration} {inner.durationType}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
