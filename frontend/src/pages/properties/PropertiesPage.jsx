// src/pages/properties/PropertiesPage.jsx
import React from "react";
import DataTable from "../../components/DataTable";

export default function PropertiesPage() {
  const columns = [
    { key: "title", title: "Title" },
    { key: "city", title: "City" },
    { key: "price", title: "Price/Night" },
    { key: "host", title: "Host" },
  ];

  const rows = [
    { title: "Cozy 2BR", city: "Nairobi", price: "KSH 3,000", host: "Cleve" },
    { title: "Studio Apt", city: "Eldoret", price: "KSH 2,200", host: "Lih" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Properties</h1>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
}
