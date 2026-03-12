import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Star, Check } from "lucide-react";
import HosteinNavbar from "../../components/HosteinNavbar";
import CurrencySelector from "../../components/CurrencySelector";
import { formatPrice, getSavedCurrency, saveCurrency } from "../../utils/currency";

const API_URL = "http://localhost:5000";
const DB_CURRENCY = "KES";

export default function ServiceDetailsPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState(getSavedCurrency);

  useEffect(() => { fetchService(); }, [serviceId]);

  const handleCurrencyChange = (code) => {
    saveCurrency(code);
    setCurrency(code);
  };

  const fetchService = async () => {
    try {
      const res = await fetch(`${API_URL}/api/service-offerings/${serviceId}`);
      const data = await res.json();
      setService(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-green-500 rounded-full" />
      </div>
    );

  if (!service)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Service not found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F7F5F2]">
      <HosteinNavbar />

      <main className="max-w-5xl mx-auto px-6 py-10 mt-20">
        {/* Back + Currency row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <CurrencySelector value={currency} onChange={handleCurrencyChange} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          {service.images?.length > 0 && (
            <img
              src={`${API_URL}${service.images[0]}`}
              alt={service.name}
              className="w-full h-72 object-cover rounded-2xl mb-6"
            />
          )}

          <h1 className="text-3xl font-bold mb-4">{service.name}</h1>
          <p className="text-gray-600 mb-6">{service.description}</p>

          <div className="grid grid-cols-2 gap-6 border-t pt-6">
            {/* Price — converted to selected currency */}
            <div className="flex items-center gap-3">
              <span style={{ fontSize: "22px", fontWeight: 700, color: "#16a34a" }}>
                {formatPrice(service.price, currency, DB_CURRENCY)}
              </span>
            </div>

            {service.duration && (
              <div className="flex items-center gap-3">
                <Clock className="text-blue-600" />
                <span>{service.duration}</span>
              </div>
            )}

            {service.rating > 0 && (
              <div className="flex items-center gap-3">
                <Star className="text-yellow-500" />
                <span>{service.rating} ({service.reviewCount} reviews)</span>
              </div>
            )}
          </div>

          {/* Approximate conversion note */}
          {currency !== DB_CURRENCY && (
            <p style={{ fontSize: "12px", color: "#bbb", marginTop: "12px" }}>
              ≈ Converted from {formatPrice(service.price, DB_CURRENCY, DB_CURRENCY)}. Rates are approximate.
            </p>
          )}

          {service.features?.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold mb-3">What's Included</h3>
              {service.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check size={16} className="text-green-600" />
                  {f}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
