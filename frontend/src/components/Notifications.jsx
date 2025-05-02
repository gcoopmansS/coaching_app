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
import { authFetch } from "../utils/api";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Notifications({ user, setUser }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;

    authFetch(`${API_URL}/api/users/${user.id}/notifications`, {}, () => {
      setUser(null);
      navigate("/login");
    })
      .then((res) => res.json())
      .then(setNotifications)
      .catch((err) => console.error("Notification fetch error:", err));
  }, [user, setUser, navigate]);

  const unseenCount = notifications.filter((n) => !n.seen).length;

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);

    const userId = user?._id || user?.id;
    if (!userId) return;

    authFetch(
      `${API_URL}/api/users/${userId}/notifications/mark-seen`,
      { method: "PATCH" },
      () => {
        setUser(null);
        navigate("/login");
      }
    );

    // Mark as seen locally
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
