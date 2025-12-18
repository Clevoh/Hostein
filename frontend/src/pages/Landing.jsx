import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaBuilding, FaTools, FaUmbrellaBeach } from "react-icons/fa";
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

  // CATEGORIES
  const categories = [
    { label: "Rentals", src: rentalsImg, to: "/rentals", icon: FaHome },
    { label: "Apartments", src: apartmentImg, to: "/apartments", icon: FaBuilding },
    { label: "Homes", src: homesImg, to: "/rentals?type=homes", icon: FaHome },
    { label: "Services", src: servicesImg, to: "/services", icon: FaTools },
    { label: "Experiences", src: experienceImg, to: "/experiences", icon: FaUmbrellaBeach },
  ];

  // POPULAR CITIES
  const cities = [
    { src: nairobiImg, label: "Nairobi", to: "/rentals?city=Nairobi" },
    { src: mombasaImg, label: "Mombasa", to: "/rentals?city=Mombasa" },
    { src: kigaliImg, label: "Kigali", to: "/rentals?city=Kigali" },
    { src: eldoretImg, label: "Eldoret", to: "/rentals?city=Eldoret" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <HosteinNavbar />

      {/* Search */}
      <div className="hidden lg:block max-w-4xl mx-auto mt-32 px-6">
        <HosteinSearchBarAdvanced />
      </div>

      {/* HERO */}
      <header className="pt-20 lg:pt-28">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-5xl md:text-6xl font-extrabold">Find Your Next Stay</h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Discover homes, apartments and trusted services — all in one place.
          </p>
          <div className="lg:hidden mt-10">
            <HosteinSearchBarAdvanced />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* CATEGORIES */}
        <h3 className="text-2xl font-semibold mb-6">Categories</h3>

        <div className="flex md:grid md:grid-cols-5 gap-4 overflow-x-auto md:overflow-visible pb-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(cat.to)}
                className="relative min-w-[160px] md:min-w-0 rounded-2xl overflow-hidden shadow hover:shadow-lg transition group ring-2 ring-transparent hover:ring-red-500 min-w-[160px] md:min-w-0 rounded-2xl overflow-hidden shadow hover:shadow-lg transition group"
              >
                <img
                  src={cat.src}
                  alt={cat.label}
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <Icon className="text-2xl mb-1" />
                  <span className="font-semibold text-sm md:text-base">{cat.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* CITIES */}
        <h3 className="text-2xl font-semibold mt-16 mb-6">Popular Cities</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {cities.map((city, i) => (
            <button
              key={i}
              onClick={() => navigate(city.to)}
              className="relative rounded-2xl overflow-hidden shadow hover:shadow-xl transition group"
            >
              <img
                src={city.src}
                alt={city.label}
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 gap-2">
                <span className="text-white font-semibold text-lg">{city.label}</span>
                <span className="inline-block w-fit bg-white/90 text-gray-900 text-sm px-4 py-1 rounded-full">Explore</span>
              </div>
            </button>
          ))}
        </div>
      </main>

      <footer className="text-center py-8 text-gray-500 border-t mt-12">
        © {new Date().getFullYear()} Hostein — All rights reserved.
      </footer>
    </div>
  );
}
