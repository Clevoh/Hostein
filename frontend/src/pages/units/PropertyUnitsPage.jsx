import { useParams, Link } from "react-router-dom";
import { useProperties } from "../../context/PropertyContext";
import { useEffect, useState } from "react";
import {
  getUnitsByProperty,
  createUnit,
  deleteUnit,
} from "../../services/unitService";

export default function UnitsPage() {
  const { propertyId } = useParams();
  const { properties } = useProperties();

  const property = properties.find(
    (p) => String(p._id) === String(propertyId)
  );

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    unitNumber: "",
    unitType: "Bedsitter",
    bedrooms: 0,
    bathrooms: 1,
    rentAmount: "",
  });

  /* ================= LOAD UNITS ================= */
  useEffect(() => {
    if (!propertyId) return;

    const loadUnits = async () => {
      try {
        setLoading(true);
        const data = await getUnitsByProperty(propertyId);
        setUnits(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("LOAD UNITS FAILED", err);
        setUnits([]);
      } finally {
        setLoading(false);
      }
    };

    loadUnits();
  }, [propertyId]);

  /* ================= PROPERTY GUARD ================= */
  if (!property) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Property not found</h2>
        <p className="text-gray-600">
          This property does not exist or was not loaded.
        </p>
        <Link to="/dashboard/properties" className="text-blue-600 underline">
          Back to Properties
        </Link>
      </div>
    );
  }

  /* ================= ADD UNIT ================= */
  const handleAddUnit = async () => {
    if (!form.unitNumber || !form.rentAmount) return;

    const payload = {
      ...form,
      rentAmount: Number(form.rentAmount),
      property: propertyId, // 🔥 REQUIRED BY BACKEND
    };

    try {
      const created = await createUnit(payload);
      setUnits((prev) => [created, ...prev]);
      setForm({
        unitNumber: "",
        unitType: "Bedsitter",
        bedrooms: 0,
        bathrooms: 1,
        rentAmount: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create unit");
    }
  };

  /* ================= DELETE UNIT ================= */
  const handleDelete = async (unitId) => {
    await deleteUnit(unitId);
    setUnits((prev) => prev.filter((u) => u._id !== unitId));
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Units — {property.title}
        </h2>
        <Link
          to="/dashboard/properties"
          className="text-sm text-blue-600"
        >
          ← Back to Properties
        </Link>
      </div>

      {/* ADD UNIT FORM */}
      <div className="bg-white border rounded-xl p-4 grid gap-4 md:grid-cols-6">
        <input
          className="input"
          placeholder="Unit number"
          value={form.unitNumber}
          onChange={(e) =>
            setForm({ ...form, unitNumber: e.target.value })
          }
        />

        <select
          className="input"
          value={form.unitType}
          onChange={(e) =>
            setForm({ ...form, unitType: e.target.value })
          }
        >
          <option>Bedsitter</option>
          <option>Single Room</option>
          <option>Studio</option>
          <option>1 Bedroom</option>
          <option>2 Bedroom</option>
          <option>3 Bedroom</option>
        </select>

        <input
          type="number"
          className="input"
          placeholder="Bedrooms"
          value={form.bedrooms}
          onChange={(e) =>
            setForm({ ...form, bedrooms: e.target.value })
          }
        />

        <input
          type="number"
          className="input"
          placeholder="Bathrooms"
          value={form.bathrooms}
          onChange={(e) =>
            setForm({ ...form, bathrooms: e.target.value })
          }
        />

        <input
          type="number"
          className="input"
          placeholder="Rent amount"
          value={form.rentAmount}
          onChange={(e) =>
            setForm({ ...form, rentAmount: e.target.value })
          }
        />

        <button
          onClick={handleAddUnit}
          className="bg-blue-600 text-white rounded-lg px-4"
        >
          Add Unit
        </button>
      </div>

      {/* UNITS LIST */}
      {loading && <p className="text-gray-500">Loading units…</p>}

      {!loading && units.length === 0 && (
        <p className="text-gray-500">No units added yet</p>
      )}

      <div className="grid gap-4">
        {units.map((unit) => (
          <div
            key={unit._id}
            className="bg-white border rounded-lg p-4 flex justify-between"
          >
            <div>
              <p className="font-medium">
                {unit.unitNumber} ({unit.unitType})
              </p>
              <p className="text-sm text-gray-500">
                Rent: {unit.rentAmount} ·{" "}
                {unit.isOccupied ? "Occupied" : "Vacant"}
              </p>
            </div>

            <button
              onClick={() => handleDelete(unit._id)}
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
