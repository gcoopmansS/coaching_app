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
import { useState } from "react";
import Notifications from "./Notifications";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleNavigate = (path) => {
    handleMenuClose();
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(to right, #ff512f, #dd2476)",
      }}
    >
      {" "}
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ cursor: "pointer" }}
          onClick={() =>
            navigate(user?.role === "coach" ? "/coach" : "/runner")
          }
        >
          Coaching App
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {user && <Notifications user={user} />}

          <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
            <Avatar
              alt={user?.name}
              src={`http://localhost:3000${user?.profilePicture || ""}`}
              sx={{ width: 36, height: 36 }}
            />
          </IconButton>

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
        </Box>
      </Toolbar>
    </AppBar>
  );
}
