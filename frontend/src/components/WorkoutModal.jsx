import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GradientButton from "./GradientButton";

const blockTypes = [
  { value: "warmup", label: "Warm-up" },
  { value: "run", label: "Run" },
  { value: "cooldown", label: "Cool-down" },
  { value: "rest", label: "Rest" },
  { value: "loop", label: "Repeat" },
];

export default function WorkoutModal({ open, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([]);

  const addBlock = (type) => {
    setBlocks([
      ...blocks,
      {
        type,
        isEditing: true,
        durationType: "distance",
        durationValue: "",
        durationUnit: "km",
        intensityType: "",
        intensity: "",
        description: "",
        repeat: type === "loop" ? 1 : undefined,
      },
    ]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...blocks];
    updated[index][field] = value;
    setBlocks(updated);
  };

  const handleToggleEdit = (index) => {
    const updated = [...blocks];
    updated[index].isEditing = !updated[index].isEditing;
    setBlocks(updated);
  };

  const handleSave = () => {
    onSave({ title, blocks });
    onClose();
  };

  const calculateTotal = () => {
    let totalDistance = 0;
    let totalTime = 0;

    blocks.forEach((block) => {
      if (block.durationType === "distance" && block.durationValue) {
        const distance = parseFloat(block.durationValue);
        if (!isNaN(distance)) {
          totalDistance +=
            block.durationUnit === "m" ? distance / 1000 : distance;
        }
      } else if (block.durationType === "time" && block.duration) {
        const minutes = parseFloat(block.duration);
        if (!isNaN(minutes)) totalTime += minutes;
      }
    });

    return {
      distance: totalDistance.toFixed(2),
      time: totalTime.toFixed(0),
    };
  };

  const total = calculateTotal();

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: 2,
          maxWidth: 600,
          maxHeight: "90vh",
          mx: "auto",
          mt: 10,
          display: "flex",
          flexDirection: "column",
          boxShadow: 3,
        }}
      >
        <Box sx={{ p: 3, borderBottom: "1px solid #eee" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Create Workout</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
            {total.distance > 0 && `Total Distance: ${total.distance} km`}
            {total.time > 0 && ` • Total Time: ${total.time} min`}
          </Typography>
        </Box>

        <Box sx={{ p: 3, overflowY: "auto", flex: 1 }}>
          <TextField
            fullWidth
            label="Workout Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 3 }}
          />

          {blocks.map((block, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                mb: 2,
                border: "1px solid #ddd",
                borderRadius: 1,
                background: "#f9f9f9",
              }}
            >
              {block.isEditing ? (
                <>
                  <TextField
                    select
                    fullWidth
                    label="Block Type"
                    value={block.type}
                    onChange={(e) =>
                      handleChange(index, "type", e.target.value)
                    }
                    sx={{ mb: 1 }}
                  >
                    {blockTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  {block.type === "loop" ? (
                    <TextField
                      fullWidth
                      label="Repeat count"
                      type="number"
                      value={block.repeat || ""}
                      onChange={(e) =>
                        handleChange(index, "repeat", e.target.value)
                      }
                      sx={{ mb: 1 }}
                    />
                  ) : (
                    <>
                      <TextField
                        select
                        fullWidth
                        label="Duration Type"
                        value={block.durationType}
                        onChange={(e) =>
                          handleChange(index, "durationType", e.target.value)
                        }
                        sx={{ mb: 1 }}
                      >
                        <MenuItem value="distance">Distance</MenuItem>
                        <MenuItem value="time">Time</MenuItem>
                      </TextField>

                      {block.durationType === "distance" ? (
                        <Box display="flex" gap={2} sx={{ mb: 1 }}>
                          <TextField
                            fullWidth
                            label="Distance"
                            type="number"
                            value={block.durationValue}
                            onChange={(e) =>
                              handleChange(
                                index,
                                "durationValue",
                                e.target.value
                              )
                            }
                          />
                          <TextField
                            select
                            label="Unit"
                            value={block.durationUnit}
                            onChange={(e) =>
                              handleChange(
                                index,
                                "durationUnit",
                                e.target.value
                              )
                            }
                            sx={{ width: 100 }}
                          >
                            <MenuItem value="km">km</MenuItem>
                            <MenuItem value="m">m</MenuItem>
                          </TextField>
                        </Box>
                      ) : (
                        <TextField
                          fullWidth
                          label="Time (minutes)"
                          value={block.duration}
                          onChange={(e) =>
                            handleChange(index, "duration", e.target.value)
                          }
                          sx={{ mb: 1 }}
                        />
                      )}

                      {block.type !== "warmup" && (
                        <>
                          <TextField
                            select
                            fullWidth
                            label="Intensity Type"
                            value={block.intensityType}
                            onChange={(e) =>
                              handleChange(
                                index,
                                "intensityType",
                                e.target.value
                              )
                            }
                            sx={{ mb: 1 }}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="pace">Pace (min/km)</MenuItem>
                            <MenuItem value="heartRate">
                              Heart Rate Zone
                            </MenuItem>
                            <MenuItem value="speed">Speed (km/h)</MenuItem>
                          </TextField>

                          {block.intensityType && (
                            <TextField
                              fullWidth
                              label={`Intensity - ${block.intensityType}`}
                              value={block.intensity}
                              onChange={(e) =>
                                handleChange(index, "intensity", e.target.value)
                              }
                              sx={{ mb: 1 }}
                            />
                          )}
                        </>
                      )}
                    </>
                  )}

                  <Box textAlign="right" mt={1}>
                    <Button
                      size="small"
                      onClick={() => handleToggleEdit(index)}
                    >
                      ✅ Done
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Typography>
                    🧱 {block.type.toUpperCase()} •{" "}
                    {block.durationType === "distance"
                      ? `${block.durationValue}${block.durationUnit}`
                      : `${block.duration || "?"} min`}
                    {block.intensity &&
                      ` • ${block.intensityType}: ${block.intensity}`}
                    {block.type === "loop" && ` • Repeat x${block.repeat}`}
                  </Typography>
                  <Box textAlign="right" mt={1}>
                    <Button
                      size="small"
                      onClick={() => handleToggleEdit(index)}
                    >
                      ✏️ Edit
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          ))}

          <Box display="flex" flexWrap="wrap" gap={1}>
            {blockTypes.map((block) => (
              <GradientButton
                key={block.value}
                size="small"
                onClick={() => addBlock(block.value)}
              >
                ➕ {block.label}
              </GradientButton>
            ))}
          </Box>
        </Box>

        <Box sx={{ p: 3, borderTop: "1px solid #eee", textAlign: "right" }}>
          <GradientButton color="primary" onClick={handleSave}>
            💾 Save Workout
          </GradientButton>
        </Box>
      </Box>
    </Modal>
  );
}
