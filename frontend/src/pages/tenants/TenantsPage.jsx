import React, { useState } from "react";
import DataTable from "../../components/DataTable";
import AddButton from "../../components/AddButton";
import Modal from "../../components/Modal";

export default function TenantsPage() {
  const [open, setOpen] = useState(false);

  const columns = [
    { key: "name", title: "Name" },
    { key: "email", title: "Email" },
    { key: "unit", title: "Unit" },
    { key: "status", title: "Status" },
  ];

  const rows = [{ name: "John", email: "john@mail.com", unit: "A12", status: "Active" }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Tenants</h1>
        <AddButton label="Add Tenant" onClick={() => setOpen(true)} />
      </div>

      <DataTable columns={columns} rows={rows} />

      <Modal title="Add Tenant" isOpen={open} onClose={() => setOpen(false)}>
        <form className="space-y-4">
          <input className="w-full border px-3 py-2 rounded-lg" placeholder="Full name" />
          <input className="w-full border px-3 py-2 rounded-lg" placeholder="Email" />
          <input className="w-full border px-3 py-2 rounded-lg" placeholder="Unit" />

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
            Save Tenant
          </button>
        </form>
      </Modal>
    </div>
  );
}
