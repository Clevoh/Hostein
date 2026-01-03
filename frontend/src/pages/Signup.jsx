import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "client",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl max-w-md w-full p-8">
        <h2 className="text-2xl font-semibold mb-4">Create account</h2>

        {error && (
          <div className="mb-4 text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            onChange={handleChange}
            placeholder="Full name"
            className="w-full p-3 border rounded"
            required
          />

          <input
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border rounded"
            required
          />

          <select
            name="role"
            onChange={handleChange}
            className="w-full p-3 border rounded"
          >
            <option value="client">Client / Tenant</option>
            <option value="host">Host / Landlord</option>
          </select>

          <input
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border rounded"
            required
          />

          <input
            name="confirm"
            type="password"
            onChange={handleChange}
            placeholder="Confirm password"
            className="w-full p-3 border rounded"
            required
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
