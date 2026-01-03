import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/dashboardService";
import StatCard from "../../components/StatCard";

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Properties"
          value={stats.totals.totalProperties}
        />
        <StatCard
          title="Units"
          value={stats.totals.totalUnits}
        />
        <StatCard
          title="Occupied Units"
          value={stats.totals.occupiedUnits}
        />
        <StatCard
          title="Revenue"
          value={`$${stats.totals.totalRevenue}`}
        />
      </div>

      {/* RECENT TENANTS */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="font-semibold mb-4">Recent Tenants</h2>
        <ul className="space-y-2">
          {stats.recent.latestTenants.map((tenant) => (
            <li key={tenant._id} className="text-sm text-gray-700">
              {tenant.name} – {tenant.unit?.name || "Unassigned"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
