// src/components/StatCard.jsx
import React from "react";

export default function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-900">
            {value}
          </h3>
        </div>

        {Icon && (
          <div className="p-3 bg-blue-100 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        )}
      </div>
    </div>
  );
}
