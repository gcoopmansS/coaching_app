import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Alert,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import GradientButton from "../components/GradientButton";
import theme from "../theme/theme";

const API_URL = import.meta.env.VITE_API_URL;

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "runner",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      navigate(user.role === "runner" ? "/runner" : "/coach");
    } else {
      setCheckingSession(false);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Signup failed");
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Server error");
    }
  };

  if (checkingSession) {
    return (
      <Box sx={{ mt: 12, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 10,
        p: 3,
        backgroundColor: "#fff",
        borderRadius: theme.borderRadius.md,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ ...theme.typography.heading }}
      >
        Create an Account
      </Typography>

      <Stack spacing={2}>
        {success && (
          <Alert severity="success">
            Account created! Redirecting to login...
          </Alert>
        )}
        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="Role"
            name="role"
            value={form.role}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          >
            <MenuItem value="runner">Runner</MenuItem>
            <MenuItem value="coach">Coach</MenuItem>
          </TextField>

          <GradientButton type="submit" color="primary" fullWidth>
            Sign Up
          </GradientButton>
        </form>

        <GradientButton
          color="secondary"
          fullWidth
          variant="contained"
          onClick={() => navigate("/login")}
        >
          Already have an account? Log in
        </GradientButton>
      </Stack>
    </Box>
  );
}
