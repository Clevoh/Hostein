import { useState, useEffect } from "react";
import { Users, Home, DollarSign, TrendingUp, Activity } from "lucide-react";
import { getAdminStats, getActivityLogs } from "../../services/adminService";

export default function AdminHome() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHosts: 0,
    totalClients: 0,
    totalProperties: 0,
    activeProperties: 0,
    totalBookings: 0,
    monthlyRevenue: 0,
    revenueGrowth: 0,
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [statsData, activityData] = await Promise.all([
        getAdminStats(),
        getActivityLogs(10)
      ]);
      setStats(statsData);
      setActivities(activityData);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-500",
      subtext: `${stats.totalHosts} Hosts • ${stats.totalClients} Clients`,
    },
    {
      title: "Properties",
      value: stats.totalProperties,
      icon: Home,
      color: "bg-green-500",
      subtext: `${stats.activeProperties} Active`,
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Activity,
      color: "bg-purple-500",
      subtext: "All time",
    },
    {
      title: "Monthly Revenue",
      value: `$${stats.monthlyRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "bg-orange-500",
      subtext: `${stats.revenueGrowth > 0 ? '+' : ''}${stats.revenueGrowth}% from last month`,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Monitor users, hosts, properties, and system activity
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</h3>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-500">{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <button className="text-sm text-red-600 hover:underline">View All</button>
        </div>

        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 pb-3 border-b last:border-0"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        )}
      </div>
    </div>
  );
}
