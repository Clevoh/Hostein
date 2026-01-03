import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      const { token, user } = res.data;

      // Store auth
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Role-based redirect
      if (user.role === "host") navigate("/dashboard");
      else if (user.role === "admin") navigate("/admin");
      else navigate("/client");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Login to Hostein
        </h2>

        {error && (
          <div className="mb-4 text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            placeholder="Email"
            required
          />

          <input
            name="password"
            type="password"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            placeholder="Password"
            required
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
