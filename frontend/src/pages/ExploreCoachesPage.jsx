import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
} from "@mui/material";
import Navbar from "../components/Navbar";
import CoachProfileModal from "../components/CoachProfileModal";
import { formatDate } from "../utils/formatDate";
import GradientButton from "../components/GradientButton";

export default function ExploreCoaches() {
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/coaches")
      .then((res) => res.json())
      .then(setCoaches)
      .catch((err) => console.error("Error loading coaches:", err));
  }, []);

  const openProfile = (coach) => {
    setSelectedCoach(coach);
    setModalOpen(true);
  };

  const closeProfile = () => {
    setModalOpen(false);
    setSelectedCoach(null);
  };

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
                sx={{ display: "flex", gap: 2, alignItems: "center", p: 2 }}
              >
                <Avatar
                  src={`http://localhost:3000${coach.profilePicture || ""}`}
                  sx={{ width: 64, height: 64 }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6">{coach.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {coach.city}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    🎂 {formatDate(coach.dateOfBirth)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {coach.bio}
                  </Typography>
                  <GradientButton
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={() => openProfile(coach)}
                  >
                    View Profile
                  </GradientButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <CoachProfileModal
        coach={selectedCoach}
        open={modalOpen}
        onClose={closeProfile}
      />
    </>
  );
}
