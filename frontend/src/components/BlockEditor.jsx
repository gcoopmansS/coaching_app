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
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import GradientButton from "./GradientButton";

const blockTypes = ["warmup", "run", "rest", "cooldown", "loop"];
const durationTypes = ["time", "distance"];
const intensityTypes = ["none", "pace", "heartRate", "speed"];

const blockColors = {
  warmup: "#e53935", // red
  run: "#1e88e5", // blue
  rest: "#9e9e9e", // grey
  cooldown: "#43a047", // green
  loop: "#6d4c41", // brown
};

export default function BlockEditor({ block = {}, onChange, onDelete }) {
  const [editing, setEditing] = useState(block.editing ?? false);

  const update = (field, value) => {
    if (!onChange) return;
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

  const color = blockColors[block.type] || "#ccc";

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 1,
        mb: 1.5,
        borderLeft: `6px solid ${color}`,
        background: "#f9f9f9",
        fontSize: "0.9rem",
      }}
    >
      {editing ? (
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">
              {block.type ? block.type.toUpperCase() : "BLOCK"}
            </Typography>
            <IconButton onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Stack>

          <TextField
            select
            label="Type"
            value={block.type || ""}
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
                    : "Time (minutes)"
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

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <GradientButton
              onClick={toggleEdit}
              size="small"
              startIcon={<CheckIcon />}
              sx={{ borderRadius: "20px", px: 2, py: 0.5 }}
            >
              Done
            </GradientButton>
          </Box>
        </Stack>
      ) : (
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {block.type
                ? block.type.charAt(0).toUpperCase() + block.type.slice(1)
                : "Block"}
            </Typography>
            <IconButton onClick={toggleEdit}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Typography variant="body2" sx={{ mt: 1 }}>
            {block.description && (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {block.description}
              </Typography>
            )}
          </Typography>

          <Divider sx={{ my: 1 }} />

          <Stack direction="row" justifyContent="space-between">
            <Box>
              <Typography variant="caption" color="textSecondary">
                Total Distance / Duration
              </Typography>
              <Typography>
                {block.duration || "-"}{" "}
                {block.durationType === "distance" ? "km" : "min"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="textSecondary">
                Intensity
              </Typography>
              <Typography>
                {block.intensityType === "none" ? "-" : block.intensity || "-"}
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
