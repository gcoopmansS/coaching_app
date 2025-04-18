import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

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
    handleMenuClose();
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{ cursor: "pointer" }}
          onClick={() =>
            navigate(user?.role === "coach" ? "/coach" : "/runner")
          }
        >
          Coaching App
        </Typography>

        {user && (
          <Box>
            <IconButton onClick={handleMenuOpen}>
              <Avatar
                src={`http://localhost:3000${user.profilePicture || ""}`}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
            >
              <MenuItem onClick={() => handleNavigate("/profile")}>
                Profile
              </MenuItem>
              {user.role === "runner" && (
                <MenuItem onClick={() => handleNavigate("/explore")}>
                  Explore Coaches
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
