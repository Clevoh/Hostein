import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaBuilding, FaTools, FaUmbrellaBeach, FaBed } from "react-icons/fa";
import { Search, MapPin, Calendar, Users, ArrowRight, Star, ChevronRight } from "lucide-react";
import HosteinNavbar from "../components/HosteinNavbar";

// Assets
import rentalsImg    from "../assets/categories/rentals.jpg";
import apartmentImg  from "../assets/categories/apartment.jpg";
import homesImg      from "../assets/categories/homes.jpg";
import hostelImg     from "../assets/categories/hostel.jpg";
import servicesImg   from "../assets/categories/services.jpg";
import experienceImg from "../assets/categories/experience.jpg";

import nairobiImg  from "../assets/cities/nairobi.jpg";
import mombasaImg  from "../assets/cities/mombasa.jpg";
import kigaliImg   from "../assets/cities/kigali.jpg";
import eldoretImg  from "../assets/cities/eldoret.jpg";

export default function Landing() {
  const navigate = useNavigate();
  const [searchWhere, setSearchWhere] = useState("");
  const [searchDate, setSearchDate]   = useState("");
  const [searchWho, setSearchWho]     = useState("1 guest");
  const [scrolled, setScrolled]       = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const categories = [
    { label: "Rentals",     src: rentalsImg,    to: "/rentals",               icon: FaHome,          color: "from-orange-500/80" },
    { label: "Apartments",  src: apartmentImg,  to: "/apartments",            icon: FaBuilding,      color: "from-blue-600/80" },
    { label: "Homes",       src: homesImg,      to: "/rentals?type=homes",    icon: FaHome,          color: "from-green-600/80" },
    { label: "Hostels",     src: hostelImg,     to: "/rentals?type=hostel",   icon: FaBed,           color: "from-purple-600/80" },
    { label: "Services",    src: servicesImg,   to: "/services",              icon: FaTools,         color: "from-rose-600/80" },
    { label: "Experiences", src: experienceImg, to: "/experiences",           icon: FaUmbrellaBeach, color: "from-cyan-600/80" },
  ];

  const cities = [
    { src: nairobiImg,  label: "Nairobi",  sub: "Kenya",  to: "/rentals?city=Nairobi" },
    { src: mombasaImg,  label: "Mombasa",  sub: "Kenya",  to: "/rentals?city=Mombasa" },
    { src: kigaliImg,   label: "Kigali",   sub: "Rwanda", to: "/rentals?city=Kigali" },
    { src: eldoretImg,  label: "Eldoret",  sub: "Kenya",  to: "/rentals?city=Eldoret" },
  ];

  const stats = [
    { value: "2,400+", label: "Properties" },
    { value: "18",     label: "Cities" },
    { value: "12K+",   label: "Happy Guests" },
    { value: "4.9★",   label: "Avg. Rating" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F2] text-gray-900 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .font-display { font-family: 'Playfair Display', serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }

        .hero-bg {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%);
        }

        .search-bar {
          background: white;
          border-radius: 100px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.15);
        }

        .category-card {
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
        }
        .category-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
        }

        .city-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .city-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.18); }

        .stat-item {
          animation: fadeUp 0.6s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .stat-item:nth-child(1) { animation-delay: 0.1s; }
        .stat-item:nth-child(2) { animation-delay: 0.2s; }
        .stat-item:nth-child(3) { animation-delay: 0.3s; }
        .stat-item:nth-child(4) { animation-delay: 0.4s; }

        .hero-text {
          animation: fadeUp 0.8s ease 0.1s both;
        }
        .search-animate {
          animation: fadeUp 0.8s ease 0.35s both;
        }

        .tag-pill {
          transition: all 0.2s ease;
        }
        .tag-pill:hover {
          background: #1a1a2e;
          color: white;
          transform: scale(1.05);
        }
      `}</style>

      <HosteinNavbar />

      {/* ─── HERO ─── */}
      <section className="hero-bg relative overflow-hidden min-h-[580px] flex flex-col justify-center font-body">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm px-4 py-1.5 rounded-full mb-6 font-body">
            <Star size={13} fill="currentColor" className="text-amber-400" />
            Trusted by 12,000+ guests across East Africa
          </div>

          {/* Headline */}
          <h1 className="hero-text font-display text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-4">
            Find Your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
              Perfect Stay
            </span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-xl mx-auto mb-10 font-body font-light">
            Apartments, hostels, homes and experiences — all in one place.
          </p>

          {/* ─── SEARCH BAR ─── */}
          <div className="search-animate search-bar mx-auto max-w-3xl flex flex-col md:flex-row items-stretch md:items-center p-2 gap-2 font-body">
            {/* Where */}
            <div className="flex items-center gap-2 flex-1 px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
              <MapPin size={18} className="text-gray-400 flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Where</span>
                <input
                  className="text-sm text-gray-800 outline-none bg-transparent placeholder-gray-400 w-full"
                  placeholder="Search cities, homes..."
                  value={searchWhere}
                  onChange={(e) => setSearchWhere(e.target.value)}
                />
              </div>
            </div>

            {/* When */}
            <div className="flex items-center gap-2 px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
              <Calendar size={18} className="text-gray-400 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">When</span>
                <input
                  className="text-sm text-gray-800 outline-none bg-transparent placeholder-gray-400 w-28"
                  placeholder="Add dates"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                />
              </div>
            </div>

            {/* Who */}
            <div className="flex items-center gap-2 px-4 py-2">
              <Users size={18} className="text-gray-400 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Who</span>
                <select
                  className="text-sm text-gray-800 outline-none bg-transparent w-24"
                  value={searchWho}
                  onChange={(e) => setSearchWho(e.target.value)}
                >
                  {["1 guest","2 guests","3 guests","4 guests","5+ guests"].map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => navigate(`/rentals?city=${searchWhere}`)}
              className="bg-gradient-to-br from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-full px-6 py-3 flex items-center gap-2 font-semibold transition-all shadow-lg shadow-orange-500/30 whitespace-nowrap"
            >
              <Search size={18} />
              Search
            </button>
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {["Kigali", "Nairobi", "Mombasa", "Hostels", "Short Stay", "Monthly"].map(tag => (
              <button
                key={tag}
                onClick={() => navigate(`/rentals?q=${tag}`)}
                className="tag-pill text-xs text-white/70 border border-white/20 px-3 py-1.5 rounded-full cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="bg-white border-b border-gray-100 font-body">
        <div className="max-w-4xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="stat-item text-center">
              <p className="font-display text-3xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-7xl mx-auto px-6 py-16 font-body">

        {/* CATEGORIES */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-1">Browse by type</p>
            <h2 className="font-display text-3xl font-bold text-gray-900">Categories</h2>
          </div>
          <button
            onClick={() => navigate("/rentals")}
            className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition"
          >
            View all <ChevronRight size={16} />
          </button>
        </div>

        {/* 3 + 3 Grid — top row larger */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {categories.slice(0, 3).map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(cat.to)}
                className="category-card relative rounded-2xl overflow-hidden shadow-sm text-left h-48"
              >
                <img src={cat.src} alt={cat.label} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-transparent`} />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="text-lg opacity-90" />
                    <span className="font-semibold text-lg">{cat.label}</span>
                  </div>
                  <span className="text-xs text-white/70 flex items-center gap-1">
                    Explore <ArrowRight size={11} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {categories.slice(3).map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(cat.to)}
                className="category-card relative rounded-2xl overflow-hidden shadow-sm text-left h-48"
              >
                <img src={cat.src} alt={cat.label} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-transparent`} />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="text-lg opacity-90" />
                    <span className="font-semibold text-lg">{cat.label}</span>
                  </div>
                  <span className="text-xs text-white/70 flex items-center gap-1">
                    Explore <ArrowRight size={11} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* POPULAR CITIES */}
        <div className="flex items-end justify-between mt-16 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-1">Trending now</p>
            <h2 className="font-display text-3xl font-bold text-gray-900">Popular Cities</h2>
          </div>
          <button
            onClick={() => navigate("/rentals")}
            className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition"
          >
            See all cities <ChevronRight size={16} />
          </button>
        </div>

        {/* Cities: 1 big left + 3 stacked right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* BIG CITY */}
          <button
            onClick={() => navigate(cities[0].to)}
            className="city-card relative rounded-2xl overflow-hidden shadow-sm h-80 text-left"
          >
            <img src={cities[0].src} alt={cities[0].label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <p className="text-white font-display text-3xl font-bold">{cities[0].label}</p>
              <p className="text-white/60 text-sm mb-3">{cities[0].sub}</p>
              <span className="bg-white/90 text-gray-900 text-sm font-semibold px-4 py-1.5 rounded-full">
                Explore →
              </span>
            </div>
          </button>

          {/* 3 SMALL CITIES */}
          <div className="grid grid-rows-3 gap-4 h-80">
            {cities.slice(1).map((city, i) => (
              <button
                key={i}
                onClick={() => navigate(city.to)}
                className="city-card relative rounded-2xl overflow-hidden shadow-sm text-left"
              >
                <img src={city.src} alt={city.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                <div className="absolute inset-0 flex items-center px-5 justify-between">
                  <div>
                    <p className="text-white font-semibold text-lg leading-tight">{city.label}</p>
                    <p className="text-white/60 text-xs">{city.sub}</p>
                  </div>
                  <span className="text-white/70 hover:text-white transition">
                    <ArrowRight size={20} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ─── CTA BANNER ─── */}
        <div className="mt-16 rounded-3xl overflow-hidden bg-gradient-to-r from-[#1a1a2e] to-[#0f3460] p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-3xl font-bold text-white mb-2">
              Ready to list your property?
            </h3>
            <p className="text-white/60 text-base max-w-md">
              Join thousands of hosts earning passive income on Hostein.
              Setup takes less than 5 minutes.
            </p>
          </div>
          <button
            onClick={() => navigate("/signup?role=host")}
            className="flex-shrink-0 bg-gradient-to-br from-orange-400 to-rose-500 hover:from-orange-500 hover:to-rose-600 text-white font-semibold px-8 py-4 rounded-2xl transition shadow-xl shadow-orange-500/30 flex items-center gap-2"
          >
            Become a Host <ArrowRight size={18} />
          </button>
        </div>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="bg-white border-t border-gray-100 mt-12 font-body">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span className="font-display font-bold text-gray-800 text-lg">Hostein</span>
          <span>© {new Date().getFullYear()} Hostein — All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-700 transition">Privacy</a>
            <a href="#" className="hover:text-gray-700 transition">Terms</a>
            <a href="#" className="hover:text-gray-700 transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
