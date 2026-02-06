import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add token to requestscd ..
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors WITHOUT forcing redirect (let components handle it)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Only clear auth if it's actually an auth error, not a network error
    if (err.response?.status === 401) {
      // Don't redirect here - let the components handle it
      // This prevents infinite loops
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(err);
  }
);

export default api;