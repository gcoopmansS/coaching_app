import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RunnerDashboard from "./pages/RunnerDashboard";
import CoachDashboard from "./pages/CoachDashboard";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/runner" element={<RunnerDashboard />} />
      <Route path="/coach" element={<CoachDashboard />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;
