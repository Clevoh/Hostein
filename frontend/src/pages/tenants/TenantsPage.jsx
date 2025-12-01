// src/pages/tenants/TenantsPage.jsx
import React from "react";
import DataTable from "../../components/DataTable";

export default function TenantsPage() {
  const columns = [
    { key: "name", title: "Name" },
    { key: "email", title: "Email" },
    { key: "unit", title: "Unit" },
    { key: "status", title: "Status" },
  ];

  const rows = [
    { name: "John Mwangi", email: "john@example.com", unit: "A12", status: "Active" },
    { name: "Sarah", email: "sarah@example.com", unit: "B03", status: "Active" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Tenants</h1>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
}
