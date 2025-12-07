import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-3xl max-w-4xl w-full grid md:grid-cols-2 overflow-hidden"
      >
        {/* Left Side */}
        <div className="p-10 flex flex-col justify-center bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <h1 className="text-4xl font-bold mb-4">Join Hostein</h1>
          <p className="text-lg opacity-90">
            Start hosting or booking amazing stays around the world.
          </p>
          <div className="mt-10">
            <img
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=60"
              alt="Hosting"
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>

        {/* Right Side – Form */}
        <div className="p-10">
          <h2 className="text-3xl font-semibold text-gray-800">Create your account</h2>
          <p className="text-gray-500 mt-1">Welcome to Hostein — let’s get started!</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-gray-700 font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 font-medium">Confirm</label>
                <input
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:bg-blue-700"
            >
              Create Account
            </motion.button>

            <div className="text-center text-gray-500">
              Already have an account? <a href="#" className="text-blue-600 font-medium">Log in</a>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
