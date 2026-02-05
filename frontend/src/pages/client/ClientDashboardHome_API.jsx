// src/pages/client/ClientDashboardHome.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Calendar,
  Bell,
  TrendingUp,
  MapPin,
  Clock,
  DollarSign,
  Star,
  ChevronRight,
  CheckCircle,
  AlertCircle,
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
      type: "booking",
      title: "Booking Confirmed",
      description: "Luxury Apartment - Downtown",
      date: "2 hours ago",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: 2,
      type: "service",
      title: "Maintenance Scheduled",
      description: "AC repair - Jan 15, 2026",
      date: "1 day ago",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 3,
      type: "alert",
      title: "Payment Due",
      description: "Monthly rent payment",
      date: "3 days ago",
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
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

  return (
    <div className="space-y-6 max-w-7xl">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your account today.
          </p>
        </div>

        <Link
          to="/rentals"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <Home size={18} />
          Find a Home
        </Link>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Calendar size={24} />
            </div>
            <TrendingUp size={20} className="opacity-70" />
          </div>
          <p className="text-blue-100 text-sm font-medium">Total Bookings</p>
          <p className="text-3xl font-bold mt-1">{stats.totalBookings}</p>
          <p className="text-blue-100 text-xs mt-2">All time bookings</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Clock size={24} />
            </div>
            <TrendingUp size={20} className="opacity-70" />
          </div>
          <p className="text-green-100 text-sm font-medium">Upcoming Stays</p>
          <p className="text-3xl font-bold mt-1">{stats.upcomingStays}</p>
          <p className="text-green-100 text-xs mt-2">Scheduled bookings</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <CheckCircle size={24} />
            </div>
            <TrendingUp size={20} className="opacity-70" />
          </div>
          <p className="text-purple-100 text-sm font-medium">Active Services</p>
          <p className="text-3xl font-bold mt-1">{stats.activeServices}</p>
          <p className="text-purple-100 text-xs mt-2">Ongoing services</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Bell size={24} />
            </div>
            {stats.notifications > 0 && (
              <span className="px-2 py-1 bg-white text-orange-600 rounded-full text-xs font-bold">
                New
              </span>
            )}
          </div>
          <p className="text-orange-100 text-sm font-medium">Notifications</p>
          <p className="text-3xl font-bold mt-1">{stats.notifications}</p>
          <p className="text-orange-100 text-xs mt-2">Unread alerts</p>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - Upcoming Bookings */}
        <div className="lg:col-span-2 space-y-6">
          {/* UPCOMING BOOKINGS */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Upcoming Bookings
                </h2>
                <Link
                  to="/client/bookings"
                  className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                >
                  View all
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            <div className="p-6">
              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <img
                        src={booking.image}
                        alt={booking.property}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {booking.property}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <MapPin size={14} />
                          {booking.location}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>Check-in: {booking.checkIn}</span>
                          <span>•</span>
                          <span>Check-out: {booking.checkOut}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-xl font-bold text-gray-900">
                          ${booking.amount}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="text-gray-400" size={32} />
                  </div>
                  <p className="text-gray-600 mb-4">
                    You don't have any bookings yet.
                  </p>
                  <Link
                    to="/rentals"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Browse available homes →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* RECOMMENDED PROPERTIES */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Recommended for You
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Properties you might like based on your preferences
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedProperties.map((property) => (
                  <div
                    key={property.id}
                    className="group border rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="relative h-40">
                      <img
                        src={property.image}
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        {property.rating}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">
                        {property.name}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <MapPin size={14} />
                        {property.location}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            ${property.price}
                          </span>
                          <span className="text-sm text-gray-500">/month</span>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Recent Activity & Quick Actions */}
        <div className="space-y-6">
          {/* RECENT ACTIVITY */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Activity
              </h2>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex gap-3 items-start hover:bg-gray-50 p-3 rounded-lg transition-colors cursor-pointer"
                    >
                      <div
                        className={`${activity.bgColor} p-2 rounded-lg shrink-0`}
                      >
                        <Icon size={18} className={activity.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.date}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                to="/client/activity"
                className="block text-center mt-4 text-blue-600 text-sm font-medium hover:underline"
              >
                View all activity
              </Link>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Quick Actions
              </h2>
            </div>

            <div className="p-6 space-y-3">
              <Link
                to="/client/bookings"
                className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
              >
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Calendar className="text-blue-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">My Bookings</p>
                  <p className="text-sm text-gray-600">
                    View and manage bookings
                  </p>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </Link>

              <Link
                to="/client/services"
                className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
              >
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <CheckCircle className="text-purple-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">My Services</p>
                  <p className="text-sm text-gray-600">Manage your services</p>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </Link>

              <Link
                to="/client/profile"
                className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
              >
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <DollarSign className="text-green-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Payments</p>
                  <p className="text-sm text-gray-600">View payment history</p>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
