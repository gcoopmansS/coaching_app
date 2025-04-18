import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Navbar from "../components/Navbar";

export default function CoachingPage() {
  const { id } = useParams(); // athlete (runner) ID

  return (
    <>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Coaching: {id}
        </Typography>

        <Typography>
          🛠️ This is where you’ll soon be able to schedule workouts, track
          progress, and chat with this runner.
        </Typography>
      </Box>
    </>
  );
}
