import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Users, Home, DollarSign, Calendar, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  getRevenueReport,
  getUserGrowthReport,
  getBookingStats,
  getPropertyStats,
} from "../../services/adminService";

export default function Reports() {
  const [stats, setStats] = useState({
    revenue: {
      total: 0,
      thisMonth: 0,
      lastMonth: 0,
      growth: 0,
    },
    users: {
      total: 0,
      newThisMonth: 0,
      activeUsers: 0,
    },
    bookings: {
      total: 0,
      thisMonth: 0,
      completedRate: 0,
    },
    properties: {
      total: 0,
      active: 0,
      occupancyRate: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    loadReports();
  }, [period]);

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
        revenue: revenue || stats.revenue,
        users: users || stats.users,
        bookings: bookings || stats.bookings,
        properties: properties || stats.properties,
      });
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Platform performance insights</p>
        </div>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* KEY METRICS - 4 CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* REVENUE CARD */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <DollarSign size={32} className="opacity-80" />
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              stats.revenue.growth >= 0 ? 'bg-green-700' : 'bg-red-700'
            }`}>
              {stats.revenue.growth >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(stats.revenue.growth)}%
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Total Revenue</p>
          <h3 className="text-3xl font-bold">${stats.revenue.total.toLocaleString()}</h3>
          <p className="text-xs opacity-75 mt-2">
            +${(stats.revenue.thisMonth - stats.revenue.lastMonth).toLocaleString()} this period
          </p>
        </div>

        {/* USERS CARD */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Users size={32} className="opacity-80" />
            <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-700">
              Active
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Total Users</p>
          <h3 className="text-3xl font-bold">{stats.users.total.toLocaleString()}</h3>
          <p className="text-xs opacity-75 mt-2">
            +{stats.users.newThisMonth} new this period
          </p>
        </div>

        {/* BOOKINGS CARD */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Calendar size={32} className="opacity-80" />
            <div className="px-2 py-1 rounded-full text-xs font-medium bg-purple-700">
              {stats.bookings.completedRate}%
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Total Bookings</p>
          <h3 className="text-3xl font-bold">{stats.bookings.total.toLocaleString()}</h3>
          <p className="text-xs opacity-75 mt-2">
            {stats.bookings.thisMonth} this period
          </p>
        </div>

        {/* PROPERTIES CARD */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Home size={32} className="opacity-80" />
            <div className="px-2 py-1 rounded-full text-xs font-medium bg-orange-700">
              {stats.properties.occupancyRate}%
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Active Properties</p>
          <h3 className="text-3xl font-bold">{stats.properties.active}</h3>
          <p className="text-xs opacity-75 mt-2">
            of {stats.properties.total} total
          </p>
        </div>
      </div>

      {/* DETAILED BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* REVENUE BREAKDOWN */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Revenue Breakdown</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  ${stats.revenue.thisMonth.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="text-green-600" size={24} />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Last Month</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  ${stats.revenue.lastMonth.toLocaleString()}
                </p>
              </div>
              <Activity className="text-gray-600" size={24} />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <div>
                <p className="text-sm text-green-700 font-medium">Growth Rate</p>
                <p className="text-2xl font-bold text-green-700 mt-1">
                  {stats.revenue.growth > 0 ? '+' : ''}{stats.revenue.growth}%
                </p>
              </div>
              {stats.revenue.growth >= 0 ? (
                <TrendingUp className="text-green-600" size={28} />
              ) : (
                <TrendingDown className="text-red-600" size={28} />
              )}
            </div>
          </div>
        </div>

        {/* USER STATISTICS */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">User Statistics</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">Active Users</p>
                <p className="text-xl font-bold text-gray-900">{stats.users.activeUsers}</p>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="transform -rotate-90 w-16 h-16">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#E5E7EB"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#3B82F6"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${(stats.users.activeUsers / stats.users.total) * 175.93} 175.93`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-700">
                    {Math.round((stats.users.activeUsers / stats.users.total) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">New This Period</p>
                <p className="text-xl font-bold text-gray-900 mt-1">+{stats.users.newThisMonth}</p>
              </div>
              <ArrowUpRight className="text-blue-600" size={24} />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total Registered</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{stats.users.total}</p>
              </div>
              <Users className="text-gray-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* PERFORMANCE METRICS */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* BOOKING COMPLETION */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Booking Completion</p>
              <span className="text-lg font-bold text-purple-600">{stats.bookings.completedRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.bookings.completedRate}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {Math.round((stats.bookings.total * stats.bookings.completedRate) / 100)} of {stats.bookings.total} completed
            </p>
          </div>

          {/* PROPERTY OCCUPANCY */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Property Occupancy</p>
              <span className="text-lg font-bold text-orange-600">{stats.properties.occupancyRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.properties.occupancyRate}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.properties.active} of {stats.properties.total} occupied
            </p>
          </div>

          {/* USER ENGAGEMENT */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">User Engagement</p>
              <span className="text-lg font-bold text-blue-600">
                {Math.round((stats.users.activeUsers / stats.users.total) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(stats.users.activeUsers / stats.users.total) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.users.activeUsers} of {stats.users.total} active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
