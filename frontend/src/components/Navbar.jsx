import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

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

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user && (
            <>
              <Typography variant="body1">{user.name}</Typography>
              <Avatar
                src={`http://localhost:3000${user.profilePicture || ""}`}
              />
              <Button color="inherit" onClick={() => navigate("/profile")}>
                Profile
              </Button>

              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
