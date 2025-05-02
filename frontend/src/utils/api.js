// src/utils/api.js
export function authFetch(url, options = {}, onLogout) {
  const token = localStorage.getItem("token");

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  }).then(async (res) => {
    if (res.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (typeof onLogout === "function") {
        onLogout();
      }
      throw new Error("Unauthorized");
    }

    return res;
  });
}
