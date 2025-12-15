// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "client", // default role
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // MOCK LOGIN — replace this with API call later
    const { role } = form;

    // Save role in localStorage to simulate authentication
    localStorage.setItem("role", role);

    if (role === "host") {
      navigate("/dashboard");
    } else {
      navigate("/client");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Login to Hostein
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter password"
              required
            />
          </div>

          {/* ROLE SELECTION */}
          <div className="mb-6">
            <label className="block mb-1 font-medium">Login as</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="client">Client / Tenant</option>
              <option value="host">Host / Landlord</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
