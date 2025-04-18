import Navbar from "../components/Navbar";

export default function CoachDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Navbar user={user} />
      <h2>📋 Coach Dashboard</h2>
    </>
  );
}
