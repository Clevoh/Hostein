import { useState, useEffect } from "react";
import {
  TrendingUp, TrendingDown, Users, Home,
  DollarSign, Calendar, Activity,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  getRevenueReport,
  getUserGrowthReport,
  getBookingStats,
  getPropertyStats,
} from "../../services/adminService";

export default function Reports() {
  const [stats, setStats] = useState({
    revenue:    { total: 0, thisMonth: 0, lastMonth: 0, growth: 0 },
    users:      { total: 0, newThisMonth: 0, activeUsers: 0 },
    bookings:   { total: 0, thisMonth: 0, completedRate: 0 },
    properties: { total: 0, active: 0, occupancyRate: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");

  useEffect(() => { loadReports(); }, [period]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const [revenue, users, bookings, properties] = await Promise.all([
        getRevenueReport(),
        getUserGrowthReport(period),
        getBookingStats(period),
        getPropertyStats(),
      ]);
      setStats({
        revenue:    revenue    || stats.revenue,
        users:      users      || stats.users,
        bookings:   bookings   || stats.bookings,
        properties: properties || stats.properties,
      });
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-10 h-10 rounded-full border-2 animate-spin"
        style={{ borderColor: "var(--border)", borderTopColor: "#ef4444" }} />
    </div>
  );

  const { revenue, users, bookings, properties } = stats;
  const engagementPct = users.total > 0
    ? Math.round((users.activeUsers / users.total) * 100)
    : 0;

  return (
    <div className="space-y-6 pb-8 max-w-7xl">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
            Reports & Analytics
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>
            Platform performance insights
          </p>
        </div>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm focus:outline-none self-start sm:self-auto"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* ── KEY METRIC CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-xl">
              <DollarSign size={22} />
            </div>
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
              revenue.growth >= 0 ? "bg-green-700/60" : "bg-red-700/60"
            }`}>
              {revenue.growth >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(revenue.growth)}%
            </div>
          </div>
          <p className="text-green-100 text-xs font-medium mb-1">Total Revenue</p>
          <h3 className="text-3xl font-bold">${revenue.total.toLocaleString()}</h3>
          <p className="text-green-200/70 text-xs mt-2">
            +${(revenue.thisMonth - revenue.lastMonth).toLocaleString()} this period
          </p>
        </div>

        {/* Users */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-xl">
              <Users size={22} />
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-700/60">Active</span>
          </div>
          <p className="text-blue-100 text-xs font-medium mb-1">Total Users</p>
          <h3 className="text-3xl font-bold">{users.total.toLocaleString()}</h3>
          <p className="text-blue-200/70 text-xs mt-2">+{users.newThisMonth} new this period</p>
        </div>

        {/* Bookings */}
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-xl">
              <Calendar size={22} />
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-700/60">
              {bookings.completedRate}%
            </span>
          </div>
          <p className="text-purple-100 text-xs font-medium mb-1">Total Bookings</p>
          <h3 className="text-3xl font-bold">{bookings.total.toLocaleString()}</h3>
          <p className="text-purple-200/70 text-xs mt-2">{bookings.thisMonth} this period</p>
        </div>

        {/* Properties */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-xl">
              <Home size={22} />
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-700/60">
              {properties.occupancyRate}%
            </span>
          </div>
          <p className="text-orange-100 text-xs font-medium mb-1">Active Properties</p>
          <h3 className="text-3xl font-bold">{properties.active}</h3>
          <p className="text-orange-200/70 text-xs mt-2">of {properties.total} total</p>
        </div>
      </div>

      {/* ── DETAILED BREAKDOWN ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Revenue Breakdown */}
        <div className="rounded-2xl p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl" style={{ background: "rgba(16,185,129,0.1)" }}>
              <DollarSign size={18} style={{ color: "#10b981" }} />
            </div>
            <h2 className="font-semibold" style={{ color: "var(--text)" }}>Revenue Breakdown</h2>
          </div>

          <div className="space-y-3">
            {[
              { label: "This Month",   value: `$${revenue.thisMonth.toLocaleString()}`, icon: TrendingUp,  iconColor: "#10b981" },
              { label: "Last Month",   value: `$${revenue.lastMonth.toLocaleString()}`, icon: Activity,    iconColor: "var(--text2)" },
            ].map(({ label, value, icon: Icon, iconColor }) => (
              <div key={label} className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: "var(--bg)" }}>
                <div>
                  <p className="text-sm" style={{ color: "var(--text2)" }}>{label}</p>
                  <p className="text-xl font-bold mt-1" style={{ color: "var(--text)" }}>{value}</p>
                </div>
                <Icon size={22} style={{ color: iconColor }} />
              </div>
            ))}

            {/* Growth rate highlight */}
            <div className="flex items-center justify-between p-4 rounded-xl"
              style={{
                background: revenue.growth >= 0 ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
                border: `1px solid ${revenue.growth >= 0 ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
              }}>
              <div>
                <p className="text-sm font-medium" style={{ color: revenue.growth >= 0 ? "#10b981" : "#ef4444" }}>
                  Growth Rate
                </p>
                <p className="text-2xl font-bold mt-1" style={{ color: revenue.growth >= 0 ? "#10b981" : "#ef4444" }}>
                  {revenue.growth > 0 ? "+" : ""}{revenue.growth}%
                </p>
              </div>
              {revenue.growth >= 0
                ? <TrendingUp size={26} style={{ color: "#10b981" }} />
                : <TrendingDown size={26} style={{ color: "#ef4444" }} />
              }
            </div>
          </div>
        </div>

        {/* User Statistics */}
        <div className="rounded-2xl p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl" style={{ background: "rgba(59,130,246,0.1)" }}>
              <Users size={18} style={{ color: "#3b82f6" }} />
            </div>
            <h2 className="font-semibold" style={{ color: "var(--text)" }}>User Statistics</h2>
          </div>

          <div className="space-y-3">
            {/* Active users with ring */}
            <div className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: "var(--bg)" }}>
              <div>
                <p className="text-sm" style={{ color: "var(--text2)" }}>Active Users</p>
                <p className="text-xl font-bold mt-1" style={{ color: "var(--text)" }}>{users.activeUsers}</p>
              </div>
              <div className="w-14 h-14 relative flex-shrink-0">
                <svg className="w-14 h-14 -rotate-90">
                  <circle cx="28" cy="28" r="22" stroke="var(--border)" strokeWidth="5" fill="none" />
                  <circle cx="28" cy="28" r="22" stroke="#3b82f6" strokeWidth="5" fill="none"
                    strokeDasharray={`${(users.activeUsers / (users.total || 1)) * 138.2} 138.2`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold" style={{ color: "var(--text)" }}>{engagementPct}%</span>
                </div>
              </div>
            </div>

            {[
              { label: "New This Period", value: `+${users.newThisMonth}`, icon: ArrowUpRight, color: "#3b82f6" },
              { label: "Total Registered", value: users.total, icon: Users, color: "var(--text2)" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: "var(--bg)" }}>
                <div>
                  <p className="text-sm" style={{ color: "var(--text2)" }}>{label}</p>
                  <p className="text-xl font-bold mt-1" style={{ color: "var(--text)" }}>{value}</p>
                </div>
                <Icon size={22} style={{ color }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PERFORMANCE METRICS ── */}
      <div className="rounded-2xl p-6"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <h2 className="font-semibold mb-6" style={{ color: "var(--text)" }}>Performance Metrics</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              label:   "Booking Completion",
              pct:     bookings.completedRate,
              detail:  `${Math.round((bookings.total * bookings.completedRate) / 100)} of ${bookings.total} completed`,
              color:   "#8b5cf6",
              track:   "rgba(139,92,246,0.15)",
            },
            {
              label:   "Property Occupancy",
              pct:     properties.occupancyRate,
              detail:  `${properties.active} of ${properties.total} occupied`,
              color:   "#f97316",
              track:   "rgba(249,115,22,0.15)",
            },
            {
              label:   "User Engagement",
              pct:     engagementPct,
              detail:  `${users.activeUsers} of ${users.total} active`,
              color:   "#3b82f6",
              track:   "rgba(59,130,246,0.15)",
            },
          ].map(({ label, pct, detail, color, track }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium" style={{ color: "var(--text2)" }}>{label}</p>
                <span className="text-base font-bold" style={{ color }}>{pct}%</span>
              </div>
              {/* Track */}
              <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: track }}>
                <div
                  className="h-2.5 rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
              <p className="text-xs mt-2" style={{ color: "var(--text2)" }}>{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}