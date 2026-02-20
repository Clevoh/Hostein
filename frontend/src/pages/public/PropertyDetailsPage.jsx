import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin, Calendar, Users, Star, Wifi, ChevronLeft, ChevronRight, 
  Home, Check, X, UtensilsCrossed, ArrowLeft
} from "lucide-react";
import HosteinNavbar from "../../components/HosteinNavbar";

export default function PropertyDetailsPage() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingUnit, setBookingUnit] = useState(null);
  
  // Booking form
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const [propRes, unitsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/properties/${propertyId}`),
        fetch(`http://localhost:5000/api/units/property/${propertyId}`)
      ]);
      
      const propData = await propRes.json();
      const unitsData = await unitsRes.json();
      
      setProperty(propData);
      setUnits(unitsData);
    } catch (error) {
      console.error("Failed to fetch property:", error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/800x600?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const nextImage = () => {
    if (property?.images?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property?.images?.length) {
      setCurrentImageIndex((prev) => 
        (prev - 1 + property.images.length) % property.images.length
      );
    }
  };

  const handleBooking = (unit) => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to book");
      navigate("/login");
      return;
    }

    setBookingUnit(unit);
  };

  const confirmBooking = async () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          property: property._id,
          unit: bookingUnit._id,
          checkIn,
          checkOut,
          guests,
        }),
      });

      if (res.ok) {
        alert("Booking request submitted successfully!");
        setBookingUnit(null);
        navigate("/client/bookings");
      } else {
        const error = await res.json();
        alert(error.message || "Booking failed");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to submit booking");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Property not found</h2>
          <button
            onClick={() => navigate("/rentals")}
            className="text-orange-500 hover:underline"
          >
            Back to Rentals
          </button>
        </div>
      </div>
    );
  }

  const images = property.images || [];
  const hasImages = images.length > 0;
  const isHostel = property.category === "hostel";

  return (
    <div className="min-h-screen bg-[#F7F5F2] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <HosteinNavbar />

      <main className="max-w-7xl mx-auto px-6 py-10 mt-16 font-body">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Image Gallery */}
        <div className="relative h-[500px] rounded-3xl overflow-hidden mb-8 bg-gray-200">
          {hasImages ? (
            <>
              <img
                src={getImageUrl(images[currentImageIndex])}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Home size={64} className="text-gray-400" />
            </div>
          )}
        </div>

        {/* Property Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {property.category === "apartment" ? "Apartment" :
                   property.category === "hostel" ? "Hostel" :
                   "Short Stay"}
                </span>
                {isHostel && property.hostelType && (
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    {property.hostelType.replace(/_/g, " ")}
                  </span>
                )}
              </div>
              
              <h1 className="font-display text-4xl font-bold text-gray-900 mb-3">
                {property.title}
              </h1>
              
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={18} />
                <span>{property.address}, {property.city}, {property.country}</span>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About this place</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {property.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700">
                      <Check size={16} className="text-green-600" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meal Plans (Hostels only) */}
            {isHostel && property.mealPlans && property.mealPlans.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <UtensilsCrossed size={20} />
                  Meal Plans Available
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.mealPlans.map((plan, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-4 bg-white">
                      <p className="font-semibold text-gray-900 mb-1">
                        {plan.name.replace(/_/g, " ")}
                      </p>
                      {plan.description && (
                        <p className="text-xs text-gray-500 mb-2">{plan.description}</p>
                      )}
                      <div className="flex gap-3 text-sm">
                        {plan.priceDaily && (
                          <span className="text-gray-600">
                            {plan.priceDaily} RWF/day
                          </span>
                        )}
                        {plan.priceMonthly && (
                          <span className="text-gray-600 font-semibold">
                            {plan.priceMonthly} RWF/month
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Units */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Available Units ({units.filter(u => !u.isOccupied).length})
              </h3>
              
              {units.filter(u => !u.isOccupied).length === 0 ? (
                <p className="text-gray-500">No units available at the moment</p>
              ) : (
                <div className="space-y-3">
                  {units.filter(u => !u.isOccupied).map((unit) => (
                    <div key={unit._id} className="border border-gray-200 rounded-xl p-4 bg-white hover:border-orange-300 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              Unit {unit.unitNumber}
                            </h4>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              {unit.unitType}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span>🛏️ {unit.bedrooms} Bed</span>
                            <span>🚿 {unit.bathrooms} Bath</span>
                          </div>

                          {isHostel && unit.mealPlanType !== "none" && (
                            <div className="flex items-center gap-1 text-sm text-purple-700 mb-2">
                              <UtensilsCrossed size={14} />
                              <span>{unit.mealPlanType.replace(/_/g, " ")}</span>
                            </div>
                          )}

                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                              {unit.rentAmount?.toLocaleString()} RWF
                            </span>
                            <span className="text-sm text-gray-500">/month</span>
                            {isHostel && unit.mealPlanCost > 0 && (
                              <span className="text-sm text-gray-600">
                                + {unit.mealPlanCost} RWF meals
                              </span>
                            )}
                          </div>

                          {isHostel && unit.totalMonthlyCost > unit.rentAmount && (
                            <p className="text-sm font-semibold text-blue-600 mt-1">
                              Total: {unit.totalMonthlyCost?.toLocaleString()} RWF/month
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => handleBooking(unit)}
                          className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition whitespace-nowrap"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Booking Card (Sticky) */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="mb-4">
                {property.rentType === "daily" && property.pricePerNight ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">
                      ${property.pricePerNight}
                    </span>
                    <span className="text-gray-600">/ night</span>
                  </div>
                ) : (
                  <span className="text-lg font-semibold text-gray-700">
                    Monthly Rental
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:border-orange-400"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center mb-3">
                Select a unit above to complete your booking
              </p>

              <div className="pt-3 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-500">
                  You won't be charged yet
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {bookingUnit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Confirm Booking
            </h3>
            
            <div className="space-y-2 mb-4 text-sm">
              <p><strong>Property:</strong> {property.title}</p>
              <p><strong>Unit:</strong> {bookingUnit.unitNumber} ({bookingUnit.unitType})</p>
              <p><strong>Price:</strong> {bookingUnit.rentAmount?.toLocaleString()} RWF/month</p>
              {checkIn && <p><strong>Check-in:</strong> {checkIn}</p>}
              {checkOut && <p><strong>Check-out:</strong> {checkOut}</p>}
              <p><strong>Guests:</strong> {guests}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setBookingUnit(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
