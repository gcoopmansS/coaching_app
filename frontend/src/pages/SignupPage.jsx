import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/signup", {
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

  return (
    <>
      <Navbar />
      <Box sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
        <Typography variant="h4" gutterBottom>
          Sign Up
        </Typography>

        <Stack spacing={2}>
          {success && (
            <Alert severity="success">
              ✅ Account created! Redirecting to login...
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

            <Button type="submit" variant="contained" fullWidth>
              Sign Up
            </Button>
          </form>
        </Stack>
      </Box>
    </>
  );
}
