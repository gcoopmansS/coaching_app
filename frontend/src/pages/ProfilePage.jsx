import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import Navbar from "../components/Navbar";
import GradientButton from "../components/GradientButton";

export default function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(storedUser);

  const [form, setForm] = useState({
    city: user?.city || "",
    dateOfBirth: user?.dateOfBirth?.slice(0, 10) || "",
    bio: user?.bio || "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);

      // Optional: preview immediately
      const previewUrl = URL.createObjectURL(e.target.files[0]);
      setUser({ ...user, profilePicture: previewUrl });
    }
  };

  const handleAvatarClick = () => {
    document.getElementById("profilePicInput").click();
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("userId", user._id || user.id);
    formData.append("city", form.city);
    formData.append("dateOfBirth", form.dateOfBirth);
    formData.append("bio", form.bio);
    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }

    try {
      const res = await fetch("http://localhost:3000/api/profile", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setSnackbar({
          open: true,
          message: "✅ Profile updated successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: data.message || "Something went wrong.",
          severity: "error",
        });
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Server error",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Box
        sx={{
          p: 3,
          maxWidth: 500,
          mx: "auto",
          background: "white",
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>

        <Stack spacing={2}>
          <Box sx={{ textAlign: "center" }}>
            <input
              id="profilePicInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageSelect}
            />
            <Avatar
              src={
                user?.profilePicture?.startsWith("/uploads")
                  ? `http://localhost:3000${user.profilePicture}`
                  : user?.profilePicture
              }
              sx={{ width: 100, height: 100, mx: "auto", cursor: "pointer" }}
              onClick={handleAvatarClick}
            />
            <Typography variant="body2" color="textSecondary">
              Click image to change
            </Typography>
          </Box>

          <TextField
            label="City"
            name="city"
            value={form.city}
            onChange={handleInputChange}
            fullWidth
          />

          <TextField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Bio"
            name="bio"
            value={form.bio}
            onChange={handleInputChange}
            multiline
            rows={3}
            fullWidth
          />

          <GradientButton onClick={handleSave}>💾 Save Profile</GradientButton>
        </Stack>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
