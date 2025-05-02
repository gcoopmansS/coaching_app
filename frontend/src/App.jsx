import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RunnerDashboard from "./pages/RunnerDashboard";
import CoachDashboard from "./pages/CoachDashboard";
import ProfilePage from "./pages/ProfilePage";
import ExploreCoachesPage from "./pages/ExploreCoachesPage";
import SavedWorkoutsPage from "./pages/SavedWorkoutsPage";
import CoachRequestsPage from "./pages/CoachRequests";
import RunnerOverviewPage from "./pages/RunnerOverviewPage";
import ProtectedRoute from "./components/ProtectedRoute";

function AppRoutes({ user, setUser }) {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && user && <Navbar user={user} setUser={setUser} />}

      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? `/${user.role}` : "/login"} />}
        />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={`/${user.role}`} />
            ) : (
              <LoginPage setUser={setUser} />
            )
          }
        />

        <Route
          path="/signup"
          element={user ? <Navigate to={`/${user.role}`} /> : <SignupPage />}
        />

        {/* ✅ PROTECTED ROUTES */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <ProfilePage user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/runner"
          element={
            <ProtectedRoute user={user}>
              <RunnerDashboard user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/runner/explore"
          element={
            <ProtectedRoute user={user}>
              <ExploreCoachesPage user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coach"
          element={
            <ProtectedRoute user={user}>
              <CoachDashboard user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coach/requests"
          element={
            <ProtectedRoute user={user}>
              <CoachRequestsPage user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coach/saved-workouts"
          element={
            <ProtectedRoute user={user}>
              <SavedWorkoutsPage user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coach/runner/:runnerId"
          element={
            <ProtectedRoute user={user}>
              <RunnerOverviewPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <Router>
      <AppRoutes user={user} setUser={setUser} />
    </Router>
  );
}
