// src/pages/public/PropertyDetailsPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin, Calendar, Users, Star, Wifi, ChevronLeft, ChevronRight,
  Home, Check, X, UtensilsCrossed, ArrowLeft, Loader2, MessageCircle, Send
} from "lucide-react";
import HosteinNavbar from "../../components/HosteinNavbar";
import CurrencySelector from "../../components/CurrencySelector";
import { getCurrencyByCountry, convertPrice, CURRENCIES } from "../../utils/currency";
import StarRating from "../../components/StarRating";

export default function PropertyDetailsPage() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingUnit, setBookingUnit] = useState(null);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  // Currency state — default determined from property's country after load
  const [displayCurrency, setDisplayCurrency] = useState("USD");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    fetchPropertyDetails();
    fetchPropertyReviews();
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const [propRes, unitsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/properties/${propertyId}`),
        fetch(`${import.meta.env.VITE_API_URL}/api/units/property/${propertyId}`)
      ]);
      const propData = await propRes.json();
      const unitsData = await unitsRes.json();

      const propertyData = propData?.property || propData?.data || propData;
      const unitsList = Array.isArray(unitsData) ? unitsData : unitsData?.units || unitsData?.data || [];

      setProperty(propertyData);
      setUnits(unitsList);

      const defaultCurrency = getCurrencyByCountry(propertyData?.country);
      setDisplayCurrency(defaultCurrency);
    } catch (error) {
      console.error("Failed to fetch property:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertyReviews = async () => {
    try {
      setReviewsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/property/${propertyId}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.reviews || data?.data || [];
      setReviews(list);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const reviewStats = useMemo(() => {
    const count = reviews.length;
    const avg = count
      ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / count
      : 0;
    return { count, avg };
  }, [reviews]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to submit a review");
      navigate("/login");
      return;
    }

    if (!reviewRating) {
      alert("Please select a rating");
      return;
    }

    try {
      setReviewSubmitting(true);
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          propertyId,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to submit review");
        return;
      }

      setReviewRating(0);
      setReviewComment("");
      fetchPropertyReviews();
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Review submit error:", error);
      alert("Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Format price: convert from unit's stored currency to client's chosen currency
  const formatAmount = (amount, storedCurrency) => {
    const from = storedCurrency || getCurrencyByCountry(property?.country) || "USD";
    const converted = convertPrice(amount, from, displayCurrency);
    const currencyObj = CURRENCIES.find(c => c.code === displayCurrency);
    const symbol = currencyObj?.symbol || displayCurrency;
    return `${symbol} ${converted >= 1000
      ? converted.toLocaleString("en-US", { maximumFractionDigits: 0 })
      : converted.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/800x600?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `${import.meta.env.VITE_API_URL}${imagePath}`;
  };

  const nextImage = () => {
    if (property?.images?.length)
      setCurrentImageIndex(prev => (prev + 1) % property.images.length);
  };
  const prevImage = () => {
    if (property?.images?.length)
      setCurrentImageIndex(prev => (prev - 1 + property.images.length) % property.images.length);
  };

  // Opens the booking confirmation modal for a specific unit
  const handleBookUnit = (unit) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to book");
      navigate("/login");
      return;
    }
    // Reset dates when opening modal for a new unit
    setCheckIn("");
    setCheckOut("");
    setGuests(1);
    setBookingSuccess(false);
    setBookingUnit(unit);
  };

  // Submits the booking to the backend
  const confirmBooking = async () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      alert("Check-out date must be after check-in date");
      return;
    }

    try {
      setBookingSubmitting(true);
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          property: property._id || property.id,
          unit: bookingUnit._id || bookingUnit.id,
          checkIn,
          checkOut,
          guests,
          currency: displayCurrency,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Booking failed");
        return;
      }

      // Show success state inside modal instead of closing immediately
      setBookingSuccess(true);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to submit booking");
    } finally {
      setBookingSubmitting(false);
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
          <button onClick={() => navigate("/rentals")} className="text-orange-500 hover:underline">
            Back to Rentals
          </button>
        </div>
      </div>
    );
  }

  const images = property.images || [];
  const hasImages = images.length > 0;
  const isHostel = property.category === "hostel";
  const propertyCurrency = getCurrencyByCountry(property.country);

  // Calculate nights between check-in and check-out
  const nightCount = checkIn && checkOut
    ? Math.max(0, Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="min-h-screen bg-[#F7F5F2] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <HosteinNavbar />

      <main className="max-w-7xl mx-auto px-6 py-10 mt-16 font-body">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft size={20} /> Back
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
                  <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {property.category === "apartment" ? "Apartment" :
                   property.category === "hostel" ? "Hostel" : "Short Stay"}
                </span>
                {isHostel && property.hostelType && (
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    {property.hostelType.replace(/_/g, " ")}
                  </span>
                )}
              </div>
              <h1 className="font-display text-4xl font-bold text-gray-900 mb-3">{property.title}</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={18} />
                <span>{property.address}, {property.city}, {property.country}</span>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <StarRating value={reviewStats.avg} readonly size={18} />
                <span className="text-sm text-gray-600">
                  {reviewStats.avg.toFixed(1)} ({reviewStats.count} reviews)
                </span>
              </div>
            </div>

            {property.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About this place</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            )}

            {property.amenities?.length > 0 && (
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

            {isHostel && property.mealPlans?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <UtensilsCrossed size={20} /> Meal Plans Available
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.mealPlans.map((plan, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-4 bg-white">
                      <p className="font-semibold text-gray-900 mb-1">{plan.name.replace(/_/g, " ")}</p>
                      {plan.description && <p className="text-xs text-gray-500 mb-2">{plan.description}</p>}
                      <div className="flex gap-3 text-sm">
                        {plan.priceDaily && (
                          <span className="text-gray-600">
                            {formatAmount(plan.priceDaily, propertyCurrency)}/day
                          </span>
                        )}
                        {plan.priceMonthly && (
                          <span className="text-gray-600 font-semibold">
                            {formatAmount(plan.priceMonthly, propertyCurrency)}/month
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
                  <p className="text-sm text-gray-500">
                    {reviewStats.count} review{reviewStats.count !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500 fill-yellow-500" size={18} />
                  <span className="font-semibold text-gray-900">{reviewStats.avg.toFixed(1)}</span>
                </div>
              </div>

              {reviewsLoading ? (
                <div className="py-10 flex items-center justify-center">
                  <Loader2 className="animate-spin text-orange-500" />
                </div>
              ) : reviews.length === 0 ? (
                <p className="text-gray-500 text-sm italic">
                  No reviews yet. Reviews can only be left by guests who have completed their stay.
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <div key={review._id || review.id || index} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {review.user?.name || review.user?.fullName || review.userName || "Guest"}
                          </p>
                          <div className="mt-1">
                            <StarRating value={review.rating || 0} readonly size={15} />
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                        </span>
                      </div>

                      {review.comment && (
                        <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                      )}

                      {review.reply && (
                        <div className="mt-4 bg-orange-50 border border-orange-100 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-orange-700 mb-2">
                            <MessageCircle size={14} />
                            Host reply
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{review.reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write Review — only shown if user has a completed booking here */}
            {/* This section is intentionally NOT shown on the public page.
                Reviews are submitted from ClientBookings after stay is completed. */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 text-sm text-orange-800">
              <p className="font-semibold mb-1">✍️ Want to leave a review?</p>
              <p>
                Reviews can only be submitted by guests who have <strong>completed a stay</strong> at this property.
                Once your booking is marked as completed, you can leave your review from{" "}
                <button
                  onClick={() => navigate("/client/bookings")}
                  className="underline font-semibold hover:text-orange-900 transition"
                >
                  My Bookings
                </button>.
              </p>
            </div>

            {/* Available Units with currency conversion */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Available Units ({units.filter(u => !u.isOccupied).length})
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Show prices in:</span>
                  <CurrencySelector
                    value={displayCurrency}
                    onChange={setDisplayCurrency}
                  />
                </div>
              </div>

              {units.filter(u => !u.isOccupied).length === 0 ? (
                <p className="text-gray-500">No units available at the moment</p>
              ) : (
                <div className="space-y-3">
                  {units.filter(u => !u.isOccupied).map((unit) => (
                    <div key={unit._id} className="border border-gray-200 rounded-xl p-4 bg-white hover:border-orange-300 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">Unit {unit.unitNumber}</h4>
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
                              {formatAmount(unit.rentAmount, unit.currency || propertyCurrency)}
                            </span>
                            <span className="text-sm text-gray-500">/month</span>
                            {isHostel && unit.mealPlanCost > 0 && (
                              <span className="text-sm text-gray-600">
                                + {formatAmount(unit.mealPlanCost, unit.currency || propertyCurrency)} meals
                              </span>
                            )}
                          </div>

                          {isHostel && unit.totalMonthlyCost > unit.rentAmount && (
                            <p className="text-sm font-semibold text-blue-600 mt-1">
                              Total: {formatAmount(unit.totalMonthlyCost, unit.currency || propertyCurrency)}/month
                            </p>
                          )}
                        </div>

                        {/* Book Now button per unit */}
                        <button
                          onClick={() => handleBookUnit(unit)}
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

          {/* RIGHT: Info Card (no standalone booking form — booking happens per-unit) */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="mb-4">
                {property.rentType === "daily" && property.pricePerNight ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatAmount(property.pricePerNight, propertyCurrency)}
                    </span>
                    <span className="text-gray-600">/ night</span>
                  </div>
                ) : (
                  <span className="text-lg font-semibold text-gray-700">Monthly Rental</span>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Select a unit below to book</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>You won't be charged yet</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Free cancellation (subject to policy)</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm text-sm text-gray-600 space-y-2">
              <p className="font-semibold text-gray-800 text-base">📍 Location</p>
              <p>{property.address}</p>
              <p>{property.city}, {property.country}</p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Booking Confirmation Modal ──────────────────────────────────── */}
      {bookingUnit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">

            {/* Success state */}
            {bookingSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Submitted!</h3>
                <p className="text-gray-600 mb-2">
                  Your booking request for <strong>Unit {bookingUnit.unitNumber}</strong> at{" "}
                  <strong>{property.title}</strong> has been submitted.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  You'll be notified once the host confirms your booking. Track it under{" "}
                  <strong>My Bookings</strong>.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setBookingUnit(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
                  >
                    Stay Here
                  </button>
                  <button
                    onClick={() => navigate("/client/bookings")}
                    className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition"
                  >
                    My Bookings
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-bold text-gray-900">Confirm Booking</h3>
                  <button
                    onClick={() => setBookingUnit(null)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Property & unit summary */}
                <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-1 text-sm">
                  <p className="font-semibold text-gray-900">{property.title}</p>
                  <p className="text-gray-600">
                    Unit {bookingUnit.unitNumber} · {bookingUnit.unitType}
                  </p>
                  <p className="text-gray-600">
                    {property.city}, {property.country}
                  </p>
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatAmount(bookingUnit.rentAmount, bookingUnit.currency || propertyCurrency)}
                    </span>
                    <span className="text-gray-500 text-sm">/month</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Displayed in {displayCurrency} · original: {bookingUnit.currency || propertyCurrency}
                  </p>
                </div>

                {/* Date & guest inputs */}
                <div className="space-y-3 mb-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">
                        Check-in *
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={e => setCheckIn(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:border-orange-400 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">
                        Check-out *
                      </label>
                      <input
                        type="date"
                        value={checkOut}
                        min={checkIn || new Date().toISOString().split("T")[0]}
                        onChange={e => setCheckOut(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:border-orange-400 text-sm"
                      />
                    </div>
                  </div>

                  {nightCount > 0 && (
                    <p className="text-sm text-orange-600 font-medium">
                      {nightCount} night{nightCount > 1 ? "s" : ""}
                      {property.rentType === "daily" && property.pricePerNight && (
                        <span className="ml-1 text-gray-700">
                          · Total: {formatAmount(property.pricePerNight * nightCount, propertyCurrency)}
                        </span>
                      )}
                    </p>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Guests</label>
                    <select
                      value={guests}
                      onChange={e => setGuests(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:border-orange-400 text-sm"
                    >
                      {[1,2,3,4,5,6,7,8].map(n => (
                        <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className="text-xs text-gray-400 text-center mb-4">
                  You won't be charged yet. Booking is confirmed by the host.
                </p>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setBookingUnit(null)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmBooking}
                    disabled={bookingSubmitting || !checkIn || !checkOut}
                    className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition flex items-center justify-center gap-2"
                  >
                    {bookingSubmitting
                      ? <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                      : "Submit Booking"
                    }
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
