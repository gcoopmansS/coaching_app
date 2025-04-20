// src/components/BlockEditor.jsx
import {
  Box,
  TextField,
  MenuItem,
  Stack,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const blockTypes = [
  { value: "warmup", label: "Warm-up" },
  { value: "run", label: "Run" },
  { value: "rest", label: "Rest" },
  { value: "cooldown", label: "Cool-down" },
  { value: "loop", label: "Repeat" },
];

const intensityOptions = ["none", "pace", "heartrate", "speed"];

export default function BlockEditor({ block, onChange, onDelete }) {
  const handleChange = (key, value) => {
    onChange({ ...block, [key]: value });
  };

  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: 2,
        p: 2,
        mb: 2,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            select
            label="Type"
            value={block.type}
            onChange={(e) => handleChange("type", e.target.value)}
            sx={{ width: 180 }}
          >
            {blockTypes.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          <IconButton onClick={onDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </Stack>

        {(block.type === "run" || block.type === "rest") && (
          <>
            <TextField
              label="Distance (e.g. 2km or 200m)"
              value={block.distance || ""}
              onChange={(e) => handleChange("distance", e.target.value)}
              fullWidth
            />

            <TextField
              select
              label="Intensity"
              value={block.intensity || "none"}
              onChange={(e) => handleChange("intensity", e.target.value)}
              fullWidth
            >
              {intensityOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt === "none"
                    ? "None"
                    : opt.charAt(0).toUpperCase() + opt.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}

        {block.type === "loop" && (
          <>
            <TextField
              type="number"
              label="Repeat Count"
              value={block.repeat || ""}
              onChange={(e) => handleChange("repeat", e.target.value)}
              fullWidth
            />
            <Typography variant="body2" color="text.secondary">
              You can add nested blocks later.
            </Typography>
          </>
        )}

        <TextField
          label="Notes / Description"
          value={block.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          fullWidth
        />
      </Stack>
    </Box>
  );
}
