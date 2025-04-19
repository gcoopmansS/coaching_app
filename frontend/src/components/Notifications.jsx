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

export default function Notifications({ user }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:3000/api/users/${user.id}/notifications`)
        .then((res) => res.json())
        .then(setNotifications)
        .catch((err) => console.error("Notification fetch error:", err));
    }
  }, [user]);

  const unseenCount = notifications.filter((n) => !n.seen).length;

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);

    // Mark notifications as seen
    fetch(
      `http://localhost:3000/api/users/${user.id}/notifications/mark-seen`,
      {
        method: "PATCH",
      }
    );

    // Update local state
    setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
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
