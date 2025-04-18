import { useState, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const [formData, setFormData] = useState({
    city: user.city || "",
    dateOfBirth: user.dateOfBirth || "",
    bio: user.bio || "",
  });
  const [snackOpen, setSnackOpen] = useState(false);
  const fileInputRef = useRef();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("userId", user.id);
    form.append("profilePicture", file);

    const res = await fetch("http://localhost:3000/api/profile", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    if (res.ok) {
      const updated = { ...data.user, id: data.user._id };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setSnackOpen(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("userId", user.id);
    form.append("city", formData.city);
    form.append("dateOfBirth", formData.dateOfBirth);
    form.append("bio", formData.bio);

    const res = await fetch("http://localhost:3000/api/profile", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (res.ok) {
      const updated = { ...data.user, id: data.user._id };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ maxWidth: 500, mx: "auto", mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Edit Profile
        </Typography>

        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Avatar
            src={`http://localhost:3000${user.profilePicture || ""}`}
            sx={{ width: 100, height: 100, mx: "auto", cursor: "pointer" }}
            onClick={handleAvatarClick}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Typography variant="caption" color="text.secondary">
            Click the avatar to change your picture
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            type="date"
            label="Date of Birth"
            name="dateOfBirth"
            value={formData.dateOfBirth?.slice(0, 10) || ""}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Bio"
            name="bio"
            multiline
            rows={3}
            value={formData.bio}
            onChange={handleChange}
            margin="normal"
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Save Profile
          </Button>
        </form>
      </Box>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Profile updated!
        </Alert>
      </Snackbar>
    </>
  );
}
