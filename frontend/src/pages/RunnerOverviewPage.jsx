import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Stack,
  Skeleton,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import GradientButton from "../components/GradientButton";
import WorkoutDialog from "../components/WorkoutDialog";
import WorkoutCalendar from "../components/WorkoutCalendar";
import MiniBlockBar from "../components/MiniBlockBar";

const API_URL = import.meta.env.VITE_API_URL;

function getWeekStart(offset = 0) {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1) + offset * 7;
  const date = new Date(now.setDate(diff));
  date.setHours(0, 0, 0, 0);
  return date;
}

function getWeekEnd(offset = 0) {
  const start = getWeekStart(offset);
  return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
}

export default function RunnerOverviewPage() {
  const { runnerId } = useParams();
  const [runner, setRunner] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loadingRunner, setLoadingRunner] = useState(true);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("view");
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [view, setView] = useState("list");
  const [weekOffset, setWeekOffset] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchWorkouts = useCallback(() => {
    const token = localStorage.getItem("token");
    setLoadingWorkouts(true);
    fetch(`${API_URL}/api/workouts/runner/${runnerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setWorkouts)
      .catch((err) => console.error("Error loading workouts:", err))
      .finally(() => setLoadingWorkouts(false));
  }, [runnerId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoadingRunner(true);
    fetch(`${API_URL}/api/users/${runnerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setRunner)
      .catch((err) => console.error("Error loading runner:", err))
      .finally(() => setLoadingRunner(false));

    fetchWorkouts();
  }, [runnerId, fetchWorkouts]);

  const calendarEvents = workouts.map((w) => ({
    id: w._id,
    title: w.title,
    date: w.date,
    extendedProps: {
      blocks: w.blocks,
      coachId: w.coachId,
    },
  }));

  const startOfWeek = getWeekStart(weekOffset);
  const endOfWeek = getWeekEnd(weekOffset);
  const workoutsThisWeek = workouts.filter((w) => {
    const date = new Date(w.date);
    return date >= startOfWeek && date <= endOfWeek;
  });

  const weekLabel = `${startOfWeek.toLocaleDateString()} — ${endOfWeek.toLocaleDateString()}`;

  const handleDelete = async (workoutId) => {
    const confirmed = window.confirm("Delete this workout?");
    if (!confirmed) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/api/workouts/${workoutId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchWorkouts();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Runner Overview
      </Typography>

      {loadingRunner ? (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Skeleton variant="circular" width={64} height={64} />
          <Skeleton width="40%" sx={{ mt: 1 }} />
          <Skeleton width="30%" />
        </Paper>
      ) : (
        runner && (
          <Paper sx={{ p: 2, mb: 3, display: "flex", alignItems: "center" }}>
            <Avatar
              src={`${API_URL}${runner.profilePicture || ""}`}
              sx={{ width: 64, height: 64, mr: 2 }}
            />
            <Box>
              <Typography variant="h6">{runner.name}</Typography>
              <Typography>Email: {runner.email}</Typography>
              <Typography>City: {runner.city || "—"}</Typography>
            </Box>
          </Paper>
        )
      )}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2, flexWrap: "wrap", gap: 2 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h6">Planned Workouts</Typography>
          {view === "list" && (
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                onClick={() => setWeekOffset((w) => w - 1)}
                size="small"
              >
                <ArrowBackIosIcon fontSize="small" />
              </IconButton>
              <Typography variant="body2" sx={{ minWidth: 160 }}>
                {weekLabel}
              </Typography>
              <IconButton
                onClick={() => setWeekOffset((w) => w + 1)}
                size="small"
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Stack>
          )}
        </Stack>

        <Stack direction="row" spacing={2}>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(e, v) => v && setView(v)}
            size="small"
          >
            <ToggleButton value="list">
              <FormatListBulletedIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="calendar">
              <CalendarMonthIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>

          <GradientButton
            variant="contained"
            size="small"
            onClick={() => {
              setDialogMode("create");
              setSelectedWorkout(null);
              setDialogOpen(true);
            }}
          >
            + Schedule Workout
          </GradientButton>
        </Stack>
      </Stack>

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
                  const workoutDate = new Date(w.date);
                  const isEditable = w.coachId === user?.id;

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
                        onClick={() => {
                          setSelectedWorkout(w);
                          setDialogMode("view");
                          setDialogOpen(true);
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Typography variant="h6">{w.title}</Typography>

                          {isEditable && (
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedWorkout(w);
                                    setDialogMode("edit");
                                    setDialogOpen(true);
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(w._id);
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          )}
                        </Stack>
                        <MiniBlockBar blocks={w.blocks} />
                      </Paper>
                    </Box>
                  );
                })}
            </Stack>
          </Box>
        )
      ) : (
        <Paper sx={{ p: 2, mb: 3 }}>
          <WorkoutCalendar
            events={calendarEvents}
            onEventClick={(info) => {
              const clickedWorkout = workouts.find(
                (w) => w._id === info.event.id
              );
              if (clickedWorkout) {
                setSelectedWorkout(clickedWorkout);
                setDialogMode("view");
                setDialogOpen(true);
              }
            }}
            onEventDrop={(info) => {
              const workoutId = info.event.id;
              const newDate = info.event.startStr;
              fetch(`${API_URL}/api/workouts/${workoutId}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ date: newDate }),
              })
                .then((res) => {
                  if (!res.ok) throw new Error("Failed to update workout");
                  return res.json();
                })
                .then(() => fetchWorkouts())
                .catch((err) => {
                  console.error("Error updating workout:", err);
                  info.revert();
                });
            }}
            editable={true}
            highlightCoachId={user?.id}
          />
        </Paper>
      )}

      <WorkoutDialog
        open={dialogOpen}
        onClose={(refresh) => {
          setDialogOpen(false);
          if (refresh) fetchWorkouts();
        }}
        mode={dialogMode}
        initialWorkout={selectedWorkout}
        runnerId={runnerId}
        coachId={user.id}
        editable={selectedWorkout?.coachId === user.id}
      />
    </Box>
  );
}
