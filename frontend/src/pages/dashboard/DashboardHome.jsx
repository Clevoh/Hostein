// src/pages/dashboard/DashboardHome.jsx
import React from "react";
import StatCard from "../../components/StatCard";
import DataTable from "../../components/DataTable";

export default function DashboardHome() {
  // placeholder data — replace with API calls
  const stats = [
    { title: "Total Properties", value: 12 },
    { title: "Total Units", value: 48 },
    { title: "Occupied Units", value: 35 },
    { title: "Monthly Revenue", value: "KSH 270,000" },
  ];

  const recentTenants = [
    { name: "Clevoh Lih", unit: "Aa13", phone: "0712345679", status: "Active" },
    { name: "John Mwangi", unit: "A12", phone: "0712345678", status: "Active" },
    { name: "Sarah W.", unit: "B03", phone: "0798765432", status: "Active" },
    { name: "Peter O.", unit: "C07", phone: "0700112233", status: "Pending" },
  ];

  const columns = [
    { key: "name", title: "Name" },
    { key: "unit", title: "Unit" },
    { key: "phone", title: "Phone" },
    { Key: "Duration", title: "Duration"},
    { key: "status", title: "Status", render: (r) => (
      <span className={r.status === "Active" ? "text-green-600 font-semibold" : r.status === "Pending" ? "text-yellow-600 font-semibold" : "text-gray-600"}>
        {r.status}
      </span>
    ) },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((s) => (
          <StatCard key={s.title} title={s.title} value={s.value} />
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Recent Tenants</h2>
        <DataTable columns={columns} rows={recentTenants} />
      </div>
    </div>
  );
}
