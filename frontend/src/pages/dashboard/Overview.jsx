// src/pages/dashboard/Overview.jsx

import React from "react";
import { Users, Building2, Home, CreditCard } from "lucide-react";

export default function Overview() {
  const stats = [
    {
      title: "Total Tenants",
      value: 32,
      icon: Users,
    },
    {
      title: "Total Units",
      value: 56,
      icon: Building2,
    },
    {
      title: "Occupied Units",
      value: 41,
      icon: Home,
    },
    {
      title: "Monthly Revenue",
      value: "KSH 270,000",
      icon: CreditCard,
    },
  ];

  const recentTenants = [
    { name: "John Mwangi", unit: "A12", phone: "0712345678", status: "Active" },
    { name: "Sarah Wanjiku", unit: "B03", phone: "0798765432", status: "Active" },
    { name: "Peter Otieno", unit: "C07", phone: "0700112233", status: "Pending" },
  ];

  return (
    <div className="min-h-screen">
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold mb-6">Host Dashboard</h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <h2 className="text-3xl font-bold mt-1">{item.value}</h2>
            </div>
            <item.icon className="w-8 h-8 text-blue-500" />
          </div>
        ))}
      </div>

      {/* RECENT TENANTS */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mt-10">
        <h3 className="text-lg font-semibold mb-4">Recent Tenants</h3>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Name</th>
              <th className="py-2">Unit</th>
              <th className="py-2">Phone</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {recentTenants.map((t, index) => (
              <tr key={index} className="border-b">
                <td className="py-3">{t.name}</td>
                <td>{t.unit}</td>
                <td>{t.phone}</td>
                <td>
                  <span
                    className={`${
                      t.status === "Active"
                        ? "text-green-600"
                        : "text-yellow-600"
                    } font-medium`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
