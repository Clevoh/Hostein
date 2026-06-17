import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home, Calendar, Bell, MapPin, Clock,
  DollarSign, Star, ChevronRight, CheckCircle,
  AlertCircle, TrendingUp, Wrench, ArrowUpRight,
} from "lucide-react";

export default function ClientDashboardHome() {
  const [stats] = useState({
    totalBookings: 3,
    upcomingStays: 1,
    activeServices: 2,
    notifications: 5,
  });

  const [recentActivities] = useState([
    {
      id: 1,
      title: "Booking Confirmed",
      description: "Luxury Apartment - Downtown",
      date: "2 hours ago",
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      id: 2,
      title: "Maintenance Scheduled",
      description: "AC repair - Jan 15, 2026",
      date: "1 day ago",
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      id: 3,
      title: "Payment Due",
      description: "Monthly rent payment",
      date: "3 days ago",
      icon: AlertCircle,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ]);

  const [upcomingBookings] = useState([
    {
      id: 1,
      property: "Modern Studio Apartment",
      location: "Downtown, City Center",
      checkIn: "Feb 15, 2026",
      checkOut: "Feb 20, 2026",
      amount: 850,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
    },
  ]);

  const [recommendedProperties] = useState([
    {
      id: 1,
      name: "Cozy Beach House",
      location: "Coastal Area",
      price: 1200,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=400",
    },
    {
      id: 2,
      name: "Urban Loft",
      location: "City Center",
      price: 950,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
    },
  ]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div className="space-y-5 pb-8 max-w-7xl">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-6 md:p-8 text-white shadow-lg">
        <div className="pointer-events-none absolute -top-10 -right-10 w-52 h-52 rounded-full bg-blue-600/20 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 w-40 h-40 rounded-full bg-indigo-600/15 blur-2xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-1">{today}</p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back! 👋</h1>
            <p className="text-slate-400 text-sm mt-1">Here's what's happening with your account today</p>
          </div>
          <Link
            to="/rentals"
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white rounded-xl font-medium text-sm transition"
          >
            <Home size={16} />
            Find a Home
          </Link>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Bookings",   value: stats.totalBookings,  icon: Calendar,     gradient: "from-blue-500 to-blue-600",    sub: "All time" },
          { label: "Upcoming Stays",   value: stats.upcomingStays,  icon: Clock,        gradient: "from-emerald-500 to-teal-600", sub: "Scheduled" },
          { label: "Active Services",  value: stats.activeServices, icon: Wrench,       gradient: "from-violet-500 to-violet-600",sub: "Ongoing" },
          { label: "Notifications",    value: stats.notifications,  icon: Bell,         gradient: "from-orange-500 to-amber-500", sub: "Unread", badge: true },
        ].map(({ label, value, icon: Icon, gradient, sub, badge }) => (
          <div key={label} className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-4 md:p-5 text-white shadow-sm overflow-hidden`}>
            <div className="pointer-events-none absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Icon size={17} className="text-white" />
              </div>
              {badge && value > 0 && (
                <span className="text-[10px] font-bold bg-white text-orange-600 px-2 py-0.5 rounded-full">New</span>
              )}
              {!badge && <TrendingUp size={14} className="opacity-60" />}
            </div>
            <p className="text-white/70 text-xs font-medium mb-0.5">{label}</p>
            <p className="text-2xl md:text-3xl font-bold">{value}</p>
            <p className="text-white/50 text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">

          {/* Upcoming bookings */}
          <div className="rounded-2xl border shadow-sm overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <h2 className="font-semibold" style={{ color: "var(--text)" }}>Upcoming Bookings</h2>
              <Link to="/client/bookings" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View all <ChevronRight size={14} />
              </Link>
            </div>

            <div className="p-5 md:p-6">
              {upcomingBookings.length > 0 ? (
                <div className="space-y-3">
                  {upcomingBookings.map((b) => (
                    <div key={b.id} className="flex gap-4 p-4 rounded-2xl transition-colors cursor-pointer hover:opacity-90" style={{ background: "var(--bg)" }}>
                      <img src={b.image} alt={b.property} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate" style={{ color: "var(--text)" }}>{b.property}</h3>
                        <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--text2)" }}>
                          <MapPin size={11} /> {b.location}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs" style={{ color: "var(--text2)" }}>
                          <span>In: {b.checkIn}</span>
                          <span className="text-slate-300">·</span>
                          <span>Out: {b.checkOut}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs mb-0.5" style={{ color: "var(--text2)" }}>Total</p>
                        <p className="text-lg font-bold" style={{ color: "var(--text)" }}>${b.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                    <Calendar size={24} className="text-slate-300" />
                  </div>
                  <p className="text-sm mb-4" style={{ color: "var(--text2)" }}>No upcoming bookings yet</p>
                  <Link to="/rentals" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Browse available homes →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recommended */}
          <div className="rounded-2xl border shadow-sm overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="px-5 md:px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <h2 className="font-semibold" style={{ color: "var(--text)" }}>Recommended for You</h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>Properties you might like</p>
            </div>

            <div className="p-5 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendedProperties.map((p) => (
                  <div key={p.id} className="group rounded-2xl border overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer" style={{ borderColor: "var(--border)" }}>
                    <div className="relative h-36 overflow-hidden bg-slate-100">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-xl flex items-center gap-1 text-xs font-semibold text-slate-800">
                        <Star size={11} className="text-yellow-500 fill-yellow-500" />
                        {p.rating}
                      </div>
                    </div>
                    <div className="p-4" style={{ background: "var(--surface)" }}>
                      <h3 className="font-semibold text-sm" style={{ color: "var(--text)" }}>{p.name}</h3>
                      <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--text2)" }}>
                        <MapPin size={10} /> {p.location}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-baseline gap-1">
                          <span className="font-bold" style={{ color: "var(--text)" }}>${p.price}</span>
                          <span className="text-xs text-slate-400">/month</span>
                        </div>
                        <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1">
                          View <ArrowUpRight size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">

          {/* Recent activity */}
          <div className="rounded-2xl border shadow-sm overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <h2 className="font-semibold" style={{ color: "var(--text)" }}>Recent Activity</h2>
            </div>
            <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
              {recentActivities.map(({ id, title, description, date, icon: Icon, color, bg }) => (
                <li key={id} className="flex gap-3 items-start px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className={`${bg} p-2 rounded-xl flex-shrink-0`}>
                    <Icon size={15} className={color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm" style={{ color: "var(--text)" }}>{title}</p>
                    <p className="text-xs truncate" style={{ color: "var(--text2)" }}>{description}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>{date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick actions */}
          <div className="rounded-2xl border shadow-sm overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <h2 className="font-semibold" style={{ color: "var(--text)" }}>Quick Actions</h2>
            </div>
            <div className="p-4 space-y-2">
              {[
                { to: "/client/bookings", icon: Calendar, label: "My Bookings",  sub: "View and manage",    bg: "bg-blue-50",   color: "text-blue-600" },
                { to: "/client/services", icon: Wrench,   label: "My Services",  sub: "Manage services",    bg: "bg-violet-50", color: "text-violet-600" },
                { to: "/client/profile",  icon: DollarSign, label: "Payments",   sub: "View payment history", bg: "bg-emerald-50",color: "text-emerald-600" },
              ].map(({ to, icon: Icon, label, sub, bg, color }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className={`${bg} p-2.5 rounded-xl group-hover:scale-105 transition-transform`}>
                    <Icon size={17} className={color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm" style={{ color: "var(--text)" }}>{label}</p>
                    <p className="text-xs" style={{ color: "var(--text2)" }}>{sub}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}