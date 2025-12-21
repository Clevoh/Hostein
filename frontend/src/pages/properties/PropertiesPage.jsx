import React, { useState } from "react";
import AddButton from "../../components/AddButton";
import Modal from "../../components/Modal";

export default function PropertiesPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Properties</h2>
        <AddButton label="Add Property" onClick={() => setOpen(true)} />
      </div>

      {/* PROPERTY LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border">Property 1</div>
        <div className="bg-white p-5 rounded-xl border">Property 2</div>
      </div>

      {/* MODAL */}
      <Modal
        title="Add Property"
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <form className="space-y-4">
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Property name"
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Location"
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Total units"
            type="number"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium"
          >
            Save Property
          </button>
        </form>
      </Modal>
    </div>
  );
}
