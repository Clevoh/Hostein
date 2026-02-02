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
import { LogOut, Search, Mail, Phone, Building2, Home, User } from "lucide-react";

export default function TenantsPage() {
  const { properties } = useProperties();

  const [tenants, setTenants] = useState([]);
  const [units, setUnits] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  /* ================= FILTER TENANTS ================= */
  const filteredTenants = tenants.filter((tenant) => {
    const search = searchQuery.toLowerCase();
    return (
      tenant.name?.toLowerCase().includes(search) ||
      tenant.email?.toLowerCase().includes(search) ||
      tenant.property?.title?.toLowerCase().includes(search) ||
      tenant.unit?.unitNumber?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Tenants</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage your property tenants and unit assignments
          </p>
        </div>
        <AddButton label="Add Tenant" onClick={() => setOpen(true)} />
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name, email, property, or unit..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Tenants</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{tenants.length}</p>
            </div>
            <div className="bg-blue-200 p-3 rounded-lg">
              <User className="text-blue-700" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Occupied Units</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {tenants.filter((t) => t.unit).length}
              </p>
            </div>
            <div className="bg-green-200 p-3 rounded-lg">
              <Home className="text-green-700" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Unassigned</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">
                {tenants.filter((t) => !t.unit).length}
              </p>
            </div>
            <div className="bg-orange-200 p-3 rounded-lg">
              <Building2 className="text-orange-700" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* TENANTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTenants.map((tenant) => (
          <div
            key={tenant._id}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 hover:border-blue-300"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-md">
                  {tenant.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {tenant.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                    <Mail size={12} />
                    <span className="truncate max-w-[180px]">{tenant.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            {tenant.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg">
                <Phone size={14} className="text-gray-400" />
                <span>{tenant.phone}</span>
              </div>
            )}

            {/* Property & Unit Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1">
                  <Building2 size={14} />
                  Property
                </span>
                <span className="font-medium text-gray-900">
                  {tenant.property?.title || (
                    <span className="text-gray-400">Not assigned</span>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1">
                  <Home size={14} />
                  Unit
                </span>
                <span className="font-medium text-gray-900">
                  {tenant.unit?.unitNumber || (
                    <span className="text-gray-400">Not assigned</span>
                  )}
                </span>
              </div>
            </div>

            {/* Action Button */}
            {tenant.unit && (
              <button
                onClick={() => setVacateData({ unitId: tenant.unit._id })}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm border border-red-200"
              >
                <LogOut size={16} />
                Vacate Unit
              </button>
            )}

            {!tenant.unit && (
              <div className="w-full px-4 py-2.5 bg-orange-50 text-orange-600 rounded-lg text-center text-sm font-medium border border-orange-200">
                Awaiting Assignment
              </div>
            )}
          </div>
        ))}

        {filteredTenants.length === 0 && (
          <div className="col-span-full">
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
              <User className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {searchQuery ? "No tenants found" : "No tenants yet"}
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Get started by adding your first tenant"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setOpen(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Add Your First Tenant
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ADD TENANT MODAL */}
      <Modal title="Add Tenant" isOpen={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200 flex items-start gap-2">
              <span className="text-red-500 font-bold">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name *
            </label>
            <input
              className="input w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter tenant name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              className="input w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="tenant@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone Number *
            </label>
            <input
              type="tel"
              className="input w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Property *
            </label>
            <select
              className="input w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              value={form.propertyId}
              onChange={(e) => {
                setForm({ ...form, propertyId: e.target.value, unitId: "" });
                loadUnits(e.target.value);
              }}
            >
              <option value="">Select a property</option>
              {properties.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Unit *
            </label>
            <select
              className="input w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
              value={form.unitId}
              disabled={!form.propertyId}
              onChange={(e) => setForm({ ...form, unitId: e.target.value })}
            >
              <option value="">
                {form.propertyId ? "Select a vacant unit" : "Select property first"}
              </option>
              {units.map((u) => (
                <option key={u._id} value={u._id}>
                  Unit {u.unitNumber}
                </option>
              ))}
            </select>
            {form.propertyId && units.length === 0 && (
              <p className="text-xs text-orange-600 mt-1">
                No vacant units available in this property
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setOpen(false)}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {saving ? "Saving..." : "Add Tenant"}
            </button>
          </div>
        </div>
      </Modal>

      {/* VACATE CONFIRMATION MODAL */}
      <Modal
        title="Confirm Vacate"
        isOpen={!!vacateData}
        onClose={() => setVacateData(null)}
      >
        <div className="text-center py-4">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="text-red-600" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Vacate Unit?
          </h3>
          <p className="text-gray-600 mb-6">
            This will remove the tenant from the unit and mark it as vacant. This action can be reversed by reassigning the tenant.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setVacateData(null)}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleVacate}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Confirm Vacate
          </button>
        </div>
      </Modal>
    </div>
  );
}
