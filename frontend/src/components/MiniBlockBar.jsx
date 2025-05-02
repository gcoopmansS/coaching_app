import { Box, Tooltip, Typography } from "@mui/material";
import { getBlockDistance } from "../utils/workoutMetrics";
import theme from "../theme/theme";

export default function MiniBlockBar({ blocks = [], height = 22 }) {
  const blockHeights = {
    run: height,
    warmup: height * 0.8,
    cooldown: height * 0.8,
    rest: height * 0.6,
    repeat: height * 0.6,
  };

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
      <Box
        sx={{ display: "flex", position: "relative", alignItems: "flex-end" }}
      >
        {expandedBlocks.map((block, i) => {
          const distance = getBlockDistance(block);
          const type = (block.type || "").toLowerCase();
          const color = theme.colors[type] || "#ccc";
          const barHeight = blockHeights[type] || height;

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
                  height: barHeight,
                  backgroundColor: color,
                  position: "relative",
                  borderRight:
                    i < expandedBlocks.length - 1
                      ? `1px solid ${theme.colors.divider}`
                      : "none",
                  borderRadius: theme.borderRadius.sm,
                }}
              >
                {showLabel && (
                  <Typography
                    variant="caption"
                    sx={{
                      position: "absolute",
                      top: barHeight + 6,
                      right: i === expandedBlocks.length - 1 ? 8 : 0,
                      transform: "translateX(50%)",
                      ...theme.typography.caption,
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
