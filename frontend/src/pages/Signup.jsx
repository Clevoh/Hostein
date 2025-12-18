// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "client", //  default role
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      alert("Passwords do not match");
      return;
    }

    // MOCK signup
    const user = {
      name: form.name,
      email: form.email,
      role: form.role,
    };

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", form.role);

    //  ROLE-BASED REDIRECT
    if (form.role === "host") {
      navigate("/dashboard");
    } else {
      navigate("/client");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl max-w-md w-full p-8">
        <h2 className="text-2xl font-semibold mb-4">Create account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" onChange={handleChange} placeholder="Full name" className="w-full p-3 border rounded" required />
          <input name="email" type="email" onChange={handleChange} placeholder="Email" className="w-full p-3 border rounded" required />

          <select name="role" onChange={handleChange} className="w-full p-3 border rounded">
            <option value="client">Client / Tenant</option>
            <option value="host">Host / Landlord</option>
          </select>

          <input name="password" type="password" onChange={handleChange} placeholder="Password" className="w-full p-3 border rounded" required />
          <input name="confirm" type="password" onChange={handleChange} placeholder="Confirm password" className="w-full p-3 border rounded" required />

          <button className="w-full bg-blue-600 text-white py-3 rounded">
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
