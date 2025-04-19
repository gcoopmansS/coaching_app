import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RunnerDashboard from "./pages/RunnerDashboard";
import CoachDashboard from "./pages/CoachDashboard";
import ProfilePage from "./pages/ProfilePage";
import ExploreCoaches from "./pages/ExploreCoaches";
import CoachRequests from "./pages/CoachRequests";
import CoachingPage from "./pages/CoachingPage";
import RunnerOverviewPage from "./pages/RunnerOverviewPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/runner" element={<RunnerDashboard />} />
      <Route path="/coach" element={<CoachDashboard />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/explore" element={<ExploreCoaches />} />
      <Route path="/coach/requests" element={<CoachRequests />} />
      <Route path="/coach/athlete/:id" element={<CoachingPage />} />
      <Route path="/coach/runner/:id" element={<RunnerOverviewPage />} />
    </Routes>
  );
}

export default App;
