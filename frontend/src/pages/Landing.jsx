// src/pages/Landing.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import HosteinSearchBarAdvanced from "../components/HosteinSearchBarAdvanced";
import HosteinNavbar from "../components/HosteinNavbar";

// Assets (Vite-safe imports)
import rentalsImg from "../assets/categories/rentals.jpg";
import apartmentImg from "../assets/categories/apartment.jpg";
import homesImg from "../assets/categories/homes.jpg";
import servicesImg from "../assets/categories/services.jpg";
import experienceImg from "../assets/categories/experience.jpg";

import nairobiImg from "../assets/cities/nairobi.jpg";
import mombasaImg from "../assets/cities/mombasa.jpg";
import kigaliImg from "../assets/cities/kigali.jpg";
import eldoretImg from "../assets/cities/eldoret.jpg";

export default function Landing() {
  const navigate = useNavigate();

  // CATEGORIES (now clickable)
  const categories = [
    { label: "Rentals", src: rentalsImg, to: "/rentals" },
    { label: "Apartments", src: apartmentImg, to: "/apartments" },
    { label: "Homes", src: homesImg, to: "/rentals?type=homes" },
    { label: "Services", src: servicesImg, to: "/services" },
    { label: "Experiences", src: experienceImg, to: "/experiences" },
  ];

  // POPULAR CITIES
  const cities = [
    { src: nairobiImg, label: "Homes in Nairobi", to: "/rentals?city=Nairobi" },
    { src: mombasaImg, label: "Homes in Mombasa", to: "/rentals?city=Mombasa" },
    { src: kigaliImg, label: "Homes in Kigali", to: "/rentals?city=Kigali" },
    { src: eldoretImg, label: "Homes in Eldoret", to: "/rentals?city=Eldoret" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* NAVBAR */}
      <HosteinNavbar />

      {/* Desktop search bar */}
      <div className="hidden lg:block max-w-4xl mx-auto mt-32 px-6">
        <HosteinSearchBarAdvanced />
      </div>

      {/* HERO */}
      <header className="pt-20 lg:pt-28">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Find Your Next Stay
          </h2>

          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Discover homes, apartments and trusted services — all in one place.
            Hostein helps you manage bookings and properties with ease.
          </p>

          {/* Mobile search bar */}
          <div className="lg:hidden mt-10">
            <HosteinSearchBarAdvanced />
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3 bg-red-600 text-white text-lg rounded-full shadow hover:bg-red-700 transition"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="px-8 py-3 border text-lg rounded-full text-gray-700 hover:bg-gray-100 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* CATEGORIES */}
        <h3 className="text-2xl font-semibold mb-6">Categories</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-16">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => navigate(cat.to)}
              className="text-left rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer bg-white border hover:border-red-500"
            >
              <img src={cat.src} alt={cat.label} className="w-full h-28 object-cover" />
              <div className="p-3 text-center font-medium text-gray-800">
                {cat.label}
              </div>
            </button>
          ))}
        </div>

        {/* POPULAR CITIES */}
        <h3 className="text-2xl font-semibold mb-6">Popular Cities</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {cities.map((city, i) => (
            <button
              key={i}
              onClick={() => navigate(city.to)}
              className="text-left rounded-xl overflow-hidden shadow hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer bg-white"
            >
              <img src={city.src} alt={city.label} className="w-full h-40 object-cover" />
              <div className="p-4 text-gray-800 font-medium">{city.label}</div>
            </button>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center py-8 text-gray-500 border-t mt-12">
        © {new Date().getFullYear()} Hostein — All rights reserved.
      </footer>
    </div>
  );
}
