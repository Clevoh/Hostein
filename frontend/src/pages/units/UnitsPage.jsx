// src/pages/units/UnitsPage.jsx
import React from "react";
import DataTable from "../../components/DataTable";

export default function UnitsPage() {
  const columns = [
    { key: "unit", title: "Unit" },
    { key: "property", title: "Property" },
    { key: "beds", title: "Beds" },
    { key: "rent", title: "Rent" },
    { key: "status", title: "Status" },
  ];

  const rows = [
    { unit: "A12", property: "Cozy 2BR", beds: 2, rent: "KSH 8,000", status: "Occupied" },
    { unit: "B03", property: "Studio Apt", beds: 1, rent: "KSH 5,000", status: "Vacant" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Units</h1>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
}
