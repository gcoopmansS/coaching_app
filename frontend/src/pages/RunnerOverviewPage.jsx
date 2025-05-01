import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GradientButton from "../components/GradientButton";
import WorkoutModal from "../components/WorkoutModal";
import BlockPreview from "../components/WorkoutPreviewBlock";
import WorkoutCalendar from "../components/WorkoutCalendar"; // <-- REQUIRED
import {
  getWorkoutTotalDistance,
  getWorkoutTotalTime,
} from "../utils/workoutMetrics";

const API_URL = import.meta.env.VITE_API_URL;

export default function RunnerOverviewPage() {
  const { runnerId } = useParams();
  const [runner, setRunner] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [editWorkout, setEditWorkout] = useState(null);

  const fetchWorkouts = useCallback(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/api/workouts/runner/${runnerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setWorkouts)
      .catch((err) => console.error("Error loading workouts:", err));
  }, [runnerId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/api/users/${runnerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
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
      coachId: workout.coachId,
    },
  }));

  const handleEventClick = (info) => {
    const clickedWorkout = workouts.find((w) => w._id === info.event.id);
    if (clickedWorkout) {
      const loggedInCoachId = JSON.parse(localStorage.getItem("user"))?.id;
      const editable = clickedWorkout.coachId === loggedInCoachId;
      setSelectedWorkout({
        ...clickedWorkout,
        blocks: clickedWorkout.blocks || [],
        editable,
      });
      setOpenPreview(true);
    }
  };

  const handleEventDrop = (info) => {
    const workoutId = info.event.id;
    const newDate = info.event.startStr;

    fetch(`${API_URL}/api/workouts/${workoutId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ date: newDate }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update workout date");
        return res.json();
      })
      .then(() => fetchWorkouts())
      .catch((err) => {
        console.error("Workout reschedule error:", err);
        info.revert();
      });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Runner Overview
      </Typography>

      {runner && (
        <Paper sx={{ p: 2, mb: 3, display: "flex", alignItems: "center" }}>
          <Avatar
            src={`${API_URL}${runner.profilePicture || ""}`}
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
          <WorkoutCalendar
            events={calendarEvents}
            onEventClick={handleEventClick}
            onEventDrop={handleEventDrop}
            editable={true}
            highlightCoachId={JSON.parse(localStorage.getItem("user"))?.id}
          />
        ) : (
          <Typography>No workouts scheduled yet.</Typography>
        )}
      </Paper>

      <WorkoutModal
        open={showModal}
        onClose={(refresh) => {
          setShowModal(false);
          setEditWorkout(null);
          if (refresh) fetchWorkouts();
        }}
        runnerId={runnerId}
        workoutToEdit={editWorkout}
      />

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
            {new Date(selectedWorkout?.date).toLocaleDateString()}
          </Typography>

          {selectedWorkout?.blocks && (
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Estimated:{" "}
              {getWorkoutTotalDistance(selectedWorkout.blocks).toFixed(2)} km •{" "}
              {Math.round(getWorkoutTotalTime(selectedWorkout.blocks))} min
            </Typography>
          )}

          <Stack spacing={2}>
            {selectedWorkout?.blocks?.map((block, i) => (
              <BlockPreview key={i} block={block} />
            ))}
          </Stack>

          {selectedWorkout?.editable && (
            <Box sx={{ mt: 3, textAlign: "right" }}>
              <GradientButton
                variant="contained"
                onClick={() => {
                  setOpenPreview(false);
                  setEditWorkout(selectedWorkout);
                  setShowModal(true);
                }}
              >
                Edit Workout
              </GradientButton>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
