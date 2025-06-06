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
  Skeleton,
  Grid,
  IconButton,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import WorkoutCalendar from "../components/WorkoutCalendar";
import MiniBlockBar from "../components/MiniBlockBar";

const API_URL = import.meta.env.VITE_API_URL;

function getWeekStart(date = new Date()) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

function getWeekEnd(date = new Date()) {
  const start = getWeekStart(new Date(date));
  return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
}

export default function RunnerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [coaches, setCoaches] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loadingCoaches, setLoadingCoaches] = useState(true);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  const [view, setView] = useState("list");
  const [weekOffset, setWeekOffset] = useState(0);

  const currentWeekStart = getWeekStart(new Date());
  const shownWeekStart = new Date(currentWeekStart);
  shownWeekStart.setDate(shownWeekStart.getDate() + weekOffset * 7);
  const shownWeekEnd = getWeekEnd(shownWeekStart);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchCoaches = async () => {
      try {
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
      } finally {
        setLoadingCoaches(false);
      }
    };

    const fetchWorkouts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/workouts/runner/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setWorkouts(data);
      } catch (err) {
        console.error("Failed to load workouts:", err);
      } finally {
        setLoadingWorkouts(false);
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

  const workoutsThisWeek = workouts.filter((w) => {
    const d = new Date(w.date);
    return d >= shownWeekStart && d <= shownWeekEnd;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user.name}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Coaches
        </Typography>
        <Grid container spacing={2}>
          {loadingCoaches
            ? Array.from({ length: 2 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Card>
                    <CardContent
                      sx={{ display: "flex", alignItems: "center", gap: 2 }}
                    >
                      <Skeleton variant="circular" width={48} height={48} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Skeleton width="80%" />
                        <Skeleton width="50%" />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : coaches.map((c) => (
                <Grid item xs={12} sm={6} md={4} key={c._id}>
                  <Card>
                    <CardContent
                      sx={{ display: "flex", alignItems: "center", gap: 2 }}
                    >
                      <Avatar
                        src={`${API_URL}${c.coachId.profilePicture || ""}`}
                        sx={{ width: 48, height: 48 }}
                      />
                      <Box>
                        <Typography variant="subtitle1">
                          {c.coachId.name}
                        </Typography>
                        <Typography variant="caption">{c.goal}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </Box>

      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Your Workouts</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          {view === "list" && (
            <>
              <IconButton onClick={() => setWeekOffset((prev) => prev - 1)}>
                <ArrowBackIosIcon fontSize="small" />
              </IconButton>
              <Typography variant="body2">
                {shownWeekStart.toLocaleDateString()} –{" "}
                {shownWeekEnd.toLocaleDateString()}
              </Typography>
              <IconButton onClick={() => setWeekOffset((prev) => prev + 1)}>
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </>
          )}
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(e, newView) => newView && setView(newView)}
            size="small"
          >
            <ToggleButton value="list">
              <FormatListBulletedIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="calendar">
              <CalendarMonthIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Box>

      {loadingWorkouts ? (
        <Stack spacing={2}>
          {Array.from({ length: 2 }).map((_, i) => (
            <Paper key={i} sx={{ p: 2 }}>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="rectangular" height={40} sx={{ mt: 1 }} />
            </Paper>
          ))}
        </Stack>
      ) : view === "list" ? (
        workoutsThisWeek.length === 0 ? (
          <Typography>No workouts scheduled this week.</Typography>
        ) : (
          <Box sx={{ pl: { xs: 0, sm: 10 } }}>
            <Stack spacing={4} sx={{ position: "relative" }}>
              {workoutsThisWeek
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((w) => {
                  const coach = coaches.find(
                    (c) => c.coachId._id === w.coachId
                  );
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
                          sx={{
                            color: "text.secondary",
                            whiteSpace: "nowrap",
                          }}
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
        )
      ) : (
        <WorkoutCalendar events={calendarEvents} />
      )}
    </Box>
  );
}
