import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GradientButton from "./GradientButton";
import { useEffect, useState } from "react";

const durationTypes = ["time", "distance"];
const intensityTypes = ["none", "pace", "heartRate", "speed"];
const blockTypes = ["warmup", "run", "rest", "cooldown", "repeat"];

export default function BlockEditDialog({
  open,
  onClose,
  initialBlock,
  onSave,
}) {
  const [block, setBlock] = useState({});

  useEffect(() => {
    if (open) {
      // Fallbacks ensure all fields are defined
      setBlock({
        type: initialBlock?.type || "run",
        description: initialBlock?.description || "",
        durationType: initialBlock?.durationType || "distance",
        duration: initialBlock?.duration || "",
        intensityType: initialBlock?.intensityType || "none",
        intensity: initialBlock?.intensity || "",
        repeat: initialBlock?.repeat || 2,
        blocks: initialBlock?.blocks || [],
      });
    }
  }, [open, initialBlock]);

  const update = (field, value) => {
    setBlock((prev) => ({ ...prev, [field]: value }));
  };

  const isRepeat = block.type === "repeat";

  return (
    <Dialog open={open} onClose={() => onClose(false)} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>Edit Block</Typography>
        <Tooltip title="Close">
          <IconButton onClick={() => onClose(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <TextField
            select
            label="Type"
            value={block.type}
            onChange={(e) => update("type", e.target.value)}
            fullWidth
          >
            {blockTypes.map((t) => (
              <MenuItem key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          {isRepeat ? (
            <TextField
              label="Repeat Count"
              type="number"
              value={block.repeat}
              onChange={(e) => update("repeat", e.target.value)}
              fullWidth
            />
          ) : (
            <>
              <TextField
                label="Description"
                value={block.description}
                onChange={(e) => update("description", e.target.value)}
                fullWidth
              />

              <TextField
                select
                label="Duration Type"
                value={block.durationType}
                onChange={(e) => update("durationType", e.target.value)}
                fullWidth
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
                value={block.duration}
                onChange={(e) => update("duration", e.target.value)}
                fullWidth
              />

              <TextField
                select
                label="Intensity Type"
                value={block.intensityType}
                onChange={(e) => update("intensityType", e.target.value)}
                fullWidth
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
                  value={block.intensity}
                  onChange={(e) => update("intensity", e.target.value)}
                  fullWidth
                />
              )}
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <GradientButton onClick={() => onClose(false)} variant="outlined">
          Cancel
        </GradientButton>
        <GradientButton onClick={() => onSave(block)} variant="contained">
          Save
        </GradientButton>
      </DialogActions>
    </Dialog>
  );
}
