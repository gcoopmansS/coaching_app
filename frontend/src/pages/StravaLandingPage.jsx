import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function StravaLandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      return navigate("/login");
    }

    const user = JSON.parse(storedUser);

    fetch(`${API_URL}/api/users/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((updated) => {
        const fixedUser = { ...updated, id: updated._id };
        localStorage.setItem("user", JSON.stringify(fixedUser));
        navigate("/profile?strava=connected");
      })
      .catch(() => navigate(`/${user.role}`));
  }, [navigate]);

  return null;
}
