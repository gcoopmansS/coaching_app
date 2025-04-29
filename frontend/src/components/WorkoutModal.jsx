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
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import GradientButton from "./GradientButton";
import BlockEditor from "./BlockEditor";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

export default function WorkoutModal({
  open,
  onClose,
  runnerId,
  workoutToEdit,
}) {
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
    if (open) {
      if (workoutToEdit) {
        setTitle(workoutToEdit.title || "");
        setDate(workoutToEdit.date?.slice(0, 10) || "");
        setBlocks(workoutToEdit.blocks || []);
        setSelectedId("");
      } else {
        setTitle("");
        setDate("");
        setSelectedId("");
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
    }
  }, [open, workoutToEdit]);

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

      const url = workoutToEdit
        ? `http://localhost:3000/api/workouts/${workoutToEdit._id}`
        : `http://localhost:3000/api/workouts`;

      const method = workoutToEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onClose(true); // refresh workouts
      } else {
        console.error("Failed to save workout");
      }
    } catch (err) {
      console.error("Workout save error:", err);
    }
  };

  const addRunBlock = () => {
    setBlocks((prev) => [
      ...prev,
      {
        type: "run",
        durationType: "distance",
        duration: "",
        intensityType: "none",
        intensity: "",
        description: "",
        editing: true,
      },
    ]);
  };

  const addRepeatBlock = () => {
    setBlocks((prev) => [
      ...prev,
      {
        type: "repeat",
        repeat: "2",
        blocks: [
          {
            type: "run",
            durationType: "distance",
            duration: "1",
            intensityType: "pace",
            intensity: "6:00",
            description: "",
            editing: false,
          },
          {
            type: "rest",
            durationType: "time",
            duration: "1",
            intensityType: "none",
            intensity: "",
            description: "",
            editing: false,
          },
        ],
        editing: true,
      },
    ]);
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
        {workoutToEdit ? "Edit Workout" : "Schedule Workout"}
        <IconButton onClick={() => onClose(false)} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Stack spacing={2}>
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

          <Divider sx={{ my: 1.5 }} />
          <Typography variant="h6">Workout Builder</Typography>

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

          <Stack direction="row" spacing={2}>
            <GradientButton size="small" onClick={addRunBlock}>
              Add Block
            </GradientButton>
            <GradientButton
              size="small"
              onClick={addRepeatBlock}
              color="secondary"
            >
              Add Repeat
            </GradientButton>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <GradientButton color="primary" onClick={handleSave}>
            {workoutToEdit ? "Save Changes" : "Schedule Workout"}
          </GradientButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
