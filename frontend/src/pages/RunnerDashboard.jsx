import Navbar from "../components/Navbar";

export default function RunnerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Navbar user={user} />
      <h2>🏃‍♂️ Runner Dashboard</h2>
    </>
  );
}
