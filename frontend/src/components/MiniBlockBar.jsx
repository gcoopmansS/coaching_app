import { Box, Tooltip } from "@mui/material";

const blockColors = {
  warmup: "#f44336",
  run: "#2196f3",
  rest: "#9e9e9e",
  cooldown: "#4caf50",
  repeat: "#795548",
};

const safeDuration = (val) => {
  const num = typeof val === "number" ? val : parseFloat(val);
  return isNaN(num) || num <= 0 ? 1 : num;
};

function MiniBlockBar({ blocks = [], height = 18 }) {
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
        const duration = safeDuration(block.duration);
        const type = (block.type || "").toLowerCase();
        const color = blockColors[type] || "#ccc";

        const label = `${type.toUpperCase()} • ${duration} ${
          block.durationType === "distance" ? "km" : "min"
        }${
          block.intensity ? ` • ${block.intensityType}: ${block.intensity}` : ""
        }`;

        return (
          <Tooltip key={i} title={label} arrow>
            <Box
              sx={{
                flexGrow: duration,
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

export default MiniBlockBar;
