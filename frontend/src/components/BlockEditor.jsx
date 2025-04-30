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

const durationTypes = ["time", "distance"];
const intensityTypes = ["none", "pace", "heartRate", "speed"];

const blockColors = {
  warmup: "#e53935",
  run: "#1e88e5",
  rest: "#9e9e9e",
  cooldown: "#43a047",
  repeat: "#6d4c41",
};

export default function BlockEditor({
  block = {},
  onChange,
  onDelete,
  nested = false,
}) {
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
      duration: "1",
      intensityType: "pace",
      intensity: "6:00",
      description: "",
      editing: false,
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
        mb: 2,
        borderLeft: `6px solid ${color}`,
        backgroundColor: nested ? "#fff" : "#f9f9f9", // 👈 change here
        fontSize: "0.9rem",
      }}
    >
      {/* Header: always show Edit and Delete icons */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight="bold">
          {block.type?.charAt(0).toUpperCase() + block.type.slice(1)}
        </Typography>

        {!editing && (
          <Stack direction="row" spacing={1}>
            <IconButton size="small" onClick={toggleEdit}>
              <EditIcon fontSize="small" />
            </IconButton>
            {onDelete && (
              <IconButton size="small" onClick={onDelete}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        )}
      </Stack>

      {/* Body */}
      {editing ? (
        <>
          {block.type === "repeat" ? (
            <>
              {/* Repeat Block Editing */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mt: 2 }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Repeat
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  inputProps={{ min: 1 }}
                  value={block.repeat || ""}
                  onChange={(e) => update("repeat", e.target.value)}
                  sx={{ width: 80 }}
                />
                <Typography variant="body1">times</Typography>
              </Stack>

              <Stack spacing={2} sx={{ pl: 2, mt: 2 }}>
                {(block.blocks || []).map((b, i) => (
                  <BlockEditor
                    key={i}
                    block={b}
                    onChange={(updated) => handleNestedChange(i, updated)}
                    onDelete={() => deleteNestedBlock(i)}
                    nested={true}
                  />
                ))}
              </Stack>

              <Box sx={{ mt: 2 }}>
                <GradientButton
                  onClick={addNestedBlock}
                  size="small"
                  color="secondary"
                  variant="outlined"
                >
                  Add Block to Repeat
                </GradientButton>
              </Box>
            </>
          ) : (
            <>
              {/* Normal Block Editing */}
              {/* Only show Type field if NOT repeat */}
              <TextField
                select
                label="Type"
                value={block.type || ""}
                onChange={(e) => update("type", e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              >
                <MenuItem value="warmup">Warm-up</MenuItem>
                <MenuItem value="run">Run</MenuItem>
                <MenuItem value="rest">Rest</MenuItem>
                <MenuItem value="cooldown">Cooldown</MenuItem>
              </TextField>

              <TextField
                label="Description"
                value={block.description || ""}
                onChange={(e) => update("description", e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              />

              <TextField
                select
                label="Duration Type"
                value={block.durationType || "distance"}
                onChange={(e) => update("durationType", e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
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
                fullWidth
                sx={{ mt: 2 }}
              />

              <TextField
                select
                label="Intensity Type"
                value={block.intensityType || "none"}
                onChange={(e) => update("intensityType", e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
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
                  fullWidth
                  sx={{ mt: 2 }}
                />
              )}
            </>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <GradientButton
              onClick={toggleEdit}
              size="small"
              startIcon={<CheckIcon />}
              sx={{ borderRadius: "20px", px: 2 }}
            >
              OK
            </GradientButton>
          </Box>
        </>
      ) : (
        <Box sx={{ mt: 2 }}>
          {/* View Mode */}
          {block.type !== "repeat" ? (
            <>
              {block.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {block.description}
                </Typography>
              )}
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Total Duration / Distance
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
                    {block.intensityType === "none"
                      ? "-"
                      : block.intensity || "-"}
                  </Typography>
                </Box>
              </Stack>
            </>
          ) : (
            <>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Repeats: {block.repeat || "-"}x ({block.blocks?.length || 0}{" "}
                steps inside)
              </Typography>

              <Stack spacing={1} sx={{ pl: 2, mt: 1 }}>
                {(block.blocks || []).map((b, i) => (
                  <BlockEditor
                    key={i}
                    block={b}
                    onChange={(updated) => handleNestedChange(i, updated)}
                    onDelete={() => deleteNestedBlock(i)}
                    nested
                  />
                ))}
              </Stack>
            </>
          )}
        </Box>
      )}
    </Box>
  );
}
