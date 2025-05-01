import { Box, Tooltip } from "@mui/material";
import { getBlockDistance } from "../utils/workoutMetrics";

const blockColors = {
  warmup: "#f44336", // red
  run: "#2196f3", // blue
  rest: "#9e9e9e", // gray
  cooldown: "#4caf50", // green
  repeat: "#795548", // brown
};

export default function MiniBlockBar({ blocks = [], height = 18 }) {
  const expandedBlocks = [];

  // Flatten repeat blocks
  for (const block of blocks) {
    if (block.type === "repeat" && Array.isArray(block.blocks)) {
      const repeatCount = block.repeat || 1;
      for (let i = 0; i < repeatCount; i++) {
        block.blocks.forEach((b, idx) => {
          expandedBlocks.push({
            ...b,
            _isRepeat: true,
            _repIdx: i,
            _repDivider: idx === 0 && i > 0,
          });
        });
      }
    } else {
      expandedBlocks.push(block);
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        overflow: "hidden",
        borderRadius: 1,
        mt: 1,
      }}
    >
      {expandedBlocks.map((block, i) => {
        const distance = getBlockDistance(block);
        const type = (block.type || "").toLowerCase();
        const color = blockColors[type] || "#ccc";

        const label = `${type.toUpperCase()} • ${distance.toFixed(2)} km`;

        return (
          <Tooltip key={i} title={label} arrow>
            <Box
              sx={{
                flexGrow: distance,
                flexBasis: 0,
                height,
                backgroundColor: color,
                borderRight:
                  i < expandedBlocks.length - 1 ? "1px solid #eee" : "none",
              }}
            />
          </Tooltip>
        );
      })}
    </Box>
  );
}
