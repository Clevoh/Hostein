import { useEffect, useState } from "react";
import { Wrench, Calendar, DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";

export default function ServiceProviderDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/service-provider/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* WELCOME HEADER */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-green-100">Here's your service business overview</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Services */}
        <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <Wrench className="text-green-600" size={24} />
            </div>
            <span className="text-sm text-green-600 font-medium">Active</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total Services</h3>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalServices || 0}</p>
        </div>

        {/* Pending Bookings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-xl">
              <Clock className="text-orange-600" size={24} />
            </div>
            <span className="text-sm text-orange-600 font-medium">Pending</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Pending Bookings</h3>
          <p className="text-3xl font-bold text-gray-900">{stats?.pendingBookings || 0}</p>
        </div>

        {/* Completed Jobs */}
        <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <CheckCircle className="text-blue-600" size={24} />
            </div>
            <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
              <TrendingUp size={16} />
              <span>This month</span>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Completed Jobs</h3>
          <p className="text-3xl font-bold text-gray-900">{stats?.completedJobs || 0}</p>
        </div>

        {/* Total Earnings */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 shadow-sm text-white hover:shadow-md transition">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <DollarSign className="text-white" size={24} />
            </div>
            <div className="flex items-center gap-1 text-green-100 text-sm font-medium">
              <TrendingUp size={16} />
              <span>Monthly</span>
            </div>
          </div>
          <h3 className="text-green-100 text-sm font-medium mb-1">Total Earnings</h3>
          <p className="text-3xl font-bold">${stats?.totalEarnings?.toLocaleString() || 0}</p>
          <p className="text-xs text-green-100 mt-2">From {stats?.completedJobs || 0} completed jobs</p>
        </div>
      </div>

      {/* RECENT BOOKINGS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Requests */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pending Requests</h3>
            <span className="text-sm text-orange-600 font-medium bg-orange-50 px-3 py-1 rounded-full">
              {stats?.pendingBookings || 0} new
            </span>
          </div>

          {stats?.recentPendingBookings && stats.recentPendingBookings.length > 0 ? (
            <div className="space-y-3">
              {stats.recentPendingBookings.map((booking) => (
                <div key={booking._id} className="p-3 border rounded-lg hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{booking.service?.name}</p>
                      <p className="text-sm text-gray-500">{booking.client?.name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(booking.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No pending requests</p>
          )}
        </div>

        {/* Upcoming Jobs */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Jobs</h3>
            <Calendar size={20} className="text-gray-400" />
          </div>

          {stats?.upcomingJobs && stats.upcomingJobs.length > 0 ? (
            <div className="space-y-3">
              {stats.upcomingJobs.map((booking) => (
                <div key={booking._id} className="p-3 border rounded-lg hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{booking.service?.name}</p>
                      <p className="text-sm text-gray-500">{booking.client?.name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}
                      </p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Confirmed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No upcoming jobs</p>
          )}
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.href = "/service-provider/services"}
            className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition text-center"
          >
            <Wrench size={24} className="mx-auto mb-2 text-gray-400" />
            <p className="font-medium text-gray-700">Add New Service</p>
          </button>
          
          <button
            onClick={() => window.location.href = "/service-provider/bookings"}
            className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition text-center"
          >
            <Calendar size={24} className="mx-auto mb-2 text-gray-400" />
            <p className="font-medium text-gray-700">View All Bookings</p>
          </button>
          
          <button
            onClick={() => window.location.href = "/service-provider/earnings"}
            className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition text-center"
          >
            <DollarSign size={24} className="mx-auto mb-2 text-gray-400" />
            <p className="font-medium text-gray-700">Check Earnings</p>
          </button>
        </div>
      </div>
    </div>
  );
}
