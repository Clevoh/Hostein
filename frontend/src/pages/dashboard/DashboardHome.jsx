// src/pages/dashboard/DashboardHome.jsx
import React from "react";
import StatCard from "../../components/StatCard";
import DataTable from "../../components/DataTable";
import DashboardCharts from "../../components/DashboardCharts";
import { Building2, Grid, Users, CreditCard } from "lucide-react";

export default function DashboardHome() {
  const stats = [
    {
      title: "Total Properties",
      value: 12,
      icon: Building2,
    },
    {
      title: "Total Units",
      value: 48,
      icon: Grid,
    },
    {
      title: "Occupied Units",
      value: 35,
      icon: Users,
    },
    {
      title: "Monthly Revenue",
      value: "KSH 270,000",
      icon: CreditCard,
    },
  ];

  const recentTenants = [
    { name: "Clevoh Lih", unit: "A13", phone: "0712345679", status: "Active" },
    { name: "John Mwangi", unit: "A12", phone: "0712345678", status: "Active" },
    { name: "Sarah W.", unit: "B03", phone: "0798765432", status: "Pending" },
  ];

  const columns = [
    { key: "name", title: "Name" },
    { key: "unit", title: "Unit" },
    { key: "phone", title: "Phone" },
    {
      key: "status",
      title: "Status",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold
            ${
              row.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-10">
      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* CHARTS */}
      <DashboardCharts />

      {/* RECENT TENANTS */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Tenants</h2>
        <DataTable columns={columns} rows={recentTenants} />
      </div>
    </div>
  );
}
