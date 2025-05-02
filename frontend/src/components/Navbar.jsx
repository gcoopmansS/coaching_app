import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Notifications from "./Notifications";
import theme from "../theme/theme"; // ✅ Import your theme

const API_URL = import.meta.env.VITE_API_URL;

export default function Navbar({ user: propUser, setUser }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setLocalUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setLocalUser(JSON.parse(stored));
    }
  }, [propUser]);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleNavigate = (path) => {
    handleMenuClose();
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    if (setUser) setUser(null);
    navigate("/login");
  };

  if (!user) return null;

  return (
    <AppBar
      position="static"
      sx={{
        background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component="div"
          onClick={() =>
            handleNavigate(user.role === "coach" ? "/coach" : "/runner")
          }
          sx={{
            cursor: "pointer",
            ...theme.typography.heading,
          }}
        >
          Coaching App
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Notifications user={user} />

          <IconButton
            onClick={handleMenuOpen}
            sx={{
              ml: 2,
              "&:focus": {
                outline: "none",
                boxShadow: "none",
              },
            }}
          >
            <Avatar
              alt={user.name}
              src={
                user?.profilePicture?.startsWith("/uploads")
                  ? `${API_URL}${user.profilePicture}`
                  : user?.profilePicture
              }
              sx={{
                width: 36,
                height: 36,
                border: `2px solid ${theme.colors.background}`,
              }}
            />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={() =>
                handleNavigate(user.role === "coach" ? "/coach" : "/runner")
              }
            >
              Dashboard
            </MenuItem>
            <MenuItem onClick={() => handleNavigate("/profile")}>
              Profile
            </MenuItem>
            {user.role === "runner" && (
              <MenuItem onClick={() => handleNavigate("/runner/explore")}>
                Explore
              </MenuItem>
            )}
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
