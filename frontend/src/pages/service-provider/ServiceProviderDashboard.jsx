import { useEffect, useState } from "react";
import { Wrench, Calendar, DollarSign, TrendingUp, Clock, CheckCircle, ArrowUpRight } from "lucide-react";

export default function ServiceProviderDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/service-provider/dashboard", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStats(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: "var(--border)", borderTopColor: "#10b981" }} />
        <p className="text-sm" style={{ color: "var(--text2)" }}>Loading…</p>
      </div>
    </div>
  );

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="space-y-5 pb-8">

      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 md:p-8 text-white shadow-lg"
        style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)" }}
      >
        <div className="pointer-events-none absolute -top-10 -right-10 w-52 h-52 rounded-full bg-emerald-400/15 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 w-40 h-40 rounded-full bg-green-300/10 blur-2xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-emerald-300 text-xs font-semibold uppercase tracking-widest mb-1">{today}</p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back! 👋</h1>
            <p className="text-emerald-200/70 text-sm mt-1">Here's your service business overview</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-white/80">Live</span>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Services",   value: stats?.totalServices   || 0, icon: Wrench,      bg: "bg-emerald-50", color: "text-emerald-600", badge: "Active" },
          { label: "Pending Bookings", value: stats?.pendingBookings || 0, icon: Clock,       bg: "bg-orange-50",  color: "text-orange-600",  badge: "Action needed" },
          { label: "Completed Jobs",   value: stats?.completedJobs   || 0, icon: CheckCircle, bg: "bg-blue-50",    color: "text-blue-600",    badge: "This month" },
        ].map(({ label, value, icon: Icon, bg, color, badge }) => (
          <div
            key={label}
            className="rounded-2xl p-4 md:p-5 border shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl ${bg}`}>
                <Icon size={17} className={color} />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text2)" }}>{badge}</span>
            </div>
            <p className="text-xs font-medium mb-0.5" style={{ color: "var(--text2)" }}>{label}</p>
            <p className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text)" }}>{value}</p>
          </div>
        ))}

        {/* Earnings card — gradient */}
        <div
          className="rounded-2xl p-4 md:p-5 shadow-sm text-white hover:shadow-md transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <DollarSign size={17} className="text-white" />
            </div>
            <div className="flex items-center gap-0.5 text-emerald-100 text-[10px] font-semibold uppercase tracking-wider">
              <TrendingUp size={12} /> Monthly
            </div>
          </div>
          <p className="text-xs font-medium text-emerald-100 mb-0.5">Total Earnings</p>
          <p className="text-2xl md:text-3xl font-bold">${stats?.totalEarnings?.toLocaleString() || 0}</p>
          <p className="text-xs text-emerald-200 mt-1">From {stats?.completedJobs || 0} jobs</p>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Pending Requests */}
        <div className="rounded-2xl border shadow-sm overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 className="font-semibold text-sm" style={{ color: "var(--text)" }}>Pending Requests</h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-600">
              {stats?.pendingBookings || 0} new
            </span>
          </div>

          {stats?.recentPendingBookings?.length > 0 ? (
            <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
              {stats.recentPendingBookings.map((b) => (
                <li
                  key={b._id}
                  className="flex items-start justify-between px-5 py-3.5 transition"
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--surface2)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Clock size={14} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{b.service?.name || "Service"}</p>
                      <p className="text-xs" style={{ color: "var(--text2)" }}>{b.client?.name} · {new Date(b.scheduledDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full flex-shrink-0 mt-1">
                    Pending
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock size={32} className="mb-3" style={{ color: "var(--text2)", opacity: 0.3 }} />
              <p className="text-sm" style={{ color: "var(--text2)" }}>No pending requests</p>
            </div>
          )}
        </div>

        {/* Upcoming Jobs */}
        <div className="rounded-2xl border shadow-sm overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 className="font-semibold text-sm" style={{ color: "var(--text)" }}>Upcoming Jobs</h3>
            <Calendar size={16} style={{ color: "var(--text2)" }} />
          </div>

          {stats?.upcomingJobs?.length > 0 ? (
            <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
              {stats.upcomingJobs.map((b) => (
                <li
                  key={b._id}
                  className="flex items-start justify-between px-5 py-3.5 transition"
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--surface2)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={14} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{b.service?.name || "Service"}</p>
                      <p className="text-xs" style={{ color: "var(--text2)" }}>
                        {b.client?.name} · {new Date(b.scheduledDate).toLocaleDateString()} at {b.scheduledTime}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex-shrink-0 mt-1">
                    Confirmed
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar size={32} className="mb-3" style={{ color: "var(--text2)", opacity: 0.3 }} />
              <p className="text-sm" style={{ color: "var(--text2)" }}>No upcoming jobs</p>
            </div>
          )}
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="rounded-2xl border shadow-sm overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h3 className="font-semibold text-sm" style={{ color: "var(--text)" }}>Quick Actions</h3>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { href: "/service-provider/services", icon: Wrench,     label: "Add New Service", sub: "Create a new listing",  bg: "bg-emerald-50", color: "text-emerald-600" },
            { href: "/service-provider/bookings", icon: Calendar,   label: "View Bookings",   sub: "Manage your requests", bg: "bg-blue-50",    color: "text-blue-600" },
            { href: "/service-provider/earnings", icon: DollarSign, label: "Check Earnings",  sub: "Review your income",   bg: "bg-violet-50",  color: "text-violet-600" },
          ].map(({ href, icon: Icon, label, sub, bg, color }) => (
            <button
              key={href}
              onClick={() => window.location.href = href}
              className="group flex items-center gap-3 p-4 rounded-xl text-left transition border-2 border-dashed hover:-translate-y-0.5"
              style={{ borderColor: "var(--border)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--text2)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              <div className={`p-2.5 rounded-xl ${bg} group-hover:scale-110 transition-transform`}>
                <Icon size={18} className={color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{label}</p>
                <p className="text-xs" style={{ color: "var(--text2)" }}>{sub}</p>
              </div>
              <ArrowUpRight size={14} style={{ color: "var(--text2)" }} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}