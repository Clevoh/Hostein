import { useParams, Link } from "react-router-dom";
import { useProperties } from "../../context/PropertyContext";
import { useState } from "react";

export default function UnitsPage() {
  const { propertyId } = useParams();
  const { properties, addUnit, deleteUnit } = useProperties();

  const property = properties.find(
    (p) => String(p.id) === String(propertyId)
  );

  /* =========================
     FORM STATE
  ========================= */
  const [form, setForm] = useState({
    name: "",
    rent: "",
    type: "Bedsitter",
  });

  /* ❗ NO REDIRECTS */
  if (!property) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Property not found
        </h2>
        <p className="text-gray-600">
          This property does not exist or was not loaded.
        </p>
        <Link
          to="/dashboard/properties"
          className="text-blue-600 underline"
        >
          Back to Properties
        </Link>
      </div>
    );
  }

  /* =========================
     ADD UNIT
  ========================= */
  const handleAddUnit = () => {
    if (!form.name || !form.rent) return;

    addUnit(property.id, {
      id: Date.now(),
      name: form.name,
      rent: form.rent,
      type: form.type,
      status: "vacant",
    });

    setForm({
      name: "",
      rent: "",
      type: "Bedsitter",
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Units — {property.name}
        </h2>

        <Link
          to="/dashboard/properties"
          className="text-sm text-blue-600"
        >
          ← Back to Properties
        </Link>
      </div>

      {/* ADD UNIT FORM */}
      <div className="bg-white border rounded-xl p-4 grid gap-4 md:grid-cols-4">
        <input
          className="input"
          placeholder="Unit name / number"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="number"
          className="input"
          placeholder="Rent amount"
          value={form.rent}
          onChange={(e) =>
            setForm({ ...form, rent: e.target.value })
          }
        />

        <select
          className="input"
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
        >
          <option>Bedsitter</option>
          <option>Single Room</option>
          <option>Studio</option>
          <option>1 Bedroom</option>
          <option>2 Bedroom</option>
          <option>3 Bedroom</option>
        </select>

        <button
          onClick={handleAddUnit}
          className="bg-blue-600 text-white rounded-lg px-4"
        >
          Add Unit
        </button>
      </div>

      {/* UNITS LIST */}
      <div className="grid gap-4">
        {property.units.length === 0 && (
          <p className="text-gray-500">
            No units added yet
          </p>
        )}

        {property.units.map((unit) => (
          <div
            key={unit.id}
            className="bg-white border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">
                {unit.name} ({unit.type})
              </p>
              <p className="text-sm text-gray-500">
                Rent: KES {unit.rent} · Status:{" "}
                {unit.status}
              </p>
            </div>

            <button
              onClick={() =>
                deleteUnit(property.id, unit.id)
              }
              className="text-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
