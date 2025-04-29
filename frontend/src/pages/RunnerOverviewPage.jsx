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
import PersonIcon from "@mui/icons-material/Person";
import GradientButton from "../components/GradientButton";
import WorkoutModal from "../components/WorkoutModal";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import BlockPreview from "../components/WorkoutPreviewBlock";

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
    fetch(`http://localhost:3000/api/workouts/runner/${runnerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setWorkouts)
      .catch((err) => console.error("Error loading workouts:", err));
  }, [runnerId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/users/${runnerId}`, {
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

  const renderEventContent = (eventInfo) => {
    const loggedInCoachId = JSON.parse(localStorage.getItem("user"))?.id;
    const isMyWorkout =
      eventInfo.event.extendedProps.coachId === loggedInCoachId;

    return (
      <Box
        tabIndex={0}
        sx={{
          width: "100%",
          backgroundColor: "#ffe3ec",
          border: "1px solid #f48fb1",
          borderRadius: 1,
          padding: "4px",
          paddingRight: isMyWorkout ? "4px" : "16px",
          fontSize: "0.85rem",
          textAlign: "left",
          color: isMyWorkout ? "#ad1457" : "#777",
          whiteSpace: "normal",
          fontWeight: 500,
          transition: "all 0.3s ease",
          outline: "none",
          "&:hover": {
            backgroundColor: "#f8bbd0",
            borderColor: "#f06292",
            boxShadow: 3,
            cursor: "pointer",
          },
          "&:focus": {
            backgroundColor: "#ffe3ec",
            borderColor: "#f48fb1",
            boxShadow: "none",
          },
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {eventInfo.event.title}

        {!isMyWorkout && (
          <Tooltip title="Planned by other coach" arrow>
            <PersonIcon
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                fontSize: "1rem",
                color: "#999",
              }}
            />
          </Tooltip>
        )}
      </Box>
    );
  };

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

    fetch(`http://localhost:3000/api/workouts/${workoutId}`, {
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
            firstDay={1}
            events={calendarEvents}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            editable
            eventDrop={handleEventDrop}
            height="auto"
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
