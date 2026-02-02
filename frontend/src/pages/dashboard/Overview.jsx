import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/dashboardService";
import {
  Building2,
  Home,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  ArrowUpRight,
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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 font-medium">Failed to load dashboard</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const { totals, revenueMonthly } = stats;
  const occupancyRate = totals.totalUnits > 0 
    ? Math.round((totals.occupiedUnits / totals.totalUnits) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* WELCOME HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
            <p className="text-blue-100">Here's what's happening with your properties today</p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
            <Calendar size={20} />
            <span className="font-medium">{new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Properties */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Building2 className="text-blue-600" size={24} />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <TrendingUp size={16} />
              <span>Active</span>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total Properties</h3>
          <p className="text-3xl font-bold text-gray-900">{totals.totalProperties}</p>
        </div>

        {/* Total Units */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Home className="text-purple-600" size={24} />
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-sm font-medium">
              {occupancyRate}% full
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total Units</h3>
          <p className="text-3xl font-bold text-gray-900">{totals.totalUnits}</p>
        </div>

        {/* Occupied Units */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <ArrowUpRight size={16} />
              <span>{occupancyRate}%</span>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Occupied Units</h3>
          <p className="text-3xl font-bold text-gray-900">{totals.occupiedUnits}</p>
          <p className="text-xs text-gray-500 mt-2">
            {totals.emptyUnits} vacant unit{totals.emptyUnits !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-sm text-white hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <DollarSign className="text-white" size={24} />
            </div>
            <div className="flex items-center gap-1 text-green-100 text-sm font-medium">
              <TrendingUp size={16} />
              <span>Monthly</span>
            </div>
          </div>
          <h3 className="text-green-100 text-sm font-medium mb-1">Total Revenue</h3>
          <p className="text-3xl font-bold">${totals.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-green-100 mt-2">
            From {totals.occupiedUnits} occupied unit{totals.occupiedUnits !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* QUICK STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900">{occupancyRate}%</p>
            </div>
            <div className="relative w-16 h-16">
              <svg className="transform -rotate-90 w-16 h-16">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${occupancyRate * 1.76} 176`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Tenants</p>
              <p className="text-2xl font-bold text-gray-900">{totals.totalTenants || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <XCircle className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Vacant Units</p>
              <p className="text-2xl font-bold text-gray-900">{totals.emptyUnits}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
              <p className="text-sm text-gray-500 mt-1">Monthly revenue trends</p>
            </div>
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-lg">
              <ArrowUpRight size={16} />
              <span>Trending</span>
            </div>
          </div>
          <RevenueChart data={revenueMonthly} />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Occupancy Status</h3>
              <p className="text-sm text-gray-500 mt-1">Current unit distribution</p>
            </div>
            <div className="text-sm font-medium text-gray-600">
              {totals.totalUnits} total units
            </div>
          </div>
          <OccupancyChart
            occupied={totals.occupiedUnits}
            empty={totals.emptyUnits}
          />
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Tenants</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all →
          </button>
        </div>
        
        {stats.recent?.latestTenants && stats.recent.latestTenants.length > 0 ? (
          <div className="space-y-3">
            {stats.recent.latestTenants.map((tenant) => (
              <div 
                key={tenant._id} 
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {tenant.name?.charAt(0).toUpperCase() || 'T'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{tenant.name}</p>
                    <p className="text-sm text-gray-500">
                      {tenant.unit?.name || "Unit not assigned"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users size={48} className="mx-auto mb-3 text-gray-300" />
            <p>No recent tenants</p>
          </div>
        )}
      </div>
    </div>
  );
}
