import React from "react";
import AppRoutes from "./routes";
import "./tailwind.css";

export default function App() {
  return (
    <div className="p-10 bg-gray-200 min-h-screen">
      <h1 className="text-5xl font-bold text-blue-600">
        Tailwind IS Working!
      </h1>

      <button className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg shadow">
        Test Button
      </button>
    </div>
  );
}
