import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RunnerDashboard from "./pages/RunnerDashboard";
import CoachDashboard from "./pages/CoachDashboard";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/runner" element={<RunnerDashboard />} />
      <Route path="/coach" element={<CoachDashboard />} />
    </Routes>
  );
}

export default App;
