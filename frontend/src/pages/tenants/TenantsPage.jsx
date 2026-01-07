import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import AddButton from "../../components/AddButton";
import {
  getTenants,
  createTenant,
  assignTenantToUnit,
  vacateUnit,
} from "../../services/tenantService";
import { getUnitsByProperty } from "../../services/unitService";
import { useProperties } from "../../context/PropertyContext";
import { LogOut } from "lucide-react";

export default function TenantsPage() {
  const { properties } = useProperties();

  const [tenants, setTenants] = useState([]);
  const [units, setUnits] = useState([]);

  const [open, setOpen] = useState(false);
  const [vacateData, setVacateData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    propertyId: "",
    unitId: "",
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    const data = await getTenants();
    setTenants(data);
  };

  const loadUnits = async (propertyId) => {
    if (!propertyId) return;
    const data = await getUnitsByProperty(propertyId);
    setUnits(data.filter((u) => !u.isOccupied));
  };

  /* ================= ADD TENANT ================= */
  const handleSave = async () => {
    setError("");

    // 🔒 FRONTEND VALIDATION
    if (!form.name || !form.email || !form.phone) {
      return setError("All tenant details are required");
    }

    if (!form.propertyId) {
      return setError("Please select a property");
    }

    if (!form.unitId) {
      return setError("Please select a vacant unit");
    }

    try {
      setSaving(true);

      const tenant = await createTenant({
        name: form.name,
        email: form.email,
        phone: form.phone,
      });

      await assignTenantToUnit(form.unitId, tenant._id);

      setOpen(false);
      setForm({
        name: "",
        email: "",
        phone: "",
        propertyId: "",
        unitId: "",
      });

      loadTenants();
    } catch (err) {
      console.error("SAVE TENANT ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to save tenant");
    } finally {
      setSaving(false);
    }
  };

  /* ================= VACATE ================= */
  const handleVacate = async () => {
    try {
      await vacateUnit(vacateData.unitId);
      setVacateData(null);
      loadTenants();
    } catch (err) {
      console.error("VACATE ERROR:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Tenants</h2>
        <AddButton label="Add Tenant" onClick={() => setOpen(true)} />
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Tenant</th>
              <th className="p-3">Property</th>
              <th className="p-3">Unit</th>
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
                <td className="p-3">{t.property?.title || "-"}</td>
                <td className="p-3">{t.unit?.unitNumber || "-"}</td>
                <td className="p-3 text-center">
                  {t.unit && (
                    <button
                      onClick={() =>
                        setVacateData({ unitId: t.unit._id })
                      }
                      className="text-red-600 flex items-center gap-1 mx-auto"
                    >
                      <LogOut size={14} /> Vacate
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {tenants.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No tenants
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD TENANT */}
      <Modal title="Add Tenant" isOpen={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <input
            className="input"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="input"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="input"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <select
            className="input"
            value={form.propertyId}
            onChange={(e) => {
              setForm({ ...form, propertyId: e.target.value, unitId: "" });
              loadUnits(e.target.value);
            }}
          >
            <option value="">Select property</option>
            {properties.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>

          <select
            className="input"
            value={form.unitId}
            disabled={!form.propertyId}
            onChange={(e) => setForm({ ...form, unitId: e.target.value })}
          >
            <option value="">Select vacant unit</option>
            {units.map((u) => (
              <option key={u._id} value={u._id}>
                {u.unitNumber}
              </option>
            ))}
          </select>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Tenant"}
          </button>
        </div>
      </Modal>

      {/* VACATE */}
      <Modal
        title="Confirm Vacate"
        isOpen={!!vacateData}
        onClose={() => setVacateData(null)}
      >
        <p className="mb-6 text-gray-600">
          Vacate this tenant and free the unit?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setVacateData(null)}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleVacate}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
}
