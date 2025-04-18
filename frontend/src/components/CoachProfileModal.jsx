import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Avatar,
  Box,
  Button,
} from "@mui/material";
import { formatDate } from "../utils/formatDate";

export default function CoachProfileModal({ coach, open, onClose }) {
  if (!coach) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Coach Profile</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            src={`http://localhost:3000${coach.profilePicture || ""}`}
            sx={{ width: 100, height: 100 }}
          />
          <Typography variant="h6">{coach.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {coach.email}
          </Typography>
          <Typography variant="body2">📍 {coach.city}</Typography>
          <Typography variant="body2">
            🎂 {formatDate(coach.dateOfBirth)}
          </Typography>

          <Typography variant="body1" sx={{ mt: 2 }}>
            {coach.bio}
          </Typography>

          {/* Placeholder for future action */}
          <Button variant="contained" sx={{ mt: 3 }}>
            Request Coaching
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
