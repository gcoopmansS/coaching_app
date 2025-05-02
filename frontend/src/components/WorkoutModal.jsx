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
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import GradientButton from "./GradientButton";
import BlockEditor from "./BlockEditor";
import CloseIcon from "@mui/icons-material/Close";
import theme from "../theme/theme";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const API_URL = import.meta.env.VITE_API_URL;

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
    const token = localStorage.getItem("token");
    if (coach?.id) {
      fetch(`${API_URL}/api/saved-workouts/${coach.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setSavedWorkouts)
        .catch((err) => console.error("Failed to fetch saved workouts:", err));
    }
  }, [coach?.id]);

  useEffect(() => {
    if (workoutToEdit) {
      setTitle(workoutToEdit.title || "");
      setDate(workoutToEdit.date?.slice(0, 10) || "");
      setBlocks(workoutToEdit.blocks || []);
    } else if (open) {
      setTitle("");
      setDate("");
      setBlocks([
        {
          type: "warmup",
          durationType: "distance",
          duration: "1",
          intensityType: "none",
          intensity: "",
          description: "",
        },
        {
          type: "run",
          durationType: "distance",
          duration: "2",
          intensityType: "pace",
          intensity: "6:00",
          description: "",
        },
        {
          type: "cooldown",
          durationType: "distance",
          duration: "1",
          intensityType: "none",
          intensity: "",
          description: "",
        },
      ]);
    }
  }, [open, workoutToEdit]);

  const handleSelectSaved = (id) => {
    setSelectedId(id);
    const selected = savedWorkouts.find((w) => w._id === id);
    if (selected) {
      setTitle(selected.title);
      setBlocks(selected.blocks || []);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const payload = {
      runnerId,
      coachId: coach.id,
      title,
      date,
      blocks,
    };

    try {
      const url = workoutToEdit
        ? `${API_URL}/api/workouts/${workoutToEdit._id}`
        : `${API_URL}/api/workouts`;
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
        onClose(true);
      } else {
        console.error("❌ Failed to save workout.");
      }
    } catch (err) {
      console.error("🔥 Workout save error:", err);
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    const reordered = Array.from(blocks);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);
    setBlocks(reordered);
  };

  const addBlock = () => {
    setBlocks([
      ...blocks,
      {
        type: "run",
        durationType: "distance",
        duration: "",
        intensityType: "none",
        intensity: "",
        description: "",
      },
    ]);
  };

  const addRepeat = () => {
    setBlocks([
      ...blocks,
      {
        type: "repeat",
        repeat: 2,
        blocks: [
          {
            type: "run",
            durationType: "distance",
            duration: "1",
            intensityType: "pace",
            intensity: "5:30",
            description: "",
          },
          {
            type: "rest",
            durationType: "time",
            duration: "1",
            intensityType: "none",
            intensity: "",
            description: "",
          },
        ],
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
          ...theme.typography.heading,
        }}
      >
        {workoutToEdit ? "Edit Workout" : "Schedule Workout"}
        <IconButton onClick={() => onClose(false)} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ fontSize: "0.9rem" }}>
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

            {/* ✅ DRAGGABLE BLOCK LIST */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="blocks">
                {(provided) => (
                  <Stack
                    spacing={2}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {blocks.map((block, i) => (
                      <Draggable
                        key={`block-${i}`}
                        draggableId={`block-${i}`}
                        index={i}
                      >
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            sx={{
                              boxShadow: snapshot.isDragging
                                ? "0 0 8px rgba(0,0,0,0.2)"
                                : "none",
                            }}
                          >
                            <BlockEditor
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
                              dragHandleProps={provided.dragHandleProps} // ✅ passed here
                            />
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Stack>
                )}
              </Droppable>
            </DragDropContext>

            <Stack direction="row" spacing={2}>
              <GradientButton onClick={addBlock} variant="outlined">
                Add Block
              </GradientButton>
              <GradientButton onClick={addRepeat} variant="outlined">
                Add Repeat
              </GradientButton>
            </Stack>

            <Box sx={{ textAlign: "right" }}>
              <GradientButton onClick={handleSave} variant="contained">
                Save Workout
              </GradientButton>
            </Box>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
