import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";

export default function ScheduleWorkoutModal({ open, onClose, runnerId }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [distance, setDistance] = useState("");

  const handleSubmit = async () => {
    const coach = JSON.parse(localStorage.getItem("user"));
    const workout = {
      runnerId,
      coachId: coach.id || coach._id, // 🧠 support both formats
      title,
      date,
      distance,
    };

    try {
      const response = await fetch("http://localhost:3000/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workout),
      });

      if (response.ok) {
        onClose(true); // signal to reload workouts
      } else {
        console.error("Failed to schedule workout");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} fullWidth>
      <DialogTitle>Schedule New Workout</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Distance (km)"
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
