import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "client",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const userData = {
      email: form.email,
      role: form.role,
      token: "mock-jwt-token",
      expiresAt: Date.now() + 60 * 60 * 1000,
    };

    login(userData);

    if (form.role === "host") navigate("/dashboard");
    else if (form.role === "admin") navigate("/admin");
    else navigate("/client");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Login to Hostein
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            onChange={handleChange}
            className="w-full mb-4 px-4 py-2 border rounded"
            placeholder="Email"
            required
          />

          <input
            name="password"
            type="password"
            onChange={handleChange}
            className="w-full mb-4 px-4 py-2 border rounded"
            placeholder="Password"
            required
          />

          <select
            name="role"
            onChange={handleChange}
            className="w-full mb-6 px-4 py-2 border rounded"
          >
            <option value="client">Client</option>
            <option value="host">Host</option>
            <option value="admin">Admin</option>
          </select>

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
