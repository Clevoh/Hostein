import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import {
  getTenants,
  createTenant,
  assignTenantToUnit,
  vacateUnit,
  deleteTenant,
} from "../../services/tenantService";
import { getUnitsByProperty } from "../../services/unitService";
import { useProperties } from "../../context/PropertyContext";
import {
  LogOut,
  Search,
  Mail,
  Phone,
  Building2,
  Home,
  User,
  Trash2,
  MoreVertical,
  Plus,
  UserCheck,
  UserX,
} from "lucide-react";

export default function TenantsPage() {
  const { properties } = useProperties();
  const [tenants, setTenants] = useState([]);
  const [units, setUnits] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [vacateData, setVacateData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", propertyId: "", unitId: "",
  });

  useEffect(() => { loadTenants(); }, []);

  const loadTenants = async () => {
    const data = await getTenants();
    setTenants(data);
  };

  const loadUnits = async (propertyId) => {
    if (!propertyId) return;
    const data = await getUnitsByProperty(propertyId);
    setUnits(data.filter((u) => !u.isOccupied));
  };

  const handleSave = async () => {
    setError("");
    if (!form.name || !form.email || !form.phone) return setError("All tenant details are required");
    if (!form.propertyId) return setError("Please select a property");
    if (!form.unitId) return setError("Please select a vacant unit");

    try {
      setSaving(true);
      const tenant = await createTenant({ name: form.name, email: form.email, phone: form.phone });
      await assignTenantToUnit(form.unitId, tenant._id);
      setOpen(false);
      setForm({ name: "", email: "", phone: "", propertyId: "", unitId: "" });
      loadTenants();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save tenant");
    } finally {
      setSaving(false);
    }
  };

  const handleVacate = async () => {
    try {
      await vacateUnit(vacateData.unitId);
      setVacateData(null);
      loadTenants();
    } catch (err) {
      console.error("VACATE ERROR:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTenant(deleteData.tenantId);
      setDeleteData(null);
      setOpenMenuId(null);
      loadTenants();
    } catch (err) {
      alert("Failed to delete tenant: " + (err.response?.data?.message || err.message));
    }
  };

  const filteredTenants = tenants.filter((tenant) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      tenant.name?.toLowerCase().includes(q) ||
      tenant.email?.toLowerCase().includes(q) ||
      tenant.property?.title?.toLowerCase().includes(q) ||
      tenant.unit?.unitNumber?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-8">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Tenants</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>Manage property tenants and unit assignments</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-700 text-white rounded-xl font-medium text-sm transition shadow-sm"
        >
          <Plus size={16} /> Add Tenant
        </button>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl p-4 border shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium" style={{ color: "var(--text2)" }}>Total</p>
            <div className="p-1.5 bg-blue-50 rounded-xl"><User size={13} className="text-blue-600" /></div>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>{tenants.length}</p>
        </div>
        <div className="rounded-2xl p-4 border shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium" style={{ color: "var(--text2)" }}>Assigned</p>
            <div className="p-1.5 bg-emerald-50 rounded-xl"><UserCheck size={13} className="text-emerald-600" /></div>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>{tenants.filter((t) => t.unit).length}</p>
        </div>
        <div className="rounded-2xl p-4 border shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium" style={{ color: "var(--text2)" }}>Unassigned</p>
            <div className="p-1.5 bg-orange-50 rounded-xl"><UserX size={13} className="text-orange-600" /></div>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>{tenants.filter((t) => !t.unit).length}</p>
        </div>
      </div>

      {/* ── SEARCH ── */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, email, property, or unit…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 transition"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--text)",
          }}
        />
      </div>

      {/* ── TENANTS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTenants.map((tenant) => (
          <div
            key={tenant._id}
            className="relative border rounded-2xl p-5 hover:shadow-md transition-all"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            {/* Menu */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setOpenMenuId(openMenuId === tenant._id ? null : tenant._id)}
                className="p-1.5 hover:bg-slate-100 rounded-xl transition"
              >
                <MoreVertical size={16} className="text-slate-500" />
              </button>

              {openMenuId === tenant._id && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                  <div
                    className="absolute right-0 mt-1 w-44 border rounded-xl shadow-lg z-20 overflow-hidden"
                    style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                  >
                    {tenant.unit && (
                      <button
                        onClick={() => { setVacateData({ unitId: tenant.unit._id }); setOpenMenuId(null); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2 text-sm"
                        style={{ color: "var(--text)" }}
                      >
                        <LogOut size={14} /> Vacate Unit
                      </button>
                    )}
                    <button
                      onClick={() => { setDeleteData({ tenantId: tenant._id, tenantName: tenant.name }); setOpenMenuId(null); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-2 text-sm text-red-600 border-t"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Avatar + name */}
            <div className="flex items-center gap-3 mb-4 pr-8">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-base font-bold flex-shrink-0 shadow-sm">
                {tenant.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold truncate" style={{ color: "var(--text)" }}>{tenant.name}</h3>
                <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: "var(--text2)" }}>
                  <Mail size={10} />
                  <span className="truncate">{tenant.email}</span>
                </div>
              </div>
            </div>

            {/* Phone */}
            {tenant.phone && (
              <div className="flex items-center gap-2 text-xs bg-slate-50 px-3 py-2 rounded-xl mb-3" style={{ color: "var(--text)" }}>
                <Phone size={12} className="text-slate-400" />
                <span>{tenant.phone}</span>
              </div>
            )}

            {/* Property/Unit info */}
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1" style={{ color: "var(--text2)" }}><Building2 size={11} /> Property</span>
                <span className="font-medium truncate max-w-[120px] text-right" style={{ color: "var(--text)" }}>
                  {tenant.property?.title || <span className="text-slate-300">—</span>}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1" style={{ color: "var(--text2)" }}><Home size={11} /> Unit</span>
                <span className="font-medium" style={{ color: "var(--text)" }}>
                  {tenant.unit?.unitNumber ? `Unit ${tenant.unit.unitNumber}` : <span className="text-slate-300">—</span>}
                </span>
              </div>
            </div>

            {/* Status */}
            {tenant.unit ? (
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Assigned
              </div>
            ) : (
              <div className="text-xs font-medium text-orange-600 bg-orange-50 border border-orange-100 px-3 py-2 rounded-xl text-center">
                Awaiting Assignment
              </div>
            )}
          </div>
        ))}

        {/* Empty state */}
        {filteredTenants.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mb-4">
              <User size={28} className="text-slate-300" />
            </div>
            <h3 className="font-bold mb-1" style={{ color: "var(--text)" }}>
              {searchQuery ? "No tenants found" : "No tenants yet"}
            </h3>
            <p className="text-sm mb-5" style={{ color: "var(--text2)" }}>
              {searchQuery ? "Try a different search" : "Add your first tenant to get started"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-700 transition"
              >
                <Plus size={15} /> Add Tenant
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── ADD TENANT MODAL ── */}
      <Modal title="Add Tenant" isOpen={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-100 p-3 rounded-xl flex items-start gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          {[
            { label: "Full Name", key: "name", type: "text", placeholder: "Enter tenant name" },
            { label: "Email Address", key: "email", type: "email", placeholder: "tenant@example.com" },
            { label: "Phone Number", key: "phone", type: "tel", placeholder: "+1 (555) 000-0000" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text)" }}>{label} *</label>
              <input
                type={type}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white transition"
                style={{ color: "var(--text)" }}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text)" }}>Property *</label>
            <select
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white transition"
              style={{ color: "var(--text)" }}
              value={form.propertyId}
              onChange={(e) => { setForm({ ...form, propertyId: e.target.value, unitId: "" }); loadUnits(e.target.value); }}
            >
              <option value="">Select a property</option>
              {properties.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text)" }}>Unit *</label>
            <select
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm disabled:opacity-60 transition"
              style={{ color: "var(--text)" }}
              value={form.unitId}
              disabled={!form.propertyId}
              onChange={(e) => setForm({ ...form, unitId: e.target.value })}
            >
              <option value="">{form.propertyId ? "Select a vacant unit" : "Select property first"}</option>
              {units.map((u) => <option key={u._id} value={u._id}>Unit {u.unitNumber}</option>)}
            </select>
            {form.propertyId && units.length === 0 && (
              <p className="text-xs text-orange-500 mt-1">No vacant units in this property</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setOpen(false)}
              className="flex-1 px-4 py-2.5 border rounded-xl font-medium text-sm hover:bg-slate-50 transition"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl font-medium text-sm hover:bg-slate-700 transition disabled:opacity-50"
            >
              {saving ? "Saving…" : "Add Tenant"}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── VACATE MODAL ── */}
      <Modal title="Vacate Unit" isOpen={!!vacateData} onClose={() => setVacateData(null)}>
        <div className="text-center py-2">
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogOut className="text-orange-500" size={22} />
          </div>
          <p className="text-sm mb-6" style={{ color: "var(--text2)" }}>
            This will remove the tenant from the unit and mark it as vacant.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setVacateData(null)}
              className="flex-1 px-4 py-2.5 border rounded-xl font-medium text-sm hover:bg-slate-50 transition"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
            >
              Cancel
            </button>
            <button onClick={handleVacate} className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium text-sm transition">Confirm Vacate</button>
          </div>
        </div>
      </Modal>

      {/* ── DELETE MODAL ── */}
      <Modal title="Delete Tenant" isOpen={!!deleteData} onClose={() => setDeleteData(null)}>
        <div className="text-center py-2">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trash2 className="text-red-500" size={22} />
          </div>
          <p className="text-sm mb-1" style={{ color: "var(--text2)" }}>
            Delete <strong>{deleteData?.tenantName}</strong> permanently?
          </p>
          <p className="text-xs text-red-500 mb-6">This action cannot be undone.</p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteData(null)}
              className="flex-1 px-4 py-2.5 border rounded-xl font-medium text-sm hover:bg-slate-50 transition"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
            >
              Cancel
            </button>
            <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-sm transition">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}