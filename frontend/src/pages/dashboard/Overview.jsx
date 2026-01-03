import { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import { getDashboardStats } from "../../services/dashboardService";
import {
  Building2,
  Home,
  Users,
  DollarSign,
} from "lucide-react";

import RevenueChart from "../../components/charts/RevenueChart";
import OccupancyChart from "../../components/charts/OccupancyChart";

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-600">Loading dashboard...</p>;
  }

  if (!stats) {
    return <p className="text-red-600">Failed to load dashboard</p>;
  }

  const { totals, revenueMonthly } = stats;

  return (
    <div className="space-y-8">
      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Properties"
          value={totals.totalProperties}
          icon={Building2}
        />

        <StatCard
          title="Units"
          value={totals.totalUnits}
          icon={Home}
        />

        <StatCard
          title="Occupied Units"
          value={totals.occupiedUnits}
          icon={Users}
        />

        <StatCard
          title="Total Revenue"
          value={`$${totals.totalRevenue}`}
          icon={DollarSign}
        />
      </div>

      {/* ================= QUICK INSIGHTS ================= */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="font-semibold mb-4">Quick Insights</h2>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>Empty Units: {totals.emptyUnits}</li>
          <li>Active Tenants: {totals.totalTenants}</li>
        </ul>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RevenueChart data={revenueMonthly} />

        <OccupancyChart
          occupied={totals.occupiedUnits}
          empty={totals.emptyUnits}
        />
      </div>
    </div>
  );
}
