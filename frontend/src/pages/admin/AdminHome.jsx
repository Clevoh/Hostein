import { useState, useEffect } from "react";
import {
  Users, Home, DollarSign, Activity, TrendingUp,
  CheckCircle, Clock, AlertCircle, ArrowUpRight,
} from "lucide-react";
import { getAdminStats, getActivityLogs } from "../../services/adminService";

const ACTIVITY_ICON = {
  user:     { icon: Users,        color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  property: { icon: Home,         color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  booking:  { icon: CheckCircle,  color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
  default:  { icon: Activity,     color: "#6b7280", bg: "rgba(107,114,128,0.1)" },
};

export default function AdminHome() {
  const [stats, setStats] = useState({
    totalUsers: 0, totalHosts: 0, totalClients: 0,
    totalProperties: 0, activeProperties: 0,
    totalBookings: 0, monthlyRevenue: 0, revenueGrowth: 0,
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [statsData, activityData] = await Promise.all([
        getAdminStats(),
        getActivityLogs(8),
      ]);
      setStats(statsData);
      setActivities(activityData);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: "var(--border)", borderTopColor: "#ef4444" }} />
        <p className="text-sm" style={{ color: "var(--text2)" }}>Loading dashboard…</p>
      </div>
    </div>
  );

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const CARDS = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      sub: `${stats.totalHosts} hosts · ${stats.totalClients} clients`,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      label: "Properties",
      value: stats.totalProperties,
      sub: `${stats.activeProperties} active`,
      icon: Home,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      sub: "All time",
      icon: Activity,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      label: "Monthly Revenue",
      value: `$${(stats.monthlyRevenue || 0).toLocaleString()}`,
      sub: `${stats.revenueGrowth >= 0 ? "+" : ""}${stats.revenueGrowth}% from last month`,
      icon: DollarSign,
      gradient: "from-rose-500 to-red-600",
      badge: stats.revenueGrowth >= 0 ? "↑" : "↓",
    },
  ];

  return (
    <div className="space-y-5 pb-8">

      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 md:p-8 text-white shadow-lg"
        style={{ background: "linear-gradient(135deg, #1a0505 0%, #3b0000 50%, #7f1d1d 100%)" }}
      >
        <div className="pointer-events-none absolute -top-10 -right-10 w-52 h-52 rounded-full blur-2xl"
          style={{ background: "rgba(239,68,68,0.15)" }} />
        <div className="pointer-events-none absolute bottom-0 left-1/4 w-40 h-40 rounded-full blur-2xl"
          style={{ background: "rgba(239,68,68,0.08)" }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-red-300 text-xs font-semibold uppercase tracking-widest mb-1">{today}</p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Overview</h1>
            <p className="text-red-300/60 text-sm mt-1">Monitor users, properties, and platform activity</p>
          </div>
          <div className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            System Active
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {CARDS.map(({ label, value, sub, icon: Icon, gradient, badge }) => (
          <div
            key={label}
            className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-4 md:p-5 text-white shadow-sm overflow-hidden`}
          >
            <div className="pointer-events-none absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Icon size={17} className="text-white" />
              </div>
              {badge
                ? <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">{badge}</span>
                : <TrendingUp size={14} className="opacity-50" />
              }
            </div>
            <p className="text-white/70 text-xs font-medium mb-0.5">{label}</p>
            <p className="text-2xl md:text-3xl font-bold">{value}</p>
            <p className="text-white/50 text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── QUICK METRICS ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Hosts",        value: stats.totalHosts,       color: "#3b82f6" },
          { label: "Clients",      value: stats.totalClients,     color: "#10b981" },
          { label: "Active Props", value: stats.activeProperties, color: "#f59e0b" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl p-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--text2)" }}>{label}</p>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── RECENT ACTIVITY ── */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 className="font-semibold text-sm" style={{ color: "var(--text)" }}>Recent Activity</h2>
          <button className="text-xs font-medium text-red-500 hover:text-red-600 transition">View all →</button>
        </div>

        {activities.length > 0 ? (
          <ul>
            {activities.map((activity, i) => {
              const type = activity.type || "default";
              const meta = ACTIVITY_ICON[type] || ACTIVITY_ICON.default;
              const Icon = meta.icon;
              return (
                <li key={i} className="flex items-start gap-3 px-5 py-3.5"
                  style={{ borderBottom: i < activities.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div className="p-1.5 rounded-xl flex-shrink-0 mt-0.5"
                    style={{ background: meta.bg }}>
                    <Icon size={13} style={{ color: meta.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm" style={{ color: "var(--text)" }}>{activity.description}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Activity size={28} className="mb-2" style={{ color: "var(--text2)", opacity: 0.3 }} />
            <p className="text-sm" style={{ color: "var(--text2)" }}>No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
}