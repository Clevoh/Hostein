import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Wrench, DollarSign, Clock, Star } from "lucide-react";
import HosteinNavbar from "../../components/HosteinNavbar";
import CurrencySelector from "../../components/CurrencySelector";
import { formatPrice, getSavedCurrency, saveCurrency } from "../../utils/currency";
import StarRating from "../../components/StarRating";

const API_URL = import.meta.env.VITE_API_URL;
const DB_CURRENCY = "KES";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState({});  // Store reviews by serviceId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState(getSavedCurrency);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoryFilter = searchParams.get("category");
  const searchQuery = searchParams.get("q");

  useEffect(() => { fetchServices(); }, [categoryFilter, searchQuery]);

  const handleCurrencyChange = (code) => {
    saveCurrency(code);
    setCurrency(code);
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/api/service-offerings/active`);
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();
      let filtered = Array.isArray(data) ? data : [];
      
      if (categoryFilter && categoryFilter !== "all") {
        filtered = filtered.filter(s => s.category === categoryFilter);
      }
      
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(s =>
          s.name?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)
        );
      }
      
      setServices(filtered);

      // Fetch reviews for each service
      filtered.forEach(service => {
        fetchServiceReviews(service._id);
      });
    } catch (err) {
      setError("Unable to load services.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceReviews = async (serviceId) => {
    try {
      const res = await fetch(`${API_URL}/api/reviews/service/${serviceId}`);
      const data = await res.json();
      
      const reviewList = Array.isArray(data) ? data : data?.reviews || [];
      const avgRating = data?.averageRating || (
        reviewList.length > 0
          ? reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length
          : 0
      );

      setReviews(prev => ({
        ...prev,
        [serviceId]: {
          count: reviewList.length,
          average: avgRating
        }
      }));
    } catch (error) {
      console.error("Failed to fetch service reviews:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2]">
      <HosteinNavbar />

      <main className="max-w-7xl mx-auto px-6 py-10 mt-20">
        {/* Top bar with currency selector */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "28px", fontWeight: 900, color: "#0d0d0d" }}>
              Available Services
            </h2>
            {!loading && !error && (
              <p style={{ fontSize: "13px", color: "#999", marginTop: "4px" }}>
                {services.length} service{services.length !== 1 ? "s" : ""} available
              </p>
            )}
          </div>
          <CurrencySelector value={currency} onChange={handleCurrencyChange} />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-12 w-12 border-b-2 border-green-500 rounded-full" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-20">{error}</div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <Wrench size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">No services found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const serviceReviews = reviews[service._id] || { count: 0, average: 0 };
              
              return (
                <div
                  key={service._id}
                  onClick={() => navigate(`/service/${service._id}`)}
                  className="bg-white rounded-2xl shadow-sm border hover:shadow-lg transition cursor-pointer overflow-hidden"
                >
                  {service.images?.length > 0 && (
                    <img
                      src={`${API_URL}${service.images[0]}`}
                      alt={service.name}
                      className="w-full h-48 object-cover"
                    />
                  )}

                  <div className="p-6">
                    <h3 className="font-semibold text-xl mb-2">{service.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>

                    {/* ⭐ REVIEWS - Shown on card */}
                    {serviceReviews.count > 0 && (
                      <div className="flex items-center gap-2 mb-4">
                        <StarRating value={serviceReviews.average} readonly size={14} />
                        <span className="text-xs text-gray-600">
                          {serviceReviews.average.toFixed(1)} ({serviceReviews.count} review{serviceReviews.count !== 1 ? "s" : ""})
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1 text-gray-500">
                        <DollarSign size={14} />
                        {formatPrice(service.price, currency, DB_CURRENCY)}
                      </span>
                      {service.duration && (
                        <span className="flex items-center gap-1 text-gray-500">
                          <Clock size={14} />
                          {service.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
