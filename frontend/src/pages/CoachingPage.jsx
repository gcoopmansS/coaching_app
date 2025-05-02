import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
  Paper,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { authFetch } from "../utils/api"; // ✅ use secure fetch

const API_URL = import.meta.env.VITE_API_URL;

const blockTypes = [
  { label: "Warm-up", value: "warmup" },
  { label: "Run", value: "run" },
  { label: "Cooldown", value: "cooldown" },
  { label: "Rest", value: "rest" },
];

export default function CoachingPage({ setUser }) {
  const { id } = useParams(); // runnerId
  const navigate = useNavigate();
  const coach = JSON.parse(localStorage.getItem("user"));

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [blocks, setBlocks] = useState([]);

  const [newBlock, setNewBlock] = useState({
    type: "run",
    description: "",
    durationType: "distance",
    duration: "",
    pace: "",
  });

  const addBlock = () => {
    setBlocks([...blocks, newBlock]);
    setNewBlock({
      type: "run",
      description: "",
      durationType: "distance",
      duration: "",
      pace: "",
    });
  };

  const submitWorkout = async () => {
    const workout = {
      runnerId: id,
      coachId: coach.id,
      title,
      notes,
      date,
      blocks,
    };

    try {
      const res = await authFetch(
        `${API_URL}/api/workouts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(workout),
        },
        () => {
          setUser(null);
          navigate("/login");
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Workout saved!");
        setTitle("");
        setNotes("");
        setDate("");
        setBlocks([]);
      } else {
        alert("Failed to save workout: " + data.message);
      }
    } catch (err) {
      console.error("Workout save error:", err);
      alert("Error saving workout");
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Plan Workout
        </Typography>

        <Stack spacing={2} maxWidth={500}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={3}
          />
          <TextField
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Paper sx={{ p: 2, mt: 2 }} elevation={2}>
            <Typography variant="h6" gutterBottom>
              Step
            </Typography>

            <TextField
              select
              label="Block Type"
              value={newBlock.type}
              onChange={(e) =>
                setNewBlock({ ...newBlock, type: e.target.value })
              }
              fullWidth
              sx={{ mb: 2 }}
            >
              {blockTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>

            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Duration Type"
                value={newBlock.durationType || "distance"}
                onChange={(e) =>
                  setNewBlock({ ...newBlock, durationType: e.target.value })
                }
                sx={{ flex: 1 }}
              >
                <MenuItem value="distance">Distance</MenuItem>
                <MenuItem value="time">Time</MenuItem>
              </TextField>

              <TextField
                label={
                  newBlock.durationType === "distance"
                    ? "Distance (km)"
                    : "Time (min)"
                }
                type="number"
                inputProps={{ step: 0.1, min: 0 }}
                value={newBlock.duration || ""}
                onChange={(e) =>
                  setNewBlock({ ...newBlock, duration: e.target.value })
                }
                sx={{ flex: 1 }}
              />
            </Stack>

            <TextField
              label="Pace (optional)"
              value={newBlock.pace}
              onChange={(e) =>
                setNewBlock({ ...newBlock, pace: e.target.value })
              }
              fullWidth
              sx={{ mt: 2 }}
            />

            <TextField
              label="Notes"
              value={newBlock.description}
              onChange={(e) =>
                setNewBlock({ ...newBlock, description: e.target.value })
              }
              multiline
              rows={2}
              fullWidth
              sx={{ mt: 2 }}
            />

            <Button onClick={addBlock} variant="contained" sx={{ mt: 2 }}>
              Add Step
            </Button>
          </Paper>

          {blocks.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1">Workout Preview:</Typography>
              {blocks.map((b, i) => (
                <Paper key={i} sx={{ p: 2, my: 1 }}>
                  <Typography>
                    <strong>{b.type.toUpperCase()}</strong>
                  </Typography>
                  <Typography>
                    {b.duration} {b.durationType === "distance" ? "km" : "min"}
                  </Typography>
                  {b.pace && <Typography>Pace: {b.pace}</Typography>}
                  {b.description && <Typography>{b.description}</Typography>}
                </Paper>
              ))}
            </Box>
          )}

          <Button onClick={submitWorkout} variant="contained" color="primary">
            Save Workout
          </Button>
        </Stack>
      </Box>
    </>
  );
}
