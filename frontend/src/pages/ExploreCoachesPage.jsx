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
            <Grid item xs={12} sm={6} md={5} key={coach._id}>
              <Card
                elevation={4}
                sx={{
                  height: 300, // ✅ fixed height
                  minWidth: 200,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between", // space between avatar/content & button
                  alignItems: "center",
                  p: 2,
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Avatar
                    src={`http://localhost:3000${coach.profilePicture || ""}`}
                    sx={{ width: 80, height: 80, mb: 1 }}
                  />
                  <Typography variant="h6">{coach.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {coach.city}
                  </Typography>
                  <Typography variant="body2">
                    🎂 {formatDate(coach.dateOfBirth)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {coach.bio || "—"}
                  </Typography>
                </Box>

                <GradientButton
                  onClick={() => openProfile(coach)}
                  sx={{ mt: "auto" }}
                >
                  View Profile
                </GradientButton>
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
