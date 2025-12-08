// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Passwords do not match");
      return;
    }
    // Mock signup: save to localStorage
    const user = { name: form.name, email: form.email };
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl max-w-3xl w-full grid md:grid-cols-2 overflow-hidden">
        {/* left */}
        <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex flex-col justify-center gap-6">
          <h1 className="text-3xl font-bold">Join Hostein</h1>
          <p className="opacity-90">Start hosting or booking great stays — manage bookings, tenants and more.</p>
          <img
            src="https://source.unsplash.com/600x400/?home,apartment"
            alt="hosting"
            className="rounded-xl shadow-inner"
          />
        </div>

        {/* right: form */}
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800">Create your account</h2>
          <p className="text-sm text-gray-500 mt-1">Welcome to Hostein — let’s get started</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-300"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-300"
                placeholder="you@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-300"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm</label>
                <input
                  name="confirm"
                  type="password"
                  value={form.confirm}
                  onChange={handleChange}
                  required
                  className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
              Create account
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account? <a className="text-blue-600 hover:underline" href="/login">Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
