import { Box, Tooltip, Typography } from "@mui/material";
import { getBlockDistance } from "../utils/workoutMetrics";

const blockColors = {
  warmup: "#f44336",
  run: "#2196f3",
  rest: "#9e9e9e",
  cooldown: "#4caf50",
  repeat: "#795548",
};

export default function MiniBlockBar({ blocks = [], height = 22 }) {
  const expandedBlocks = [];

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

  let cumulativeDistance = 0;
  let lastLabelDistance = 0;
  const labelMinDelta = 0.5;

  return (
    <Box sx={{ width: "100%", mt: 2, mb: 1, pr: 2 }}>
      {" "}
      {/* right padding added here */}
      <Box sx={{ display: "flex", position: "relative", height }}>
        {expandedBlocks.map((block, i) => {
          const distance = getBlockDistance(block);
          const type = (block.type || "").toLowerCase();
          const color = blockColors[type] || "#ccc";
          cumulativeDistance += distance;

          const showLabel =
            cumulativeDistance - lastLabelDistance >= labelMinDelta;
          if (showLabel) lastLabelDistance = cumulativeDistance;

          return (
            <Tooltip key={i} title={`${distance.toFixed(2)} km`} arrow>
              <Box
                sx={{
                  flexGrow: distance,
                  flexBasis: 0,
                  height: "100%",
                  backgroundColor: color,
                  position: "relative",
                  borderRight:
                    i < expandedBlocks.length - 1 ? "1px solid #eee" : "none",
                  borderRadius: "2px",
                }}
              >
                {showLabel && (
                  <Typography
                    variant="caption"
                    sx={{
                      position: "absolute",
                      top: height + 6,
                      right: i === expandedBlocks.length - 1 ? 8 : 0, // shift last label left
                      transform: "translateX(50%)",
                      fontSize: "0.72rem",
                      color: "#666",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cumulativeDistance.toFixed(1)} km
                  </Typography>
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}
