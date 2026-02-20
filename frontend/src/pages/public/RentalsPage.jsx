import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapPin, Calendar, Users, Star, Wifi, Home, Bed, Bath, ArrowRight } from "lucide-react";
import HosteinNavbar from "../../components/HosteinNavbar";

export default function RentalsPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get filters from URL
  const categoryFilter = searchParams.get("type");   // hostel, apartment, etc.
  const cityFilter     = searchParams.get("city");
  const searchQuery    = searchParams.get("q");

  useEffect(() => {
    fetchProperties();
  }, [categoryFilter, cityFilter, searchQuery]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/properties");
      const data = await res.json();
      
      let filtered = data;

      // Filter by category
      if (categoryFilter) {
        filtered = filtered.filter(p => p.category === categoryFilter);
      }

      // Filter by city
      if (cityFilter) {
        filtered = filtered.filter(p => 
          p.city?.toLowerCase().includes(cityFilter.toLowerCase())
        );
      }

      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
          p.title?.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
        );
      }

      setProperties(filtered);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x300?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const getCategoryLabel = (cat) => {
    const labels = {
      apartment:   "Apartment",
      hostel:      "Hostel",
      short_stay:  "Short Stay",
    };
    return labels[cat] || cat;
  };

  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <HosteinNavbar />

      {/* HEADER */}
      <header className="bg-gradient-to-r from-[#1a1a2e] to-[#0f3460] text-white py-16 mt-16 font-body">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-orange-400 text-sm mb-3">
            <span className="cursor-pointer hover:underline" onClick={() => navigate("/")}>
              Home
            </span>
            <span>/</span>
            <span>
              {categoryFilter ? getCategoryLabel(categoryFilter) :
               cityFilter ? cityFilter :
               searchQuery ? `Search: ${searchQuery}` :
               "All Rentals"}
            </span>
          </div>
          <h1 className="font-display text-5xl font-bold mb-2">
            {categoryFilter ? `${getCategoryLabel(categoryFilter)}s` :
             cityFilter ? `Properties in ${cityFilter}` :
             searchQuery ? `"${searchQuery}"` :
             "Explore Rentals"}
          </h1>
          <p className="text-white/70 text-lg">
            {properties.length} propert{properties.length === 1 ? "y" : "ies"} available
          </p>
        </div>
      </header>

      {/* FILTERS BAR */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10 font-body">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3 overflow-x-auto">
          <button
            onClick={() => navigate("/rentals")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              !categoryFilter && !cityFilter && !searchQuery
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => navigate("/rentals?type=apartment")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              categoryFilter === "apartment"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🏢 Apartments
          </button>
          <button
            onClick={() => navigate("/rentals?type=hostel")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              categoryFilter === "hostel"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🛏️ Hostels
          </button>
          <button
            onClick={() => navigate("/rentals?type=short_stay")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              categoryFilter === "short_stay"
                ? "bg-cyan-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            ✈️ Short Stay
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-10 font-body">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <Home size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No properties found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters or search criteria
            </p>
            <button
              onClick={() => navigate("/rentals")}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition"
            >
              View All Properties
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <div
                key={property._id}
                onClick={() => handlePropertyClick(property._id)}
                className="group cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3">
                  <img
                    src={getImageUrl(property.images?.[0])}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                  
                  {/* Image counter */}
                  {property.images && property.images.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
                      1/{property.images.length}
                    </div>
                  )}

                  {/* Category badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
                    {getCategoryLabel(property.category)}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  {/* Location */}
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin size={14} />
                    <span className="font-medium">{property.city}, {property.country}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 truncate">
                    {property.title}
                  </h3>

                  {/* Amenities (if available) */}
                  {property.amenities && property.amenities.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {property.amenities.slice(0, 3).map((amenity, i) => (
                        <span key={i} className="flex items-center gap-1">
                          {amenity === "WiFi" && <Wifi size={12} />}
                          {amenity}
                        </span>
                      ))}
                      {property.amenities.length > 3 && (
                        <span>+{property.amenities.length - 3} more</span>
                      )}
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-baseline gap-1 pt-1">
                    {property.rentType === "daily" && property.pricePerNight ? (
                      <>
                        <span className="text-lg font-bold text-gray-900">
                          ${property.pricePerNight}
                        </span>
                        <span className="text-sm text-gray-600">/ night</span>
                      </>
                    ) : (
                      <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        Monthly Rental
                      </span>
                    )}
                  </div>

                  {/* View details link */}
                  <button className="mt-2 w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 group-hover:gap-3">
                    View Details
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
 