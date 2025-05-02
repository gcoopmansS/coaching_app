import { Box, Stack, Typography, Paper } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StraightenIcon from "@mui/icons-material/Straighten";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import theme from "../theme/theme"; // ✅ import your theme

function BlockPreview({ block, nested = false }) {
  const type = (block.type || "").toLowerCase();
  const color = theme.colors[type] || "#ccc";

  const renderDetails = () => {
    const isDistance = block.durationType === "distance";

    return (
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
        {block.duration && (
          <Stack direction="row" spacing={0.5} alignItems="center">
            {isDistance ? (
              <StraightenIcon fontSize="small" />
            ) : (
              <AccessTimeIcon fontSize="small" />
            )}
            <Typography variant="body2">
              {block.duration} {isDistance ? "km" : "min"}
            </Typography>
          </Stack>
        )}
        {block.intensityType !== "none" && block.intensity && (
          <Stack direction="row" spacing={0.5} alignItems="center">
            <WhatshotIcon fontSize="small" />
            <Typography variant="body2">
              {block.intensityType}: {block.intensity}
            </Typography>
          </Stack>
        )}
      </Stack>
    );
  };

  return (
    <Paper
      elevation={nested ? 0 : 1}
      sx={{
        p: 2,
        mb: 2,
        borderLeft: `6px solid ${color}`,
        borderRadius: 2,
        backgroundColor: nested ? "#fff" : "#fafafa",
      }}
    >
      <Typography variant="h6" sx={{ mb: 0.5 }}>
        {block.type?.toUpperCase()}
      </Typography>

      {block.type !== "repeat" ? (
        <>
          {block.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {block.description}
            </Typography>
          )}
          {renderDetails()}
        </>
      ) : (
        <>
          <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
            Repeat {block.repeat || "-"} times
          </Typography>

          <Stack spacing={1} sx={{ mt: 1, borderLeft: "2px #bbb" }}>
            {(block.blocks || []).map((nested, i) => (
              <BlockPreview key={i} block={nested} nested />
            ))}
          </Stack>
        </>
      )}
    </Paper>
  );
}

export default BlockPreview;
