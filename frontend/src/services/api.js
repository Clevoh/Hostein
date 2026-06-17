// frontend/src/services/api.js

import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

//  Attach token to EVERY request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//  Handle errors SAFELY (no auto-destroy)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn("Unauthorized request detected");

    
      //  NEW: only log warning

      // Optional: only clear if login fails
      if (err.config.url.includes("/auth")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    return Promise.reject(err);
  }
);

export default api;