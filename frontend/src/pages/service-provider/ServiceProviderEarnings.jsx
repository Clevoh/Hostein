import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";

export default function ServiceProviderEarnings() {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/service-provider/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setEarnings(data);
    } catch (error) {
      console.error("Failed to load earnings:", error);
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
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Earnings</h2>
        <p className="text-gray-500 mt-1">Track your income and completed jobs</p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <DollarSign size={24} />
            </div>
            <TrendingUp size={20} className="text-green-100" />
          </div>
          <p className="text-green-100 text-sm font-medium mb-1">Total Earnings</p>
          <p className="text-3xl font-bold">${earnings?.totalEarnings?.toLocaleString() || 0}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Calendar size={24} className="text-blue-600" />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Completed Jobs</p>
          <p className="text-3xl font-bold text-gray-900">{earnings?.completedJobs || 0}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <DollarSign size={24} className="text-purple-600" />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Avg. Job Value</p>
          <p className="text-3xl font-bold text-gray-900">
            ${earnings?.completedJobs > 0 
              ? Math.round(earnings.totalEarnings / earnings.completedJobs) 
              : 0}
          </p>
        </div>
      </div>

      {/* EARNINGS BREAKDOWN */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Breakdown</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">This Month</span>
            <span className="font-semibold text-gray-900">${earnings?.totalEarnings?.toLocaleString() || 0}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Pending Payments</span>
            <span className="font-semibold text-orange-600">$0</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Total Paid Out</span>
            <span className="font-semibold text-green-600">${earnings?.totalEarnings?.toLocaleString() || 0}</span>
          </div>
        </div>
      </div>

      {/* INFO BOX */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Payment Information:</strong> Earnings are calculated from completed jobs. 
          Contact support for payout options and schedules.
        </p>
      </div>
    </div>
  );
}
