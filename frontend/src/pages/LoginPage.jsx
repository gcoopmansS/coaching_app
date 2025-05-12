import { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Alert,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import GradientButton from "../components/GradientButton";

const API_URL = import.meta.env.VITE_API_URL;

export default function LoginPage({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("🔁 Login response data:", data);
      console.log("🔁 Login response data:", data);
      const params = new URLSearchParams(window.location.search);
      const stravaRedirect = params.get("strava") === "connected";

      if (res.ok) {
        const fixedUser = {
          ...data.user,
          id: data.user._id || data.user.id,
        };

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(fixedUser));
        setUser(fixedUser);

        if (stravaRedirect) {
          navigate("/profile?strava=connected");
        } else {
          navigate(fixedUser.role === "runner" ? "/runner" : "/coach");
        }
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          width: "100%",
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          p: 4,
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Log In
        </Typography>

        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <GradientButton
              color="primary"
              fullWidth
              type="submit"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Log In"
              )}
            </GradientButton>
          </form>

          <GradientButton
            color="secondary"
            fullWidth
            variant="contained"
            onClick={() => navigate("/signup")}
          >
            Don't have an account? Sign up
          </GradientButton>
        </Stack>
      </Box>
    </Box>
  );
}
