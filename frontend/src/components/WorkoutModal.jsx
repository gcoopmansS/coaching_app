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

  const addBlock = (type, parentIndex = null) => {
    const newBlock = {
      type,
      isEditing: true,
      durationType: "distance",
      durationValue: "",
      durationUnit: "km",
      intensityType: "",
      intensity: "",
      description: "",
      repeat: type === "loop" ? 1 : undefined,
      blocks: type === "loop" ? [] : undefined,
    };

    const updated = [...blocks];
    if (parentIndex !== null) {
      updated[parentIndex].blocks.push(newBlock);
    } else {
      updated.push(newBlock);
    }

    setBlocks(updated);
  };

  const handleChange = (index, field, value, parentIndex = null) => {
    const updated = [...blocks];
    const block =
      parentIndex !== null
        ? updated[parentIndex].blocks[index]
        : updated[index];
    block[field] = value;
    setBlocks(updated);
  };

  const handleToggleEdit = (index, parentIndex = null) => {
    const updated = [...blocks];
    const block =
      parentIndex !== null
        ? updated[parentIndex].blocks[index]
        : updated[index];
    block.isEditing = !block.isEditing;
    setBlocks(updated);
  };

  const getBlockIcon = (type) => {
    switch (type) {
      case "warmup":
        return "🔥";
      case "run":
        return "🏃";
      case "rest":
        return "😴";
      case "cooldown":
        return "❄️";
      case "loop":
        return "🔁";
      default:
        return "🧱";
    }
  };

  const renderBlock = (block, index, parentIndex = null) => {
    const isNested = parentIndex !== null;

    return (
      <Box
        key={`${parentIndex !== null ? `${parentIndex}-` : ""}${index}`}
        sx={{
          p: 2,
          mb: 2,
          border: "1px solid #ddd",
          borderRadius: 1,
          background: "#f9f9f9",
          ml: isNested ? 2 : 0,
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
                handleChange(index, "type", e.target.value, parentIndex)
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
              <>
                <TextField
                  fullWidth
                  label="Repeat count"
                  type="number"
                  value={block.repeat || ""}
                  onChange={(e) =>
                    handleChange(index, "repeat", e.target.value, parentIndex)
                  }
                  sx={{ mb: 1 }}
                />
                <Box sx={{ mb: 1 }}>
                  {block.blocks.map((nestedBlock, nestedIndex) =>
                    renderBlock(nestedBlock, nestedIndex, index)
                  )}
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {blockTypes
                      .filter((bt) => bt.value !== "loop")
                      .map((bt) => (
                        <GradientButton
                          key={bt.value}
                          size="small"
                          onClick={() => addBlock(bt.value, index)}
                        >
                          ➕ {bt.label}
                        </GradientButton>
                      ))}
                  </Box>
                </Box>
              </>
            ) : (
              <>
                <TextField
                  select
                  fullWidth
                  label="Duration Type"
                  value={block.durationType}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "durationType",
                      e.target.value,
                      parentIndex
                    )
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
                          e.target.value,
                          parentIndex
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
                          e.target.value,
                          parentIndex
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
                      handleChange(
                        index,
                        "duration",
                        e.target.value,
                        parentIndex
                      )
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
                          e.target.value,
                          parentIndex
                        )
                      }
                      sx={{ mb: 1 }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="pace">Pace (min/km)</MenuItem>
                      <MenuItem value="heartRate">Heart Rate Zone</MenuItem>
                      <MenuItem value="speed">Speed (km/h)</MenuItem>
                    </TextField>

                    {block.intensityType && (
                      <TextField
                        fullWidth
                        label={`Intensity - ${block.intensityType}`}
                        value={block.intensity}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "intensity",
                            e.target.value,
                            parentIndex
                          )
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
                onClick={() => handleToggleEdit(index, parentIndex)}
              >
                ✅ Done
              </Button>
            </Box>
          </>
        ) : (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {getBlockIcon(block.type)} {block.type.toUpperCase()}
            </Typography>

            {block.type === "loop" ? (
              <>
                <Typography sx={{ ml: 2 }}>
                  🔁 Repeat {block.repeat}x:
                </Typography>
                {block.blocks.map((nestedBlock, nestedIndex) => (
                  <Typography key={nestedIndex} sx={{ ml: 3 }}>
                    • {getBlockIcon(nestedBlock.type)} {nestedBlock.type} •{" "}
                    {nestedBlock.durationValue
                      ? `${nestedBlock.durationValue}${nestedBlock.durationUnit}`
                      : `${nestedBlock.duration}min`}
                    {nestedBlock.intensity &&
                      ` • ${nestedBlock.intensityType}: ${nestedBlock.intensity}`}
                  </Typography>
                ))}
              </>
            ) : (
              <Typography>
                {block.durationValue
                  ? `${block.durationValue}${block.durationUnit}`
                  : `${block.duration}min`}
                {block.intensity &&
                  ` • ${block.intensityType}: ${block.intensity}`}
              </Typography>
            )}

            <Box textAlign="right" mt={1}>
              <Button
                size="small"
                onClick={() => handleToggleEdit(index, parentIndex)}
              >
                ✏️ Edit
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  const handleSave = () => {
    onSave({ title, blocks });
    onClose();
  };

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
        </Box>

        <Box sx={{ p: 3, overflowY: "auto", flex: 1 }}>
          <TextField
            fullWidth
            label="Workout Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 3 }}
          />

          {blocks.map((block, index) => renderBlock(block, index))}

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
