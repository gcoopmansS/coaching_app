import { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  IconButton,
  Typography,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import GradientButton from "./GradientButton";
import theme from "../theme/theme";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import InputMask from "react-input-mask";

const durationTypes = ["time", "distance"];
const intensityTypes = ["none", "pace", "heartRate", "speed"];

export default function BlockEditor({
  block = {},
  onChange,
  onDelete,
  nested = false,
  dragHandleProps = {},
  indexPath = [],
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

  const deleteNestedBlock = (i) => {
    const updatedBlocks = [...(block.blocks || [])];
    updatedBlocks.splice(i, 1);
    update("blocks", updatedBlocks);
  };

  const addNestedBlock = () => {
    const newBlock = {
      type: "run",
      durationType: "distance",
      duration: "1",
      distanceUnit: "km",
      intensityType: "pace",
      intensity: "06:00",
      description: "",
      editing: false,
    };
    update("blocks", [...(block.blocks || []), newBlock]);
  };

  const type = (block.type || "").toLowerCase();
  const color = theme.colors[type] || "#ccc";

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: theme.borderRadius.md,
        mb: 2,
        borderLeft: `6px solid ${color}`,
        backgroundColor: nested ? "#fff" : theme.colors.background,
        fontSize: "0.9rem",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={1}>
          {dragHandleProps && (
            <Box
              {...dragHandleProps}
              sx={{
                display: "flex",
                alignItems: "center",
                pr: 1,
                opacity: 0.6,
                transition: "opacity 0.2s",
                "&:hover": { opacity: 1 },
                cursor: "grab",
              }}
            >
              <DragIndicatorIcon fontSize="small" />
            </Box>
          )}
          <Typography variant="subtitle1" fontWeight="bold">
            {block.type?.charAt(0).toUpperCase() + block.type.slice(1)}
          </Typography>
        </Stack>

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

      {block.type === "repeat" ? (
        <>
          {editing && (
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
          )}

          <DragDropContext
            onDragEnd={({ source, destination }) => {
              if (!destination || source.index === destination.index) return;
              const updated = Array.from(block.blocks || []);
              const [moved] = updated.splice(source.index, 1);
              updated.splice(destination.index, 0, moved);
              update("blocks", updated);
            }}
          >
            <Droppable droppableId={`repeat-${indexPath.join("-")}`}>
              {(provided) => (
                <Stack
                  spacing={1}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{ pl: 2, mt: 2 }}
                >
                  {(block.blocks || []).map((b, i) => (
                    <Draggable
                      key={`repeat-${indexPath.join("-")}-b-${i}`}
                      draggableId={`repeat-${indexPath.join("-")}-b-${i}`}
                      index={i}
                    >
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <BlockEditor
                            block={b}
                            onChange={(updated) =>
                              handleNestedChange(i, updated)
                            }
                            onDelete={
                              editing ? () => deleteNestedBlock(i) : undefined
                            }
                            nested
                            dragHandleProps={provided.dragHandleProps}
                            indexPath={[...indexPath, i]}
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

          {editing && (
            <Box sx={{ mt: 2 }}>
              <GradientButton
                onClick={addNestedBlock}
                size="small"
                variant="outlined"
              >
                Add Block to Repeat
              </GradientButton>
            </Box>
          )}
        </>
      ) : editing ? (
        <>
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

          {block.durationType === "distance" ? (
            <Stack
              direction="row"
              spacing={1}
              alignItems="flex-end"
              sx={{ mt: 2 }}
            >
              <TextField
                label="Distance"
                type="number"
                value={block.duration || ""}
                onChange={(e) => update("duration", e.target.value)}
                fullWidth
                variant="outlined"
                size="medium"
              />
              <TextField
                select
                label="Unit"
                value={block.distanceUnit || "km"}
                onChange={(e) => update("distanceUnit", e.target.value)}
                variant="outlined"
                size="medium"
                sx={{ width: 120 }}
              >
                <MenuItem value="km">km</MenuItem>
                <MenuItem value="m">m</MenuItem>
              </TextField>
            </Stack>
          ) : (
            <TextField
              label="Time (minutes)"
              type="number"
              value={block.duration || ""}
              onChange={(e) => update("duration", e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
          )}

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
            <>
              {block.intensityType === "pace" ? (
                <InputMask
                  mask="9:99"
                  value={block.intensity || ""}
                  onChange={(e) => update("intensity", e.target.value)}
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      label="Pace (mm:ss)"
                      fullWidth
                      sx={{ mt: 2 }}
                      helperText="Enter in mm:ss format"
                    />
                  )}
                </InputMask>
              ) : (
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
          {block.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
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
                {block.durationType === "distance"
                  ? block.distanceUnit || "km"
                  : "min"}
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
