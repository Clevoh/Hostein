import { useState } from "react";
import Modal from "../../components/Modal";
import AddButton from "../../components/AddButton";
import { useProperties } from "../../context/PropertyContext";
import { LogOut } from "lucide-react";

export default function TenantsPage() {
  const { properties, updateProperty } = useProperties();

  const [addOpen, setAddOpen] = useState(false);
  const [moveOutData, setMoveOutData] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    propertyId: "",
    unitId: "",
    startDate: "",
  });

  /* BUILD ACTIVE TENANTS LIST */
  const tenants = properties.flatMap((property) =>
    property.units?.flatMap((unit) =>
      (unit.tenants || [])
        .filter((t) => t.status === "active")
        .map((t) => ({
          ...t,
          propertyId: property._id,
          propertyName: property.title,
          unitId: unit._id,
          unitName: unit.unitNumber,
        }))
    )
  );

  const selectedProperty = properties.find(
    (p) => p._id === form.propertyId
  );

  const selectedUnit = selectedProperty?.units.find(
    (u) => u._id === form.unitId
  );

  /* ADD TENANT */
  const addTenant = () => {
    if (!selectedProperty || !selectedUnit) return;

    const updatedUnits = selectedProperty.units.map((u) =>
      u._id === selectedUnit._id
        ? {
            ...u,
            isOccupied: true,
            tenants: [
              ...(u.tenants || []),
              {
                _id: Date.now().toString(),
                name: form.name,
                email: form.email,
                startDate: form.startDate,
                status: "active",
              },
            ],
          }
        : u
    );

    updateProperty(selectedProperty._id, {
      ...selectedProperty,
      units: updatedUnits,
    });

    setForm({
      name: "",
      email: "",
      propertyId: "",
      unitId: "",
      startDate: "",
    });

    setAddOpen(false);
  };

  /* MOVE OUT */
  const confirmMoveOut = () => {
    const { propertyId, unitId, tenantId } = moveOutData;

    const property = properties.find((p) => p._id === propertyId);

    const updatedUnits = property.units.map((u) =>
      u._id === unitId
        ? {
            ...u,
            isOccupied: false,
            tenants: u.tenants.map((t) =>
              t._id === tenantId
                ? { ...t, status: "inactive", endDate: new Date() }
                : t
            ),
          }
        : u
    );

    updateProperty(propertyId, {
      ...property,
      units: updatedUnits,
    });

    setMoveOutData(null);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Tenants & Occupancy</h1>
        <AddButton label="Add Tenant" onClick={() => setAddOpen(true)} />
      </div>

      {/* TENANTS TABLE */}
      <div className="bg-white border rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Tenant</th>
              <th className="p-3">Property</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Start Date</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => (
              <tr key={t._id} className="border-t">
                <td className="p-3">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.email}</div>
                </td>
                <td className="p-3">{t.propertyName}</td>
                <td className="p-3">{t.unitName}</td>
                <td className="p-3">{t.startDate}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() =>
                      setMoveOutData({
                        tenantId: t._id,
                        unitId: t.unitId,
                        propertyId: t.propertyId,
                      })
                    }
                    className="inline-flex items-center gap-1 text-red-600 hover:bg-red-50 px-3 py-1 rounded"
                  >
                    <LogOut size={14} /> Move out
                  </button>
                </td>
              </tr>
            ))}

            {tenants.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No active tenants
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD TENANT MODAL */}
      <Modal title="Add Tenant" isOpen={addOpen} onClose={() => setAddOpen(false)}>
        <div className="space-y-4">
          <input
            className="input"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="input"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <select
            className="input"
            value={form.propertyId}
            onChange={(e) =>
              setForm({ ...form, propertyId: e.target.value, unitId: "" })
            }
          >
            <option value="">Select property</option>
            {properties.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>

          {selectedProperty && (
            <select
              className="input"
              value={form.unitId}
              onChange={(e) =>
                setForm({ ...form, unitId: e.target.value })
              }
            >
              <option value="">Select vacant unit</option>
              {selectedProperty.units
                .filter((u) => !u.isOccupied)
                .map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.unitNumber}
                  </option>
                ))}
            </select>
          )}

          <input
            type="date"
            className="input"
            value={form.startDate}
            onChange={(e) =>
              setForm({ ...form, startDate: e.target.value })
            }
          />

          <button
            onClick={addTenant}
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            Save Tenant
          </button>
        </div>
      </Modal>

      {/* MOVE OUT CONFIRMATION */}
      <Modal
        title="Confirm Move Out"
        isOpen={!!moveOutData}
        onClose={() => setMoveOutData(null)}
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to move out this tenant?
          The unit will become vacant.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setMoveOutData(null)}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={confirmMoveOut}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Confirm Move Out
          </button>
        </div>
      </Modal>
    </div>
  );
}
