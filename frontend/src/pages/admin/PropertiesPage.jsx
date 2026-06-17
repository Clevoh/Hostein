import { useState, useEffect } from "react";
import { Search, Home, MapPin, DollarSign, CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";
import { getAllProperties, updatePropertyStatus, deleteProperty } from "../../services/adminService";

const STATUS_STYLE = {
  active:   { cls: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: CheckCircle },
  pending:  { cls: "bg-amber-50 text-amber-700 border-amber-100",       icon: Clock },
  inactive: { cls: "bg-slate-100 text-slate-600 border-slate-200",      icon: XCircle },
  rejected: { cls: "bg-red-50 text-red-600 border-red-100",             icon: XCircle },
};

const getImageUrl = (p) => {
  if (!p) return "https://placehold.co/600x400/1e293b/475569?text=No+Image";
  return p.startsWith("http") ? p : `${import.meta.env.VITE_API_URL}${p}`;
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => { load(); }, [statusFilter]);

  const load = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (statusFilter !== "all") filters.status = statusFilter;
      if (search) filters.search = search;
      setProperties(await getAllProperties(filters));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try { await updatePropertyStatus(id, status); load(); }
    catch { alert("Failed to update status"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try { await deleteProperty(id); load(); }
    catch { alert("Failed to delete property"); }
  };

  const filtered = properties.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.city?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-10 h-10 rounded-full border-2 animate-spin"
        style={{ borderColor: "var(--border)", borderTopColor: "#ef4444" }} />
    </div>
  );

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Property Management</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>Monitor all properties listed on the platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total",    value: properties.length,                                      color: "var(--text)" },
          { label: "Active",   value: properties.filter(p => p.status === "active").length,   color: "#10b981" },
          { label: "Pending",  value: properties.filter(p => p.status === "pending").length,  color: "#f59e0b" },
          { label: "Inactive", value: properties.filter(p => p.status === "inactive").length, color: "var(--text2)" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl p-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--text2)" }}>{label}</p>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search / filter bar */}
      <div className="rounded-2xl p-4"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text2)" }} />
            <input
              type="text"
              placeholder="Search by title or city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-sm focus:outline-none"
            style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
          >
            <option value="all">All Status</option>
            {["active","pending","inactive"].map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <button
            onClick={load}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#ef4444" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#dc2626"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#ef4444"}
          >
            Search
          </button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const st = STATUS_STYLE[p.status] || STATUS_STYLE.pending;
            const StatusIcon = st.icon;
            return (
              <div
                key={p._id}
                className="rounded-2xl overflow-hidden transition-shadow hover:shadow-md"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                {/* Image */}
                <div className="h-44 overflow-hidden bg-slate-800 relative">
                  <img
                    src={getImageUrl(p.images?.[0])}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${st.cls}`}>
                      <StatusIcon size={11} />{p.status}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 truncate" style={{ color: "var(--text)" }}>{p.title}</h3>
                  <p className="text-xs flex items-center gap-1 mb-3" style={{ color: "var(--text2)" }}>
                    <MapPin size={11} /> {p.city}, {p.country}
                  </p>

                  <div className="flex items-center justify-between text-xs mb-3" style={{ color: "var(--text2)" }}>
                    <span className="flex items-center gap-1"><DollarSign size={11} />{p.price || "—"}/mo</span>
                    <span className="flex items-center gap-1"><Home size={11} />{p.units?.length || 0} units</span>
                    <span>Host: {p.owner?.name || "—"}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                    {p.status === "pending" && (
                      <>
                        <button onClick={() => updateStatus(p._id, "active")}
                          className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition">
                          Approve
                        </button>
                        <button onClick={() => updateStatus(p._id, "rejected")}
                          className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition">
                          Reject
                        </button>
                      </>
                    )}
                    {p.status === "active" && (
                      <button onClick={() => updateStatus(p._id, "inactive")}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold transition"
                        style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}>
                        Deactivate
                      </button>
                    )}
                    {p.status === "inactive" && (
                      <button onClick={() => updateStatus(p._id, "active")}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition">
                        Reactivate
                      </button>
                    )}
                    <button onClick={() => handleDelete(p._id)}
                      className="p-2 rounded-xl transition"
                      style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl"
          style={{ background: "var(--surface)", border: "2px dashed var(--border)" }}>
          <Home size={32} className="mb-3" style={{ color: "var(--text2)", opacity: 0.3 }} />
          <p className="text-sm" style={{ color: "var(--text2)" }}>No properties found</p>
        </div>
      )}
    </div>
  );
}