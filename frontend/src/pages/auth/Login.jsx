// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    // Dummy login for now
    if (email === "admin@hostein.com" && password === "admin123") {
      localStorage.setItem("userRole", "admin");
      navigate("/dashboard"); // Redirect to dashboard
    } else {
      alert("Invalid credentials");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg w-[400px]">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Login to Hostein
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
