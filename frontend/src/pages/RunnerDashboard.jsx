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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import WorkoutCalendar from "../components/WorkoutCalendar";
import BlockPreview from "../components/WorkoutPreviewBlock";
import MiniBlockBar from "../components/MiniBlockBar";

const API_URL = import.meta.env.VITE_API_URL;

export default function RunnerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [coaches, setCoaches] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [view, setView] = useState("list");

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${API_URL}/api/connections/runner/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
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
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/workouts/runner/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setWorkouts(data);
      } catch (err) {
        console.error("Failed to load workouts:", err);
      }
    };

    fetchCoaches();
    fetchWorkouts();
  }, [user.id]);

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
        <Stack spacing={2}>
          {workouts
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((w) => {
              const coach = coaches.find((c) => c.coachId._id === w.coachId);
              return (
                <Paper key={w._id} sx={{ p: 2, position: "relative" }}>
                  {/* Coach Avatar */}
                  {coach && (
                    <Avatar
                      src={`${API_URL}${coach.coachId.profilePicture || ""}`}
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

                  {/* Workout Info */}
                  <Typography variant="h6">{w.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(w.date).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>

                  {/* Blocks Preview */}
                  <Box sx={{ mt: 1, width: "100%" }}>
                    <MiniBlockBar blocks={w.blocks} />
                  </Box>
                </Paper>
              );
            })}
        </Stack>
      ) : (
        <WorkoutCalendar events={calendarEvents} />
      )}
    </Box>
  );
}
