import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/dashboardService";
import {
  Building2,
  Home,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import RevenueChart from "../../components/charts/RevenueChart";
import OccupancyChart from "../../components/charts/OccupancyChart";

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getDashboardStats();

      if (!data || !data.totals) {
        throw new Error("Invalid dashboard data structure");
      }

      setStats(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          </div>

          <p
            className="font-medium text-sm tracking-wide"
            style={{ color: "var(--text2)" }}
          >
            Loading your dashboard…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div
          className="rounded-2xl p-8 text-center max-w-sm w-full shadow-sm border border-red-100"
          style={{ background: "var(--surface)" }}
        >
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-500" size={28} />
          </div>

          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: "var(--text)" }}
          >
            Something went wrong
          </h3>

          <p
            className="text-sm mb-6"
            style={{ color: "var(--text2)" }}
          >
            {error}
          </p>

          <button
            onClick={loadDashboard}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-slate-700 transition-colors"
          >
            <RefreshCw size={14} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!stats?.totals) return null;

  const { totals, revenueMonthly = [] } = stats;

  const totalProperties = totals.totalProperties || 0;
  const totalUnits = totals.totalUnits || 0;
  const occupiedUnits = totals.occupiedUnits || 0;
  const emptyUnits = totals.emptyUnits || 0;
  const totalRevenue = totals.totalRevenue || 0;
  const totalTenants = totals.totalTenants || 0;

  const occupancyRate =
    totalUnits > 0
      ? Math.round((occupiedUnits / totalUnits) * 100)
      : 0;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-5 pb-8">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-6 md:p-8 text-white shadow-lg">
        <div className="pointer-events-none absolute -top-10 -right-10 w-52 h-52 rounded-full bg-blue-600/20 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 w-40 h-40 rounded-full bg-indigo-600/20 blur-2xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-blue-300 text-sm font-medium mb-1">
              {today}
            </p>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome back! 👋
            </h1>

            <p className="text-slate-400 text-sm mt-1">
              Here's what's happening with your properties
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-xl self-start sm:self-auto">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

            <span className="text-sm font-medium text-slate-200">
              Live data
            </span>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Properties */}
        <div
          className="group rounded-2xl p-4 md:p-5 border shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Building2 className="text-blue-600" size={18} />
            </div>

            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>

          <p
            className="text-xs font-medium mb-0.5"
            style={{ color: "var(--text2)" }}
          >
            Properties
          </p>

          <p
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "var(--text)" }}
          >
            {totalProperties}
          </p>
        </div>

        {/* Units */}
        <div
          className="group rounded-2xl p-4 md:p-5 border shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-violet-50 rounded-xl">
              <Home className="text-violet-600" size={18} />
            </div>

            <span
              className="text-xs font-medium"
              style={{ color: "var(--text2)" }}
            >
              {occupancyRate}% full
            </span>
          </div>

          <p
            className="text-xs font-medium mb-0.5"
            style={{ color: "var(--text2)" }}
          >
            Total Units
          </p>

          <p
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "var(--text)" }}
          >
            {totalUnits}
          </p>
        </div>

        {/* Occupied */}
        <div
          className="group rounded-2xl p-4 md:p-5 border shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <CheckCircle className="text-emerald-600" size={18} />
            </div>

            <div className="flex items-center gap-0.5 text-xs font-medium text-emerald-600">
              <ArrowUpRight size={12} />
              {occupancyRate}%
            </div>
          </div>

          <p
            className="text-xs font-medium mb-0.5"
            style={{ color: "var(--text2)" }}
          >
            Occupied
          </p>

          <p
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "var(--text)" }}
          >
            {occupiedUnits}
          </p>

          <p
            className="text-xs mt-1"
            style={{ color: "var(--text2)" }}
          >
            {emptyUnits} vacant
          </p>
        </div>

        {/* Revenue */}
        <div className="group bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <DollarSign className="text-white" size={18} />
            </div>

            <div className="flex items-center gap-0.5 text-xs font-medium text-emerald-100">
              <TrendingUp size={12} />
              Monthly
            </div>
          </div>

          <p className="text-xs text-emerald-100 font-medium mb-0.5">
            Revenue
          </p>

          <p className="text-2xl md:text-3xl font-bold text-white">
            ${totalRevenue.toLocaleString()}
          </p>

          <p className="text-xs text-emerald-200 mt-1">
            {occupiedUnits} paying units
          </p>
        </div>
      </div>

      {/* QUICK METRICS */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {/* Occupancy */}
        <div
          className="col-span-1 rounded-2xl p-4 border shadow-sm flex flex-col items-center justify-center gap-2"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#f1f5f9"
                strokeWidth="8"
                fill="none"
              />

              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#10b981"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${occupancyRate * 1.633} 163.3`}
                strokeLinecap="round"
              />
            </svg>

            <span
              className="absolute inset-0 flex items-center justify-center text-sm font-bold"
              style={{ color: "var(--text)" }}
            >
              {occupancyRate}%
            </span>
          </div>

          <p
            className="text-xs font-medium text-center"
            style={{ color: "var(--text2)" }}
          >
            Occupancy
          </p>
        </div>

        {/* Tenants */}
        <div
          className="rounded-2xl p-4 border shadow-sm flex flex-col justify-center gap-1"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="p-2 bg-blue-50 rounded-xl w-fit mb-1">
            <Users className="text-blue-600" size={16} />
          </div>

          <p
            className="text-xs font-medium"
            style={{ color: "var(--text2)" }}
          >
            Active Tenants
          </p>

          <p
            className="text-2xl font-bold"
            style={{ color: "var(--text)" }}
          >
            {totalTenants}
          </p>
        </div>

        {/* Vacant */}
        <div
          className="rounded-2xl p-4 border shadow-sm flex flex-col justify-center gap-1"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="p-2 bg-orange-50 rounded-xl w-fit mb-1">
            <XCircle className="text-orange-500" size={16} />
          </div>

          <p
            className="text-xs font-medium"
            style={{ color: "var(--text2)" }}
          >
            Vacant Units
          </p>

          <p
            className="text-2xl font-bold"
            style={{ color: "var(--text)" }}
          >
            {emptyUnits}
          </p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div
          className="rounded-2xl p-5 md:p-6 border shadow-sm"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3
                className="font-semibold"
                style={{ color: "var(--text)" }}
              >
                Revenue Overview
              </h3>

              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--text2)" }}
              >
                Monthly revenue trends
              </p>
            </div>

            <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium bg-emerald-50 px-2.5 py-1 rounded-lg">
              <ArrowUpRight size={12} />
              Trending
            </div>
          </div>

          <div style={{ minHeight: 220, width: "100%" }}>
            <RevenueChart data={revenueMonthly} />
          </div>
        </div>

        <div
          className="rounded-2xl p-5 md:p-6 border shadow-sm"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3
                className="font-semibold"
                style={{ color: "var(--text)" }}
              >
                Occupancy Status
              </h3>

              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--text2)" }}
              >
                Current unit distribution
              </p>
            </div>

            <span
              className="text-xs font-medium"
              style={{ color: "var(--text2)" }}
            >
              {totalUnits} total units
            </span>
          </div>

          <div style={{ minHeight: 220, width: "100%" }}>
            <OccupancyChart
              occupied={occupiedUnits}
              empty={emptyUnits}
            />
          </div>
        </div>
      </div>

      {/* RECENT TENANTS */}
      <div
        className="rounded-2xl border shadow-sm overflow-hidden"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="flex items-center justify-between px-5 md:px-6 py-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <h3
            className="font-semibold"
            style={{ color: "var(--text)" }}
          >
            Recent Tenants
          </h3>

          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">
            View all →
          </button>
        </div>

        {stats.recent?.latestTenants?.length > 0 ? (
          <ul className="divide-y divide-slate-50">
            {stats.recent.latestTenants.map((tenant) => (
              <li
                key={tenant._id}
                className="flex items-center gap-3 px-5 md:px-6 py-3.5 hover:bg-slate-50 transition-colors"
              >
                <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                  {tenant.name?.charAt(0).toUpperCase() || "T"}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className="font-medium text-sm truncate"
                    style={{ color: "var(--text)" }}
                  >
                    {tenant.name}
                  </p>

                  <p
                    className="text-xs truncate"
                    style={{ color: "var(--text2)" }}
                  >
                    {tenant.unit?.unitNumber
                      ? `Unit ${tenant.unit.unitNumber}`
                      : "Unit not assigned"}
                  </p>
                </div>

                <span className="flex-shrink-0 text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                  Active
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-12"
            style={{ color: "var(--text2)" }}
          >
            <Users
              size={40}
              className="mb-3 text-slate-200"
            />

            <p className="text-sm">No recent tenants</p>
          </div>
        )}
      </div>
    </div>
  );
}