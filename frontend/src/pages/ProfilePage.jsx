import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Avatar,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import GradientButton from "../components/GradientButton";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProfilePage({ setUser }) {
  const location = useLocation();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setLocalUser] = useState(storedUser);

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

  const refreshUser = useCallback(async () => {
    const id = user?.id || user?._id;
    if (!id) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = await res.json();

      if (res.ok) {
        const fixedUser = { ...updated, id: updated._id };
        localStorage.setItem("user", JSON.stringify(fixedUser));
        setLocalUser(fixedUser);
        setUser(fixedUser);
      }
    } catch (err) {
      console.error("❌ Failed to refresh user after Strava connect:", err);
    }
  }, [user, setUser]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("strava") === "connected") {
      refreshUser();

      setSnackbar({
        open: true,
        message: "✅ Strava connected successfully!",
        severity: "success",
      });

      // Clean up the URL
      const cleanedUrl = location.pathname;
      window.history.replaceState({}, "", cleanedUrl);
    }
  }, [location, refreshUser]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      const previewUrl = URL.createObjectURL(e.target.files[0]);
      setLocalUser({ ...user, profilePicture: previewUrl });
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
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const updatedUser = {
          ...data.user,
          id: data.user._id,
        };

        setLocalUser(updatedUser);
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

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
    } catch (err) {
      console.error("Profile update error:", err);
      setSnackbar({
        open: true,
        message: "Server error",
        severity: "error",
      });
    }
  };

  if (!user) return null;

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
                  ? `${API_URL}${user.profilePicture}`
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

          <GradientButton onClick={handleSave}>Save Profile</GradientButton>

          {user?.role === "runner" && (
            <>
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Strava Integration
                </Typography>

                {user?.strava?.athleteId ? (
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid #4caf50",
                      borderRadius: 2,
                      bgcolor: "#e8f5e9",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      ✅ Connected to Strava
                    </Typography>

                    <Avatar
                      src={user.strava.profile}
                      alt="Strava profile"
                      sx={{ width: 72, height: 72, mx: "auto", my: 1 }}
                    />
                    <Typography>
                      {user.strava.firstname} {user.strava.lastname}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.strava.city}, {user.strava.country}
                    </Typography>

                    <GradientButton
                      onClick={() =>
                        alert("🚧 Disconnect functionality coming soon.")
                      }
                      color="error"
                      sx={{ mt: 2 }}
                    >
                      Disconnect
                    </GradientButton>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", mt: 2 }}>
                    <img
                      src="/assets/strava/connect_with_strava.svg"
                      alt="Connect with Strava"
                      style={{ cursor: "pointer", height: 44 }}
                      onClick={() =>
                        (window.location.href = `${API_URL}/api/strava/connect?userId=${
                          user.id || user._id
                        }`)
                      }
                    />
                  </Box>
                )}

                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <img
                    src="/assets/strava/powered_by_strava.svg"
                    alt="Powered by Strava"
                    style={{ height: 28 }}
                  />
                </Box>
              </Box>
            </>
          )}
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
