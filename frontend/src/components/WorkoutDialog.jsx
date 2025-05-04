import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Stack,
  Box,
  Tooltip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GradientButton from "./GradientButton";
import BlockEditor from "./BlockEditor";
import BlockPreview from "./WorkoutPreviewBlock";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import {
  getWorkoutTotalDistance,
  getWorkoutTotalTime,
} from "../utils/workoutMetrics";

const API_URL = import.meta.env.VITE_API_URL;

export default function WorkoutDialog({
  open,
  onClose,
  mode = "view", // "view" | "edit" | "create"
  initialWorkout = {},
  runnerId,
  coachId,
  editable = false,
}) {
  const [editMode, setEditMode] = useState(
    mode === "edit" || mode === "create"
  );
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    if (editMode && coachId) {
      const token = localStorage.getItem("token");
      fetch(`${API_URL}/api/saved-workouts/${coachId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setSavedWorkouts)
        .catch((err) => console.error("Failed to fetch saved workouts:", err));
    }
  }, [editMode, coachId]);

  useEffect(() => {
    if (mode === "create") {
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
    } else if (initialWorkout) {
      setTitle(initialWorkout.title || "");
      setDate(initialWorkout.date?.slice(0, 10) || "");
      setBlocks(initialWorkout.blocks || []);
    }
  }, [initialWorkout, mode]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const payload = {
      runnerId,
      coachId,
      title,
      date,
      blocks,
    };

    const url = initialWorkout._id
      ? `${API_URL}/api/workouts/${initialWorkout._id}`
      : `${API_URL}/api/workouts`;
    const method = initialWorkout._id ? "PATCH" : "POST";

    try {
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
        console.error("Failed to save workout");
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this workout?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/api/workouts/${initialWorkout._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onClose(true);
    } catch (err) {
      console.error("Delete error:", err);
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

  const handleSelectSaved = (id) => {
    setSelectedId(id);
    const selected = savedWorkouts.find((w) => w._id === id);
    if (selected) {
      setTitle(selected.title);
      setBlocks(selected.blocks || []);
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
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {editMode ? "Edit Workout" : initialWorkout?.title || "Workout"}
        </Typography>

        <Stack direction="row" spacing={1}>
          {!editMode && editable && (
            <Tooltip title="Edit">
              <IconButton onClick={() => setEditMode(true)} size="small">
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {editMode && initialWorkout?._id && (
            <Tooltip title="Delete">
              <IconButton onClick={handleDelete} size="small">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          <IconButton onClick={() => onClose(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {editMode ? (
          <Stack spacing={2}>
            {mode === "create" && (
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
            )}
            <TextField
              label="Title"
              fullWidth
              size="small"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              type="date"
              label="Date"
              fullWidth
              size="small"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

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
                                const updatedBlocks = [...blocks];
                                updatedBlocks[i] = updated;
                                setBlocks(updatedBlocks);
                              }}
                              onDelete={() => {
                                const updatedBlocks = [...blocks];
                                updatedBlocks.splice(i, 1);
                                setBlocks(updatedBlocks);
                              }}
                              dragHandleProps={provided.dragHandleProps}
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
          </Stack>
        ) : (
          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              {new Date(initialWorkout?.date).toLocaleDateString()}
            </Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Estimated: {getWorkoutTotalDistance(blocks).toFixed(2)} km •{" "}
              {Math.round(getWorkoutTotalTime(blocks))} min
            </Typography>
            <Stack spacing={2}>
              {blocks.map((block, i) => (
                <BlockPreview key={i} block={block} />
              ))}
            </Stack>
          </Box>
        )}
      </DialogContent>

      {editMode && (
        <DialogActions sx={{ p: 2 }}>
          <GradientButton onClick={handleSave} variant="contained">
            Save Workout
          </GradientButton>
        </DialogActions>
      )}
    </Dialog>
  );
}
