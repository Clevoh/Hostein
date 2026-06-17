import { useState, useEffect } from "react";
import {
  Calendar, MapPin, DollarSign, User, Trash2, CheckCircle,
  XCircle, Clock, MessageCircle, Star, Loader2, Send, Info, Plus,
} from "lucide-react";
import PropertyChatWindow from "../../components/chat/PropertyChatWindow";
import StarRating from "../../components/StarRating";

const STATUS = {
  pending:   { bg: "bg-yellow-50",  text: "text-yellow-700",  border: "border-yellow-100", icon: Clock },
  confirmed: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100",icon: CheckCircle },
  completed: { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-100",   icon: CheckCircle },
  cancelled: { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-100",    icon: XCircle },
};

const FILTERS = [
  { key: "all",       label: "All" },
  { key: "pending",   label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

export default function ClientBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [chatBooking, setChatBooking] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => { fetchBookings(); fetchCurrentUser(); }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/users/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setCurrentUserId(data._id || data.id);
    } catch {}
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/bookings/my-bookings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setBookings(data.success && Array.isArray(data.bookings) ? data.bookings : Array.isArray(data) ? data : []);
    } catch { setBookings([]); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this booking?")) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.ok) setBookings((prev) => prev.filter((b) => b._id !== id));
    else alert((await res.json()).message || "Failed to delete");
  };

  const handleSubmitReview = async () => {
    if (!reviewRating) { alert("Please select a rating"); return; }
    try {
      setSubmittingReview(true);
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({
          bookingId: reviewBooking._id,
          propertyId: reviewBooking.property?._id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Failed to submit review"); return; }
      setReviewBooking(null);
      setReviewRating(0);
      setReviewComment("");
      fetchBookings();
    } catch {} finally { setSubmittingReview(false); }
  };

  const filtered = bookings.filter((b) => filter === "all" || b.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-slate-700 animate-spin" />
          <p className="text-slate-500 text-sm">Loading bookings…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5 pb-8">
        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>My Bookings</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>View and manage your property bookings</p>
          </div>
          <button
            onClick={() => (window.location.href = "/rentals")}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-700 text-white rounded-xl font-medium text-sm transition shadow-sm"
          >
            <Plus size={15} /> Book Property
          </button>
        </div>

        {/* Review notice */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-700">
          <Info size={16} className="mt-0.5 flex-shrink-0 text-blue-500" />
          <p>Reviews can only be left for <strong>Completed</strong> bookings — after your stay has ended and been confirmed by the host.</p>
        </div>

        {/* ── FILTER TABS ── */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition ${
                filter === key
                  ? "bg-slate-900 text-white"
                  : "border hover:border-slate-300"
              }`}
              style={filter !== key ? { background: "var(--surface)", borderColor: "var(--border)", color: "var(--text2)" } : {}}
            >
              {label}
              <span className={`ml-1.5 text-xs ${filter === key ? "text-white/60" : ""}`}
                    style={filter !== key ? { color: "var(--text2)" } : {}}>
                ({key === "all" ? bookings.length : bookings.filter((b) => b.status === key).length})
              </span>
            </button>
          ))}
        </div>

        {/* ── BOOKING CARDS ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border rounded-2xl" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mb-4">
              <Calendar size={28} className="text-slate-300" />
            </div>
            <h3 className="font-bold mb-1" style={{ color: "var(--text)" }}>
              {filter === "all" ? "No bookings yet" : `No ${filter} bookings`}
            </h3>
            <p className="text-sm mb-5" style={{ color: "var(--text2)" }}>
              {filter === "all" ? "Browse properties and make your first booking" : ""}
            </p>
            <button
              onClick={() => (window.location.href = "/rentals")}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-700 transition"
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((booking) => {
              const s = STATUS[booking.status] || STATUS.pending;
              const StatusIcon = s.icon;
              const canReview = booking.status === "completed" && !booking.review;
              const reviewed = !!booking.review;

              return (
                <div
                  key={booking._id}
                  className="rounded-2xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-3 p-5 md:p-6">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate" style={{ color: "var(--text)" }}>
                        {booking.property?.title || "Property"}
                      </h3>
                      <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--text2)" }}>
                        <MapPin size={11} />
                        {booking.unit?.unitNumber ? `Unit ${booking.unit.unitNumber} · ` : ""}
                        {booking.property?.city || "Location"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
                        <StatusIcon size={11} />
                        <span className="capitalize">{booking.status}</span>
                      </span>
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Details row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-5 md:px-6 py-4 border-y" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
                    {[
                      { icon: Calendar, label: "Check-in",   value: fmt(booking.checkIn || booking.checkInDate) },
                      { icon: Calendar, label: "Check-out",  value: fmt(booking.checkOut || booking.checkOutDate) },
                      { icon: User,     label: "Guests",     value: booking.numberOfGuests || booking.guests || 1 },
                      { icon: DollarSign, label: "Total",    value: `${booking.amount || booking.totalPrice || 0} ${booking.currency || "RWF"}` },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-2">
                        <Icon size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium" style={{ color: "var(--text2)" }}>{label}</p>
                          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between flex-wrap gap-3 px-5 md:px-6 py-4">
                    <button
                      onClick={() => (window.location.href = `/property/${booking.property?._id}`)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View property →
                    </button>

                    <div className="flex items-center gap-2 flex-wrap">
                      {canReview && (
                        <button
                          onClick={() => { setReviewBooking(booking); setReviewRating(0); setReviewComment(""); }}
                          className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-100 rounded-xl font-medium text-xs transition"
                        >
                          <Star size={13} /> Leave Review
                        </button>
                      )}
                      {reviewed && (
                        <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-medium">
                          <Star size={13} className="fill-emerald-600" /> Reviewed
                        </div>
                      )}
                      {!canReview && !reviewed && booking.status !== "cancelled" && (
                        <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl text-xs cursor-not-allowed">
                          <Star size={13} /> Review after stay
                        </div>
                      )}
                      <button
                        onClick={() => setChatBooking(booking)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 rounded-xl font-medium text-xs transition"
                      >
                        <MessageCircle size={13} /> Message Host
                      </button>
                    </div>
                  </div>

                  {/* Existing review */}
                  {booking.review && (
                    <div className="mx-5 md:mx-6 mb-5 border rounded-xl p-4" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>Your review</p>
                        <StarRating value={booking.review.rating || 0} readonly size={13} />
                      </div>
                      <p className="text-sm" style={{ color: "var(--text2)" }}>{booking.review.comment}</p>
                      {booking.review.reply && (
                        <div className="mt-3 border rounded-xl p-3" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                          <p className="text-xs font-semibold text-blue-600 mb-1">Host reply</p>
                          <p className="text-sm" style={{ color: "var(--text)" }}>{booking.review.reply}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── CHAT ── */}
      {chatBooking && currentUserId && (
        <PropertyChatWindow
          booking={chatBooking}
          currentUserId={currentUserId}
          onClose={() => setChatBooking(null)}
        />
      )}

      {/* ── REVIEW MODAL ── */}
      {reviewBooking && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setReviewBooking(null)}
        >
          <div className="rounded-2xl p-6 max-w-md w-full shadow-2xl" style={{ background: "var(--surface)" }}>
            <h3 className="text-lg font-bold mb-1" style={{ color: "var(--text)" }}>Leave a Review</h3>
            <p className="text-sm mb-1" style={{ color: "var(--text2)" }}>{reviewBooking.property?.title}</p>
            <div className="flex items-center gap-1.5 text-xs mb-5" style={{ color: "var(--text2)" }}>
              <CheckCircle size={11} className="text-blue-400" />
              Verified stay · #{reviewBooking._id?.slice(-6).toUpperCase()}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Rating *</label>
                <StarRating value={reviewRating} onChange={setReviewRating} size={26} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>Your experience</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                  className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400 transition resize-none"
                  style={{
                    background: "var(--bg)",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                  placeholder="What did you love? What could be improved?"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setReviewBooking(null)}
                  className="flex-1 px-4 py-2.5 border rounded-xl text-sm font-medium hover:bg-slate-50 transition"
                  style={{ borderColor: "var(--border)", color: "var(--text)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={submittingReview || !reviewRating}
                  className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium text-sm transition flex items-center justify-center gap-2"
                >
                  {submittingReview ? <><Loader2 size={14} className="animate-spin" /> Submitting…</> : <><Send size={14} /> Submit</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}