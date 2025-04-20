import { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  IconButton,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import GradientButton from "./GradientButton";

const blockTypes = ["warmup", "run", "rest", "cooldown", "loop"];
const durationTypes = ["time", "distance"];
const intensityTypes = ["none", "pace", "heartRate", "speed"];

export default function BlockEditor({ block, onChange, onDelete }) {
  const [editing, setEditing] = useState(block.editing ?? true);

  const update = (field, value) => {
    onChange({ ...block, [field]: value });
  };

  const toggleEdit = () => setEditing(!editing);

  const handleNestedChange = (i, updated) => {
    const updatedBlocks = [...(block.blocks || [])];
    updatedBlocks[i] = updated;
    update("blocks", updatedBlocks);
  };

  const addNestedBlock = () => {
    const newBlock = {
      type: "run",
      durationType: "distance",
      duration: "",
      intensityType: "none",
      intensity: "",
    };
    update("blocks", [...(block.blocks || []), newBlock]);
  };

  const deleteNestedBlock = (i) => {
    const updatedBlocks = [...(block.blocks || [])];
    updatedBlocks.splice(i, 1);
    update("blocks", updatedBlocks);
  };

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        mb: 2,
        border: "1px solid #ccc",
        background: "#f9f9f9",
      }}
    >
      {editing ? (
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">🧱 Block</Typography>
            <IconButton onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Stack>

          <TextField
            select
            label="Type"
            value={block.type}
            onChange={(e) => update("type", e.target.value)}
          >
            {blockTypes.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>

          {block.type === "loop" && (
            <>
              <TextField
                label="Repeat"
                type="number"
                value={block.repeat || ""}
                onChange={(e) => update("repeat", e.target.value)}
              />

              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2">Nested Blocks</Typography>

              {(block.blocks || []).map((b, i) => (
                <BlockEditor
                  key={i}
                  block={b}
                  onChange={(updated) => handleNestedChange(i, updated)}
                  onDelete={() => deleteNestedBlock(i)}
                />
              ))}

              <GradientButton
                onClick={addNestedBlock}
                size="small"
                color="secondary"
              >
                ➕ Add Inner Block
              </GradientButton>
            </>
          )}

          {block.type !== "loop" && (
            <>
              <TextField
                label="Description"
                value={block.description || ""}
                onChange={(e) => update("description", e.target.value)}
              />

              <TextField
                select
                label="Duration Type"
                value={block.durationType || "distance"}
                onChange={(e) => update("durationType", e.target.value)}
              >
                {durationTypes.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label={
                  block.durationType === "distance"
                    ? "Distance (km)"
                    : "Time (min)"
                }
                value={block.duration || ""}
                onChange={(e) => update("duration", e.target.value)}
              />

              <TextField
                select
                label="Intensity Type"
                value={block.intensityType || "none"}
                onChange={(e) => update("intensityType", e.target.value)}
              >
                {intensityTypes.map((i) => (
                  <MenuItem key={i} value={i}>
                    {i}
                  </MenuItem>
                ))}
              </TextField>

              {block.intensityType !== "none" && (
                <TextField
                  label="Intensity"
                  value={block.intensity || ""}
                  onChange={(e) => update("intensity", e.target.value)}
                />
              )}
            </>
          )}

          <GradientButton onClick={toggleEdit} size="small" color="neutral">
            ✅ Done
          </GradientButton>
        </Stack>
      ) : (
        <Box onClick={toggleEdit}>
          <Typography>
            📌 {block.type.toUpperCase()} – {block.duration || "No duration"}{" "}
            {block.durationType}
          </Typography>
          {block.type === "loop" &&
            (block.blocks || []).map((b, i) => (
              <Typography key={i} sx={{ ml: 2 }}>
                🔁 {b.type}: {b.duration} {b.durationType}
              </Typography>
            ))}
        </Box>
      )}
    </Box>
  );
}
