import React from 'react';

export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-3xl font-bold text-primary-600 mt-2">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
    </div>
  );
}
