import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProperties } from "../../context/PropertyContext";
import AddButton from "../../components/AddButton";
import Modal from "../../components/Modal";

export default function UnitsPage() {
  const { properties, updateProperty } = useProperties();
  const [params] = useSearchParams();
  const propertyId = Number(params.get("property"));

  const property = properties.find((p) => p.id === propertyId);

  const [open, setOpen] = useState(false);
  const [unit, setUnit] = useState({
    name: "",
    type: "unit", // unit | room | bed
    capacity: 1,
    rent: "",
    status: "available",
  });

  if (!property) {
    return <p className="text-gray-600">Select a property first.</p>;
  }

  const addUnit = () => {
    const updated = {
      ...property,
      units: [
        ...property.units,
        { ...unit, id: Date.now() },
      ],
    };

    updateProperty(property.id, updated);
    setOpen(false);
    setUnit({ name: "", type: "unit", capacity: 1, rent: "", status: "available" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Units</h1>
          <p className="text-sm text-gray-500">{property.name}</p>
        </div>
        <AddButton label="Add Unit" onClick={() => setOpen(true)} />
      </div>

      {/* UNITS LIST */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Capacity</th>
              <th className="p-3">Rent</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {property.units.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td className="p-3 capitalize">{u.type}</td>
                <td className="p-3">{u.capacity}</td>
                <td className="p-3">KSH {u.rent}</td>
                <td className="p-3">
                  <span className={u.status === "available"
                    ? "text-green-600"
                    : "text-red-600"}>
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD UNIT MODAL */}
      <Modal title="Add Unit" isOpen={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <input
            className="input"
            placeholder={property.category === "hostel" ? "Room / Bed name" : "Unit name"}
            onChange={(e) => setUnit({ ...unit, name: e.target.value })}
          />

          {/* UNIT TYPE */}
          {property.category === "hostel" && (
            <select
              className="input"
              onChange={(e) => setUnit({ ...unit, type: e.target.value })}
            >
              <option value="room">Room</option>
              <option value="bed">Bed</option>
            </select>
          )}

          <input
            className="input"
            type="number"
            placeholder="Capacity"
            onChange={(e) => setUnit({ ...unit, capacity: e.target.value })}
          />

          <input
            className="input"
            type="number"
            placeholder="Rent (KSH)"
            onChange={(e) => setUnit({ ...unit, rent: e.target.value })}
          />

          <button
            onClick={addUnit}
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            Save Unit
          </button>
        </div>
      </Modal>
    </div>
  );
}
