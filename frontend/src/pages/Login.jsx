// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
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
      const { user } = await login(form.email, form.password);

      const role = user?.role;
      if (role === "host" || role === "landlord") {
        navigate("/dashboard", { replace: true });
      } else if (role === "client") {
        navigate("/client", { replace: true });
      } else if (role === "service_provider") {
        navigate("/service-provider", { replace: true });
      } else if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg)" }}>
      <div className="p-10 rounded-xl shadow-lg w-full max-w-md" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
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
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded"
            style={{ border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" }}
            placeholder="Email"
            required
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded"
            style={{ border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" }}
            placeholder="Password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm" style={{ color: "var(--text2)" }}>
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}