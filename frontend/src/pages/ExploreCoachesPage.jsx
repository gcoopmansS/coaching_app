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
import theme from "../theme/theme";

const API_URL = import.meta.env.VITE_API_URL;

export default function ExploreCoachesPage() {
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/users/coaches`)
      .then((res) => res.json())
      .then(setCoaches)
      .catch((err) => console.error("Error fetching coaches:", err));
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Explore Coaches
      </Typography>

      <Grid container spacing={3}>
        {coaches.map((coach) => {
          const imageUrl = coach.profilePicture
            ? `${API_URL}${coach.profilePicture}`
            : null;
          const initial = coach.name?.charAt(0).toUpperCase() || "?";

          return (
            <Grid item xs={12} sm={6} md={4} key={coach._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: theme.borderRadius.md,
                  overflow: "hidden",
                }}
              >
                {imageUrl ? (
                  <CardMedia
                    component="img"
                    height="160"
                    image={imageUrl}
                    alt={coach.name}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 160,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: theme.colors.run,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        fontSize: "2rem",
                        bgcolor: "#fff",
                        color: theme.colors.run,
                      }}
                    >
                      {initial}
                    </Avatar>
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{coach.name}</Typography>
                  <Typography variant="body2">
                    Location: {coach.city || "Unknown City"}
                  </Typography>
                  <Typography variant="body2">
                    Date of Birth:{" "}
                    {coach.dateOfBirth
                      ? formatDate(coach.dateOfBirth)
                      : "Unknown"}
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
          );
        })}
      </Grid>

      <CoachProfileModal
        coach={selectedCoach}
        open={!!selectedCoach}
        onClose={() => setSelectedCoach(null)}
      />
    </Box>
  );
}
