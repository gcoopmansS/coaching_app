import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Badge,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorNotif, setAnchorNotif] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:3000/api/users/${user.id}/notifications`)
        .then((res) => res.json())
        .then(setNotifications)
        .catch((err) => console.error("Failed to load notifications", err));
    }
  }, [user?.id]);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotifOpen = (e) => setAnchorNotif(e.currentTarget);
  const handleNotifClose = () => setAnchorNotif(null);

  const handleNavigate = (path) => {
    handleMenuClose();
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const unreadCount = notifications.filter((n) => !n.seen).length;

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          onClick={() =>
            navigate(user?.role === "coach" ? "/coach" : "/runner")
          }
          sx={{ cursor: "pointer" }}
        >
          Coaching App
        </Typography>

        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* 🔔 Notification bell */}
            <IconButton onClick={handleNotifOpen}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon style={{ color: "white" }} />
              </Badge>
            </IconButton>

            {/* 👤 Avatar Menu */}
            <IconButton onClick={handleMenuOpen}>
              <Avatar
                src={`http://localhost:3000${user.profilePicture || ""}`}
              />
            </IconButton>

            {/* Dropdown menu under avatar */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
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
                <MenuItem onClick={() => handleNavigate("/explore")}>
                  Explore Coaches
                </MenuItem>
              )}
              {user.role === "coach" && (
                <MenuItem onClick={() => handleNavigate("/coach/requests")}>
                  Coaching Requests
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>

            {/* Notification dropdown */}
            <Menu
              anchorEl={anchorNotif}
              open={Boolean(anchorNotif)}
              onClose={handleNotifClose}
            >
              {notifications.length === 0 && (
                <MenuItem disabled>No notifications</MenuItem>
              )}
              {notifications.map((n, i) => (
                <MenuItem key={i}>{n.message}</MenuItem>
              ))}
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
