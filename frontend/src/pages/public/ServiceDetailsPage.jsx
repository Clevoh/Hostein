import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Star,
  Check,
  Loader2,
  MessageCircle,
  Send,
} from "lucide-react";
import HosteinNavbar from "../../components/HosteinNavbar";
import CurrencySelector from "../../components/CurrencySelector";
import { formatPrice, getSavedCurrency, saveCurrency } from "../../utils/currency";
import StarRating from "../../components/StarRating";

const API_URL = import.meta.env.VITE_API_URL;
const DB_CURRENCY = "KES";

export default function ServiceDetailsPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [currency, setCurrency] = useState(getSavedCurrency());

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchService();
    fetchReviews();
  }, [serviceId]);

  const handleCurrencyChange = (code) => {
    saveCurrency(code);
    setCurrency(code);
  };

  const fetchService = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/service-offerings/${serviceId}`);
      const data = await res.json();
      setService(data?.service || data?.data || data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const res = await fetch(`${API_URL}/api/reviews/service/${serviceId}`);
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
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId,
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
      fetchReviews();
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Review submit error:", error);
      alert("Failed to submit review");
    } finally {
      setReviewSubmitting(false);
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

  const serviceImage = service.images?.[0]
    ? `${API_URL}${service.images[0]}`
    : service.image || null;

  return (
    <div className="min-h-screen bg-[#F7F5F2]">
      <HosteinNavbar />

      <main className="max-w-5xl mx-auto px-6 py-10 mt-20">
        {/* Back + Currency row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <CurrencySelector value={currency} onChange={handleCurrencyChange} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          {serviceImage && (
            <img
              src={serviceImage}
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

            <div className="flex items-center gap-3">
              <Star className="text-yellow-500" />
              <span>
                {reviewStats.avg.toFixed(1)} ({reviewStats.count} reviews)
              </span>
            </div>
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
                <div key={i} className="flex items-center gap-2 mb-2">
                  <Check size={16} className="text-green-600" />
                  {f}
                </div>
              ))}
            </div>
          )}

          {/* Reviews list */}
          <div className="mt-10 border-t pt-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">Reviews</h3>
                <p className="text-sm text-gray-500">
                  {reviewStats.count} review{reviewStats.count !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{reviewStats.avg.toFixed(1)}</span>
              </div>
            </div>

            {reviewsLoading ? (
              <div className="py-10 flex justify-center">
                <Loader2 className="animate-spin text-green-600" />
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={review._id || review.id || index} className="border rounded-xl p-4">
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
                      <div className="mt-4 bg-green-50 border border-green-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-green-700 mb-2">
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

          {/* Write review */}
          <div className="mt-10 border-t pt-8">
            <h3 className="text-xl font-semibold mb-4">Write a review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your rating</label>
                <StarRating value={reviewRating} onChange={setReviewRating} size={22} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                  placeholder="Share your experience..."
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="inline-flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-xl font-medium transition"
              >
                {reviewSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}