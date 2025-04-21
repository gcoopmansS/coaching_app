import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  CardMedia,
} from "@mui/material";
import GradientButton from "../components/GradientButton";
import { formatDate } from "../utils/formatDate";
import CoachProfileModal from "../components/CoachProfileModal";

export default function ExploreCoachesPage() {
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/users/coaches")
      .then((res) => res.json())
      .then(setCoaches)
      .catch((err) => console.error("Error fetching coaches:", err));
  }, []);

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Explore Coaches
        </Typography>

        <Grid container spacing={2}>
          {coaches.map((coach) => (
            <Grid item xs={12} sm={6} md={4} key={coach._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={
                    coach.profilePicture
                      ? `http://localhost:3000${coach.profilePicture}`
                      : "https://via.placeholder.com/300x160?text=No+Image"
                  }
                  alt={coach.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{coach.name}</Typography>
                  <Typography variant="body2">
                    📍 {coach.city || "Unknown City"}
                  </Typography>
                  <Typography variant="body2">
                    🎂{" "}
                    {coach.dateOfBirth
                      ? formatDate(coach.dateOfBirth)
                      : "Unknown DOB"}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {coach.bio || "No bio provided."}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <GradientButton
                    fullWidth
                    onClick={() => setSelectedCoach(coach)}
                  >
                    View Profile
                  </GradientButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <CoachProfileModal
          coach={selectedCoach}
          open={!!selectedCoach}
          onClose={() => setSelectedCoach(null)}
        />
      </Box>
    </>
  );
}
