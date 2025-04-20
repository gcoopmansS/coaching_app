import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🧭 Explore Coaches
      </Typography>

      <Grid container spacing={3}>
        {coaches.map((coach) => (
          <Grid item xs={12} sm={6} md={4} key={coach._id}>
            <Card
              sx={{
                minHeight: 230,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Avatar
                    src={`http://localhost:3000${coach.profilePicture || ""}`}
                    sx={{ mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6">{coach.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      📍 {coach.city}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      🎂 {formatDate(coach.dateOfBirth)}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  {coach.bio || "No bio provided."}
                </Typography>
              </CardContent>

              <Box sx={{ p: 2 }}>
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
  );
}
