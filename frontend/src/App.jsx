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
        <Route
          path="/profile"
          element={<ProfilePage user={user} setUser={setUser} />}
        />
        <Route path="/runner" element={<RunnerDashboard user={user} />} />
        <Route
          path="/runner/explore"
          element={<ExploreCoachesPage user={user} />}
        />
        <Route path="/coach" element={<CoachDashboard user={user} />} />
        <Route
          path="/coach/requests"
          element={<CoachRequestsPage user={user} />}
        />
        <Route
          path="/coach/saved-workouts"
          element={<SavedWorkoutsPage user={user} />}
        />
        <Route
          path="/coach/runner/:runnerId"
          element={<RunnerOverviewPage />}
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
