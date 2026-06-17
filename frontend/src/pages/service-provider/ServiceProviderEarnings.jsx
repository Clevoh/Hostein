// src/pages/service-provider/ServiceProviderEarnings.jsx
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
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/service-provider/dashboard", {
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
      <div>
        <h2 style={{ color: "var(--text)" }} className="text-3xl font-bold">Earnings</h2>
        <p style={{ color: "var(--text2)" }} className="mt-1">Track your income and completed jobs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Earnings — gradient card */}
        <div
          className="rounded-xl p-6 shadow-sm text-white"
          style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <DollarSign size={24} className="text-white" />
            </div>
            <TrendingUp size={20} className="text-emerald-100" />
          </div>
          <p className="text-emerald-100 text-sm font-medium mb-1">Total Earnings</p>
          <p className="text-3xl font-bold">
            ${earnings?.totalEarnings?.toLocaleString() || 0}
          </p>
        </div>

        {/* Completed Jobs */}
        <div
          className="rounded-xl p-6 shadow-sm border"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Calendar size={24} className="text-blue-600" />
            </div>
          </div>
          <p style={{ color: "var(--text2)" }} className="text-sm font-medium mb-1">Completed Jobs</p>
          <p style={{ color: "var(--text)" }} className="text-3xl font-bold">
            {earnings?.completedJobs || 0}
          </p>
        </div>

        {/* Avg Job Value */}
        <div
          className="rounded-xl p-6 shadow-sm border"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <DollarSign size={24} className="text-purple-600" />
            </div>
          </div>
          <p style={{ color: "var(--text2)" }} className="text-sm font-medium mb-1">Avg. Job Value</p>
          <p style={{ color: "var(--text)" }} className="text-3xl font-bold">
            ${earnings?.completedJobs > 0
              ? Math.round(earnings.totalEarnings / earnings.completedJobs)
              : 0}
          </p>
        </div>
      </div>

      <div
        className="rounded-xl p-6 shadow-sm border"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <h3 style={{ color: "var(--text)" }} className="text-lg font-semibold mb-4">Earnings Breakdown</h3>
        <div className="space-y-3">
          {[
            { label: "This Month",        value: `$${earnings?.totalEarnings?.toLocaleString() || 0}`, valueClass: "" },
            { label: "Pending Payments",  value: "$0",                                                  valueClass: "text-orange-600" },
            { label: "Total Paid Out",    value: `$${earnings?.totalEarnings?.toLocaleString() || 0}`,  valueClass: "text-green-600" },
          ].map(({ label, value, valueClass }) => (
            <div
              key={label}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ background: "var(--bg)" }}
            >
              <span style={{ color: "var(--text2)" }}>{label}</span>
              <span
                className={`font-semibold ${valueClass}`}
                style={!valueClass ? { color: "var(--text)" } : {}}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-xl p-4 border"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <p className="text-sm" style={{ color: "var(--text2)" }}>
          💡 <strong style={{ color: "var(--text)" }}>Payment Information:</strong>{" "}
          Earnings are calculated from completed jobs. Contact support for payout options and schedules.
        </p>
      </div>
    </div>
  );
}