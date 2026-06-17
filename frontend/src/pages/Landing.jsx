import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaBuilding, FaTools, FaUmbrellaBeach, FaBed } from "react-icons/fa";
import { Search, MapPin, Calendar, Users, ArrowRight, Star, ChevronRight, ArrowUpRight } from "lucide-react";
import HosteinNavbar from "../components/HosteinNavbar";

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
  const heroRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 18,
        y: (e.clientY / window.innerHeight - 0.5) * 12,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const categories = [
    { label: "Rentals",     src: rentalsImg,    to: "/rentals",              icon: FaHome,          tag: "400+ listings" },
    { label: "Apartments",  src: apartmentImg,  to: "/apartments",           icon: FaBuilding,      tag: "City living" },
    { label: "Homes",       src: homesImg,      to: "/rentals?type=homes",   icon: FaHome,          tag: "Family stays" },
    { label: "Hostels",     src: hostelImg,     to: "/rentals?type=hostel",  icon: FaBed,           tag: "Budget friendly" },
    { label: "Services",    src: servicesImg,   to: "/services",             icon: FaTools,         tag: "On-demand" },
    { label: "Experiences", src: experienceImg, to: "/experiences",          icon: FaUmbrellaBeach, tag: "Unforgettable" },
  ];

  const cities = [
    { src: nairobiImg,  label: "Nairobi",  sub: "Kenya",   count: "312 homes", to: "/rentals?city=Nairobi" },
    { src: mombasaImg,  label: "Mombasa",  sub: "Kenya",   count: "148 homes", to: "/rentals?city=Mombasa" },
    { src: kigaliImg,   label: "Kigali",   sub: "Rwanda",  count: "227 homes", to: "/rentals?city=Kigali" },
    { src: eldoretImg,  label: "Eldoret",  sub: "Kenya",   count: "89 homes",  to: "/rentals?city=Eldoret" },
  ];

  const stats = [
    { value: "2,400+", label: "Properties listed" },
    { value: "18",     label: "Cities covered" },
    { value: "12K+",   label: "Happy guests" },
    { value: "4.9",    label: "Average rating" },
  ];

  const tags = ["Kigali", "Nairobi", "Mombasa", "Hostels", "Short Stay", "Monthly"];

  return (
    <div className="min-h-screen text-[#0D0D0D]" style={{ background: "var(--bg)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Syne:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }

        .font-serif  { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-syne   { font-family: 'Syne', sans-serif; }

        /* ── HERO ── */
        .hero-section {
          min-height: 92vh;
          background: #0A0A0F;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .hero-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
        }

        .hero-glow-1 {
          position: absolute;
          top: -20%;
          right: -10%;
          width: 60vw;
          height: 60vw;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(214,163,100,0.12) 0%, transparent 65%);
          pointer-events: none;
        }
        .hero-glow-2 {
          position: absolute;
          bottom: -20%;
          left: -5%;
          width: 45vw;
          height: 45vw;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(120,140,255,0.08) 0%, transparent 65%);
          pointer-events: none;
        }

        .hero-line {
          position: absolute;
          top: 0; bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent);
          pointer-events: none;
        }

        .hero-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(60px, 8.5vw, 130px);
          font-weight: 700;
          line-height: 0.92;
          letter-spacing: -0.025em;
          color: #F4F1EC;
        }
        .hero-headline em {
          font-style: italic;
          color: #D6A364;
        }

        .hero-sub {
          font-family: 'Syne', sans-serif;
          font-size: clamp(13px, 1.1vw, 15px);
          color: rgba(244,241,236,0.45);
          letter-spacing: 0.08em;
          font-weight: 400;
          line-height: 1.8;
          text-transform: uppercase;
        }

        /* ── SEARCH BAR ── */
        .search-glass {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
        }
        .search-field {
          border-right: 1px solid rgba(255,255,255,0.08);
          transition: background 0.2s;
        }
        .search-field:hover { background: rgba(255,255,255,0.04); }
        .search-field:last-of-type { border-right: none; }

        .search-label {
          font-family: 'Syne', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(244,241,236,0.35);
          margin-bottom: 3px;
          display: block;
        }

        .search-input-txt {
          background: transparent;
          border: none;
          outline: none;
          color: #F4F1EC;
          font-family: 'Syne', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          width: 100%;
        }
        .search-input-txt::placeholder { color: rgba(244,241,236,0.3); }

        .search-btn {
          background: #D6A364;
          color: #0A0A0F;
          border: none;
          border-radius: 14px;
          padding: 13px 24px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .search-btn:hover { background: #E8B47A; transform: translateY(-1px); }

        /* ── QUICK TAGS ── */
        .tag-pill {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.06em;
          color: rgba(244,241,236,0.45);
          border: 1px solid rgba(244,241,236,0.12);
          padding: 6px 16px;
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
        }
        .tag-pill:hover {
          border-color: #D6A364;
          color: #D6A364;
        }

        /* ── STATS BAR ── */
        .stats-bar {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
        }
        .stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px;
          font-weight: 700;
          color: var(--text);
          line-height: 1;
        }
        .stat-label {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text2);
          margin-top: 4px;
        }

        /* ── SECTION HEADERS ── */
        .section-eyebrow {
          font-family: 'Syne', sans-serif;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #D6A364;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .section-eyebrow::before {
          content: '';
          width: 24px;
          height: 1.5px;
          background: #D6A364;
          display: block;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 3.5vw, 52px);
          font-weight: 700;
          color: var(--text);
          line-height: 1.0;
          letter-spacing: -0.02em;
        }
        .section-title em { font-style: italic; color: #D6A364; }

        /* ── CATEGORY CARDS ── */
        .cat-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          background: #1a1a1a;
        }
        .cat-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.4s;
          filter: brightness(0.75) saturate(0.9);
        }
        .cat-card:hover img { transform: scale(1.07); filter: brightness(0.6) saturate(1.1); }

        .cat-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, transparent 100%);
          pointer-events: none;
          transition: opacity 0.3s;
        }

        .cat-tag {
          position: absolute;
          top: 14px;
          left: 14px;
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 4px 10px;
          border-radius: 100px;
        }

        .cat-arrow {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          opacity: 0;
          transform: translateY(4px);
          transition: all 0.25s;
        }
        .cat-card:hover .cat-arrow { opacity: 1; transform: translateY(0); }

        .cat-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 18px 18px;
        }
        .cat-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 4px;
        }
        .cat-explore {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          gap: 5px;
          transition: color 0.2s;
        }
        .cat-card:hover .cat-explore { color: #D6A364; }

        /* ── CITY CARDS ── */
        .city-card-big {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          background: #111;
        }
        .city-card-big img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease, filter 0.4s;
          filter: brightness(0.7) saturate(0.85);
        }
        .city-card-big:hover img { transform: scale(1.05); filter: brightness(0.55) saturate(1.1); }

        .city-card-sm {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          background: #111;
        }
        .city-card-sm img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease, filter 0.3s;
          filter: brightness(0.65) saturate(0.85);
        }
        .city-card-sm:hover img { transform: scale(1.06); filter: brightness(0.5) saturate(1.1); }

        .city-label {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          color: #fff;
        }
        .city-sub {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .city-count {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          color: #D6A364;
          margin-top: 4px;
        }

        .city-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.15);
          color: white;
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 100px;
          transition: background 0.2s;
          cursor: pointer;
        }
        .city-pill:hover { background: rgba(255,255,255,0.2); }

        /* ── CTA ── */
        .cta-section {
          background: #0A0A0F;
          border-radius: 24px;
          position: relative;
          overflow: hidden;
        }
        .cta-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        .cta-glow {
          position: absolute;
          bottom: -40%;
          right: -10%;
          width: 50%;
          height: 200%;
          background: radial-gradient(circle, rgba(214,163,100,0.1) 0%, transparent 60%);
          pointer-events: none;
        }

        .cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 4vw, 58px);
          font-weight: 700;
          color: #F4F1EC;
          line-height: 1.0;
          letter-spacing: -0.02em;
        }
        .cta-title em { font-style: italic; color: #D6A364; }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #D6A364;
          color: #0A0A0F;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.05em;
          padding: 16px 32px;
          border-radius: 100px;
          transition: background 0.2s, transform 0.2s;
          border: none;
          cursor: pointer;
        }
        .cta-btn:hover { background: #E8B47A; transform: translateY(-2px); }

        /* ── FOOTER ── */
        .footer-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 700;
          color: var(--text);
        }

        /* ── ANIMATIONS ── */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-1 { animation: fadeSlideUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .anim-2 { animation: fadeSlideUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
        .anim-3 { animation: fadeSlideUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.4s both; }
        .anim-4 { animation: fadeSlideUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.55s both; }

        @keyframes statIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .stat-anim { animation: statIn 0.7s ease both; }
        .stat-anim:nth-child(1) { animation-delay: 0.0s; }
        .stat-anim:nth-child(2) { animation-delay: 0.08s; }
        .stat-anim:nth-child(3) { animation-delay: 0.16s; }
        .stat-anim:nth-child(4) { animation-delay: 0.24s; }

        select.search-input-txt { -webkit-appearance: none; appearance: none; cursor: pointer; }
      `}</style>

      <HosteinNavbar />

      {/* ─────────────────── HERO ─────────────────── */}
      <section className="hero-section">
        <div className="hero-grain" />
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />

        {/* Vertical lines for depth */}
        {[15, 35, 65, 85].map((left) => (
          <div key={left} className="hero-line" style={{ left: `${left}%` }} />
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT: text */}
            <div>
              {/* Badge */}
              <div className="anim-1 inline-flex items-center gap-2.5 mb-8">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} fill="#D6A364" className="text-[#D6A364]" />
                  ))}
                </div>
                <span className="font-syne text-[11px] tracking-widest uppercase text-white/40">
                  Trusted by 12,000+ guests
                </span>
              </div>

              <h1 className="hero-headline anim-2">
                Find Your<br />
                <em>Perfect</em><br />
                Stay.
              </h1>

              <p className="hero-sub anim-3 mt-6 max-w-sm">
                Apartments · Hostels · Homes<br />
                Experiences across East Africa
              </p>

              <div className="anim-4 flex flex-wrap gap-2 mt-8">
                {tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => navigate(`/rentals?q=${tag}`)}
                    className="tag-pill"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: search glass */}
            <div className="anim-3">
              <div className="search-glass p-2">
                {/* Where */}
                <div className="search-field px-5 py-4 rounded-t-2xl">
                  <span className="search-label">Where</span>
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-[#D6A364] flex-shrink-0" />
                    <input
                      className="search-input-txt"
                      placeholder="Search cities, homes…"
                      value={searchWhere}
                      onChange={(e) => setSearchWhere(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2">
                  {/* When */}
                  <div className="search-field px-5 py-4">
                    <span className="search-label">When</span>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[#D6A364] flex-shrink-0" />
                      <input
                        className="search-input-txt"
                        placeholder="Add dates"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Who */}
                  <div className="px-5 py-4">
                    <span className="search-label">Who</span>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-[#D6A364] flex-shrink-0" />
                      <select
                        className="search-input-txt"
                        value={searchWho}
                        onChange={(e) => setSearchWho(e.target.value)}
                      >
                        {["1 guest","2 guests","3 guests","4 guests","5+ guests"].map(o => (
                          <option key={o} style={{ background: "#111", color: "#F4F1EC" }}>{o}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Button row */}
                <div className="px-2 pb-2 pt-1">
                  <button
                    onClick={() => navigate(`/rentals?city=${searchWhere}`)}
                    className="search-btn w-full justify-center"
                  >
                    <Search size={15} />
                    Search Properties
                  </button>
                </div>
              </div>

              {/* Social proof below search */}
              <div className="flex items-center gap-4 mt-5 px-1">
                <div className="flex -space-x-2">
                  {["#D6A364","#7B8CFF","#6ECC8E","#FF8A65"].map((c, i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-[#0A0A0F] flex items-center justify-center text-[9px] font-bold text-white" style={{ background: c, zIndex: 4 - i }}>
                      {["K","A","M","J"][i]}
                    </div>
                  ))}
                </div>
                <p className="font-syne text-[11px] text-white/40 tracking-wide">
                  <span className="text-white/70 font-semibold">340 people</span> searched this week
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrolling ticker at bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 py-4 overflow-hidden">
          <div className="flex gap-12 whitespace-nowrap animate-[ticker_30s_linear_infinite]">
            {[...Array(3)].map((_, k) => (
              <div key={k} className="flex gap-12 flex-shrink-0">
                {["Nairobi", "Kigali", "Mombasa", "Kampala", "Dar es Salaam", "Arusha", "Entebbe", "Zanzibar"].map(c => (
                  <span key={c} className="font-syne text-[11px] tracking-widest uppercase text-white/15 flex items-center gap-3">
                    <span className="text-[#D6A364] text-[8px]">★</span> {c}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes ticker {
            from { transform: translateX(0); }
            to   { transform: translateX(-33.333%); }
          }
        `}</style>
      </section>

      {/* ─────────────────── STATS BAR ─────────────────── */}
      <section className="stats-bar">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-0" style={{ borderBottom: "1px solid var(--border)" }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-anim text-center px-6" style={{ borderRight: i < stats.length - 1 ? "1px solid var(--border)" : "none" }}>
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────── MAIN CONTENT ─────────────────── */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-20">

        {/* ── CATEGORIES ── */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="section-eyebrow">Browse by type</div>
            <h2 className="section-title">Our <em>Categories</em></h2>
          </div>
          <button
            onClick={() => navigate("/rentals")}
            className="flex items-center gap-1.5 font-syne text-xs tracking-widest uppercase transition hover:text-[#D6A364]"
            style={{ color: "var(--text2)" }}
          >
            All listings <ArrowRight size={14} />
          </button>
        </div>

        {/* Categories: masonry-style layout */}
        <div className="grid grid-cols-12 gap-4">
          {/* Big card 1 */}
          <div className="col-span-12 md:col-span-5 h-72 cat-card" onClick={() => navigate(categories[0].to)}>
            <img src={categories[0].src} alt={categories[0].label} />
            <div className="cat-overlay" />
            <span className="cat-tag">{categories[0].tag}</span>
            <div className="cat-arrow"><ArrowUpRight size={14} /></div>
            <div className="cat-info">
              <div className="cat-name">{categories[0].label}</div>
              <div className="cat-explore">Explore <ArrowRight size={11} /></div>
            </div>
          </div>

          {/* 2 medium cards */}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
            {categories.slice(1, 3).map((cat, i) => (
              <div key={i} className="h-[132px] cat-card" onClick={() => navigate(cat.to)}>
                <img src={cat.src} alt={cat.label} />
                <div className="cat-overlay" />
                <span className="cat-tag">{cat.tag}</span>
                <div className="cat-arrow"><ArrowUpRight size={12} /></div>
                <div className="cat-info" style={{ padding: "14px 16px" }}>
                  <div className="cat-name" style={{ fontSize: 20 }}>{cat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Big card 2 */}
          <div className="col-span-12 md:col-span-3 h-72 cat-card" onClick={() => navigate(categories[3].to)}>
            <img src={categories[3].src} alt={categories[3].label} />
            <div className="cat-overlay" />
            <span className="cat-tag">{categories[3].tag}</span>
            <div className="cat-arrow"><ArrowUpRight size={14} /></div>
            <div className="cat-info">
              <div className="cat-name">{categories[3].label}</div>
              <div className="cat-explore">Explore <ArrowRight size={11} /></div>
            </div>
          </div>

          {/* Bottom 2 */}
          {categories.slice(4).map((cat, i) => (
            <div key={i} className="col-span-12 md:col-span-6 h-44 cat-card" onClick={() => navigate(cat.to)}>
              <img src={cat.src} alt={cat.label} />
              <div className="cat-overlay" />
              <span className="cat-tag">{cat.tag}</span>
              <div className="cat-arrow"><ArrowUpRight size={14} /></div>
              <div className="cat-info">
                <div className="cat-name">{cat.label}</div>
                <div className="cat-explore">Explore <ArrowRight size={11} /></div>
              </div>
            </div>
          ))}
        </div>

        {/* ── POPULAR CITIES ── */}
        <div className="flex items-end justify-between mt-24 mb-10">
          <div>
            <div className="section-eyebrow">Trending now</div>
            <h2 className="section-title">Popular <em>Cities</em></h2>
          </div>
          <button
            onClick={() => navigate("/rentals")}
            className="flex items-center gap-1.5 font-syne text-xs tracking-widest uppercase transition hover:text-[#D6A364]"
            style={{ color: "var(--text2)" }}
          >
            All cities <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* BIG CITY */}
          <button className="city-card-big h-96 text-left" onClick={() => navigate(cities[0].to)}>
            <img src={cities[0].src} alt={cities[0].label} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute bottom-0 left-0 p-7">
              <p className="city-sub mb-1">{cities[0].sub}</p>
              <p className="city-label" style={{ fontSize: 44, letterSpacing: "-0.02em" }}>{cities[0].label}</p>
              <p className="city-count">{cities[0].count}</p>
              <div className="city-pill mt-5">
                Explore <ArrowRight size={13} />
              </div>
            </div>
          </button>

          {/* 3 SMALL */}
          <div className="grid grid-rows-3 gap-4 h-96">
            {cities.slice(1).map((city, i) => (
              <button key={i} className="city-card-sm text-left" onClick={() => navigate(city.to)}>
                <img src={city.src} alt={city.label} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center px-5 justify-between">
                  <div>
                    <p className="city-sub">{city.sub}</p>
                    <p className="city-label" style={{ fontSize: 24, letterSpacing: "-0.01em" }}>{city.label}</p>
                    <p className="city-count">{city.count}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── CTA BANNER ── */}
        <div className="cta-section mt-20 p-10 md:p-16">
          <div className="cta-glow" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="section-eyebrow" style={{ color: "rgba(244,241,236,0.35)" }}>
                <span style={{ background: "rgba(244,241,236,0.25)", width: 24, height: 1.5 }}></span>
                For property owners
              </div>
              <h3 className="cta-title">
                Ready to list<br />your <em>property?</em>
              </h3>
              <p className="font-syne text-[13px] text-white/35 mt-4 max-w-md leading-relaxed tracking-wide">
                Join thousands of hosts earning passive income on Hostein. Setup takes less than 5 minutes.
              </p>
            </div>
            <button
              onClick={() => navigate("/signup?role=host")}
              className="cta-btn flex-shrink-0"
            >
              Become a Host <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </main>

      {/* ─────────────────── FOOTER ─────────────────── */}
      <footer className="mt-8" style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-5">
          <span className="footer-logo">Hostein</span>
          <p className="font-syne text-xs tracking-widest uppercase" style={{ color: "var(--text2)" }}>
            © {new Date().getFullYear()} Hostein — All rights reserved
          </p>
          <div className="flex gap-8">
            {["Privacy","Terms","Support"].map(l => (
              <a key={l} href="#" className="font-syne text-xs tracking-wider uppercase transition hover:opacity-100" style={{ color: "var(--text2)", opacity: 0.5 }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}