import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import WorkoutCalendar from "../components/WorkoutCalendar";
import MiniBlockBar from "../components/MiniBlockBar";
import { authFetch } from "../utils/api"; // ✅ new import

const API_URL = import.meta.env.VITE_API_URL;

export default function RunnerDashboard({ user, setUser }) {
  const [coaches, setCoaches] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [view, setView] = useState("list");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await authFetch(
          `${API_URL}/api/connections/runner/${user.id}`,
          {},
          () => {
            setUser(null);
            navigate("/login");
          }
        );
        const data = await res.json();
        setCoaches(data);
      } catch (err) {
        console.error("Failed to load coaches:", err);
      }
    };

    const fetchWorkouts = async () => {
      try {
        const res = await authFetch(
          `${API_URL}/api/workouts/runner/${user.id}`,
          {},
          () => {
            setUser(null);
            navigate("/login");
          }
        );
        const data = await res.json();
        setWorkouts(data);
      } catch (err) {
        console.error("Failed to load workouts:", err);
      }
    };

    fetchCoaches();
    fetchWorkouts();
  }, [user?.id, setUser, navigate]);

  const calendarEvents = workouts.map((w) => ({
    id: w._id,
    title: w.title,
    date: w.date,
    extendedProps: {
      coachId: w.coachId,
      blocks: w.blocks,
    },
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user.name}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Coaches
        </Typography>
        <Stack direction="row" spacing={2}>
          {coaches.map((c) => (
            <Card key={c._id} sx={{ minWidth: 200 }}>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <Avatar
                  src={`${API_URL}${c.coachId.profilePicture || ""}`}
                  sx={{ width: 48, height: 48 }}
                />
                <Box>
                  <Typography variant="subtitle1">{c.coachId.name}</Typography>
                  <Typography variant="caption">{c.goal}</Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Your Workouts</Typography>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(e, newView) => {
            if (newView) setView(newView);
          }}
          size="small"
        >
          <ToggleButton value="list">
            <FormatListBulletedIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="calendar">
            <CalendarMonthIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {view === "list" ? (
        <Box sx={{ pl: { xs: 0, sm: 10 } }}>
          <Stack spacing={4} sx={{ position: "relative" }}>
            {workouts
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((w) => {
                const coach = coaches.find((c) => c.coachId._id === w.coachId);
                const workoutDate = new Date(w.date);

                return (
                  <Box key={w._id} sx={{ position: "relative" }}>
                    <Box
                      sx={{
                        position: "absolute",
                        left: -80,
                        top: 24,
                        textAlign: "right",
                        pr: 2,
                        width: 70,
                        display: { xs: "none", sm: "block" },
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "text.secondary", whiteSpace: "nowrap" }}
                      >
                        {workoutDate.toLocaleDateString(undefined, {
                          weekday: "short",
                        })}
                      </Typography>
                      <Typography variant="body2">
                        {workoutDate.toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                        })}
                      </Typography>
                    </Box>

                    <Paper
                      sx={{
                        p: 2,
                        pl: { xs: 2, sm: 5 },
                        position: "relative",
                      }}
                    >
                      {coach && (
                        <Avatar
                          src={`${API_URL}${
                            coach.coachId.profilePicture || ""
                          }`}
                          alt={coach.coachId.name}
                          sx={{
                            width: 32,
                            height: 32,
                            position: "absolute",
                            top: 8,
                            right: 8,
                          }}
                        />
                      )}
                      <Typography variant="h6">{w.title}</Typography>
                      <MiniBlockBar blocks={w.blocks} />
                    </Paper>
                  </Box>
                );
              })}
          </Stack>
        </Box>
      ) : (
        <WorkoutCalendar events={calendarEvents} />
      )}
    </Box>
  );
}
