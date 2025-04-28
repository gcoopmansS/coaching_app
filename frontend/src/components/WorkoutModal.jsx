import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useEffect, useState } from "react";
import GradientButton from "./GradientButton";
import BlockEditor from "./BlockEditor";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

export default function WorkoutModal({ open, onClose, runnerId }) {
  const coach = JSON.parse(localStorage.getItem("user"));
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    if (coach?.id) {
      const token = localStorage.getItem("token");

      fetch(`http://localhost:3000/api/saved-workouts/${coach.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then(setSavedWorkouts)
        .catch((err) => console.error("Failed to fetch saved workouts:", err));
    }
  }, [coach?.id]);

  useEffect(() => {
    if (open && blocks.length === 0 && !selectedId) {
      setBlocks([
        {
          type: "warmup",
          durationType: "distance",
          duration: "1",
          intensityType: "none",
          intensity: "",
          description: "",
          editing: false,
        },
        {
          type: "run",
          durationType: "distance",
          duration: "2",
          intensityType: "pace",
          intensity: "6:00",
          description: "",
          editing: false,
        },
        {
          type: "cooldown",
          durationType: "distance",
          duration: "1",
          intensityType: "none",
          intensity: "",
          description: "",
          editing: false,
        },
      ]);
    }
  }, [open]);

  const handleSelectSaved = (id) => {
    setSelectedId(id);
    const workout = savedWorkouts.find((w) => w._id === id);
    if (workout) {
      setTitle(workout.title);
      setBlocks(workout.blocks || []);
    }
  };

  const handleSave = async () => {
    const payload = {
      runnerId,
      coachId: coach.id,
      title,
      date,
      blocks,
    };

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onClose(true);
      } else {
        console.error("Failed to schedule workout");
      }
    } catch (err) {
      console.error("Workout save error:", err);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Schedule Workout
        <IconButton onClick={() => onClose(false)} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            fontSize: "0.9rem", // 👈 Slightly smaller text
            "& .MuiTextField-root": {
              // 👈 TextFields more compact
              mb: 1.5,
              "& .MuiInputBase-root": {
                fontSize: "0.9rem",
                padding: "8px 10px",
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.8rem",
              },
            },
            "& .MuiTypography-root": {
              fontSize: "0.9rem",
            },
          }}
        >
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Start from saved workout</InputLabel>
              <Select
                value={selectedId}
                onChange={(e) => handleSelectSaved(e.target.value)}
                label="Start from saved workout"
              >
                <MenuItem value="">None</MenuItem>
                {savedWorkouts.map((w) => (
                  <MenuItem key={w._id} value={w._id}>
                    {w.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              size="small"
              label="Workout Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <TextField
              fullWidth
              size="small"
              type="date"
              label="Date"
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            {blocks.map((block, i) => (
              <BlockEditor
                key={i}
                block={block}
                onChange={(updated) => {
                  const newBlocks = [...blocks];
                  newBlocks[i] = updated;
                  setBlocks(newBlocks);
                }}
                onDelete={() => {
                  const newBlocks = [...blocks];
                  newBlocks.splice(i, 1);
                  setBlocks(newBlocks);
                }}
              />
            ))}

            <GradientButton color="primary" onClick={handleSave}>
              💾 Schedule Workout
            </GradientButton>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
