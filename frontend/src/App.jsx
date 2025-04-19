import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RunnerDashboard from "./pages/RunnerDashboard";
import CoachDashboard from "./pages/CoachDashboard";
import ProfilePage from "./pages/ProfilePage";
import ExploreCoachesPage from "./pages/ExploreCoachesPage";
import SavedWorkoutsPage from "./pages/SavedWorkoutsPage";
import CoachRequestsPage from "./pages/CoachRequests"; // ✅ ADD THIS
import RunnerOverviewPage from "./pages/RunnerOverviewPage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      setUser(JSON.parse(localUser));
    }
  }, []);

  return (
    <Router>
      {user && <Navbar user={user} setUser={setUser} />}

      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? `/${user.role}` : "/login"} />}
        />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />{" "}
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/profile"
          element={<ProfilePage user={user} setUser={setUser} />}
        />
        {/* Role-specific routes */}
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
          path="/coach/athlete/:runnerId"
          element={<RunnerOverviewPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
