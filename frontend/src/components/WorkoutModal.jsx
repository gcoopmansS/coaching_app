// src/components/WorkoutModal.jsx
import {
  Modal,
  Box,
  Typography,
  TextField,
  Stack,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import GradientButton from "./GradientButton";
import BlockEditor from "./BlockEditor";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function WorkoutModal({ open, onClose, runnerId }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [blocks, setBlocks] = useState([]);

  const addBlock = () => {
    setBlocks([...blocks, { type: "run", description: "" }]);
  };

  const updateBlock = (index, updatedBlock) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updatedBlock;
    setBlocks(newBlocks);
  };

  const deleteBlock = (index) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(newBlocks);
  };

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          notes,
          blocks,
          runnerId,
          coachId: user.id,
          date: new Date(),
        }),
      });

      if (res.ok) {
        onClose(true); // pass true to trigger refresh
      } else {
        console.error("Failed to save workout");
      }
    } catch (err) {
      console.error("Workout save error:", err);
    }
  };

  return (
    <Modal open={open} onClose={() => onClose(false)}>
      <Box sx={modalStyle}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">Schedule Workout</Typography>
          <IconButton onClick={() => onClose(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>

        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            label="Notes"
            fullWidth
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {blocks.map((block, index) => (
            <BlockEditor
              key={index}
              block={block}
              onChange={(updated) => updateBlock(index, updated)}
              onDelete={() => deleteBlock(index)}
            />
          ))}

          <GradientButton color="secondary" onClick={addBlock}>
            + Add Block
          </GradientButton>

          <GradientButton color="primary" onClick={handleSave}>
            Save Workout
          </GradientButton>
        </Stack>
      </Box>
    </Modal>
  );
}
