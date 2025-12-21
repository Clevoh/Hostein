import React, { useState } from "react";
import DataTable from "../../components/DataTable";
import AddButton from "../../components/AddButton";
import Modal from "../../components/Modal";

export default function UnitsPage() {
  const [open, setOpen] = useState(false);

  const columns = [
    { key: "unit", title: "Unit" },
    { key: "property", title: "Property" },
    { key: "rent", title: "Rent" },
    { key: "status", title: "Status" },
  ];

  const rows = [
    { unit: "A12", property: "Cozy 2BR", rent: "8000", status: "Occupied" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Units</h1>
        <AddButton label="Add Unit" onClick={() => setOpen(true)} />
      </div>

      <DataTable columns={columns} rows={rows} />

      <Modal title="Add Unit" isOpen={open} onClose={() => setOpen(false)}>
        <form className="space-y-4">
          <input className="w-full border px-3 py-2 rounded-lg" placeholder="Unit name" />
          <input className="w-full border px-3 py-2 rounded-lg" placeholder="Property" />
          <input className="w-full border px-3 py-2 rounded-lg" placeholder="Rent" />

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
            Save Unit
          </button>
        </form>
      </Modal>
    </div>
  );
}
