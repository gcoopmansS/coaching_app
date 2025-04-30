import { useEffect, useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Badge,
  ListItemText,
  ListItemIcon,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircleIcon from "@mui/icons-material/Circle";

// ✅ Load backend base URL from env
const API_URL = import.meta.env.VITE_API_URL;

export default function Notifications({ user }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !user?.id) {
      console.error("No token or user ID found. Skipping notifications fetch.");
      return;
    }

    fetch(`${API_URL}/api/users/${user.id}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch notifications");
        }
        return res.json();
      })
      .then(setNotifications)
      .catch((err) => console.error("Notification fetch error:", err));
  }, [user]);

  const unseenCount = notifications.filter((n) => !n.seen).length;

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);

    const userId = user?._id || user?.id;
    if (!userId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Cannot mark notifications as seen.");
      return;
    }

    // Mark notifications as seen
    fetch(`${API_URL}/api/users/${userId}/notifications/mark-seen`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Update local state
    setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleOpen}
        sx={{
          "&:focus": {
            outline: "none",
            boxShadow: "none",
          },
        }}
      >
        <Badge badgeContent={unseenCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {notifications.length === 0 ? (
          <MenuItem disabled>No notifications</MenuItem>
        ) : (
          notifications.map((n, i) => (
            <MenuItem key={i}>
              <ListItemIcon>
                {!n.seen && <CircleIcon fontSize="small" color="error" />}
              </ListItemIcon>
              <ListItemText
                primary={n.message}
                secondary={new Date(n.createdAt).toLocaleString()}
              />
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}
