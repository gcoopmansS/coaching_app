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

export default function Navbar({ user: propUser, setUser }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setLocalUser] = useState(null); // avoid stale propUser

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setLocalUser(JSON.parse(stored));
    }
  }, [propUser]);

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    handleMenuClose();
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    if (setUser) setUser(null);
    navigate("/login");
  };

  if (!user) return null;

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(to right, #ff512f, #dd2476)",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ cursor: "pointer" }}
          onClick={() =>
            handleNavigate(user.role === "coach" ? "/coach" : "/runner")
          }
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
            {" "}
            <Avatar
              alt={user.name}
              src={`http://localhost:3000${user.profilePicture || ""}`}
              sx={{ width: 36, height: 36 }}
            />
          </IconButton>

          {/* ✅ Don't render Menu unless anchorEl is set */}
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
                Explore Coaches
              </MenuItem>
            )}
            {user.role === "coach" && [
              <MenuItem
                key="requests"
                onClick={() => handleNavigate("/coach/requests")}
              >
                Coaching Requests
              </MenuItem>,
              <MenuItem
                key="saved"
                onClick={() => handleNavigate("/coach/saved-workouts")}
              >
                Saved Workouts
              </MenuItem>,
            ]}
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
