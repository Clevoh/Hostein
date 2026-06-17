import { useState, useEffect } from "react";
import { Search, User, CheckCircle, XCircle, Users, UserCheck, UserX, ShieldCheck } from "lucide-react";
import { getAllUsers, deleteUser, toggleUserStatus } from "../../services/adminService";

const ROLE_STYLE = {
  admin:    "bg-red-50 text-red-700 border-red-100",
  host:     "bg-blue-50 text-blue-700 border-blue-100",
  client:   "bg-emerald-50 text-emerald-700 border-emerald-100",
  landlord: "bg-violet-50 text-violet-700 border-violet-100",
  tenant:   "bg-amber-50 text-amber-700 border-amber-100",
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => { loadUsers(); }, [roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (roleFilter !== "all") filters.role = roleFilter;
      if (search) filters.search = search;
      setUsers(await getAllUsers(filters));
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try { await deleteUser(id); loadUsers(); }
    catch (err) { alert("Failed to delete: " + (err.response?.data?.message || err.message)); }
  };

  const handleToggle = async (id, current) => {
    try { await toggleUserStatus(id, !current); loadUsers(); }
    catch { alert("Failed to update status"); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
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
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>User Management</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>Manage all users across the platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total",   value: users.length,                                icon: Users,       color: "rgba(59,130,246,0.1)",  text: "#3b82f6" },
          { label: "Hosts",   value: users.filter(u => u.role === "host").length,   icon: UserCheck,   color: "rgba(16,185,129,0.1)",  text: "#10b981" },
          { label: "Clients", value: users.filter(u => u.role === "client").length, icon: User,        color: "rgba(139,92,246,0.1)",  text: "#8b5cf6" },
          { label: "Admins",  value: users.filter(u => u.role === "admin").length,  icon: ShieldCheck, color: "rgba(239,68,68,0.1)",   text: "#ef4444" },
        ].map(({ label, value, icon: Icon, color, text }) => (
          <div key={label} className="rounded-2xl p-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium" style={{ color: "var(--text2)" }}>{label}</p>
              <div className="p-1.5 rounded-xl" style={{ background: color }}>
                <Icon size={13} style={{ color: text }} />
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-2xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text2)" }} />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadUsers()}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-sm focus:outline-none"
            style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
          >
            <option value="all">All Roles</option>
            {["admin","host","client","landlord","tenant"].map(r => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
          <button
            onClick={loadUsers}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition"
            style={{ background: "#ef4444" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#dc2626"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#ef4444"}
          >
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
                {["User", "Role", "Status", "Joined", "Actions"].map((h, i) => (
                  <th
                    key={h}
                    className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider ${i === 4 ? "text-right" : "text-left"}`}
                    style={{ color: "var(--text2)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((user, idx) => (
                <tr
                  key={user._id}
                  style={{ borderBottom: idx < filtered.length - 1 ? "1px solid var(--border)" : "none" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = ""}
                >
                  {/* User */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background: "var(--bg)", color: "var(--text2)" }}
                      >
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-medium text-sm" style={{ color: "var(--text)" }}>{user.name}</p>
                        <p className="text-xs" style={{ color: "var(--text2)" }}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  {/* Role */}
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${ROLE_STYLE[user.role] || ROLE_STYLE.client}`}>
                      {user.role}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-5 py-3.5">
                    {user.isActive !== false ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                        <CheckCircle size={12} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500">
                        <XCircle size={12} /> Inactive
                      </span>
                    )}
                  </td>
                  {/* Joined */}
                  <td className="px-5 py-3.5 text-xs" style={{ color: "var(--text2)" }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggle(user._id, user.isActive !== false)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                        style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--text2)"}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                      >
                        {user.isActive !== false ? "Suspend" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                        style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-sm" style={{ color: "var(--text2)" }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}