// src/pages/client/ClientServices_API.jsx
import { useState, useEffect } from "react";
import {
  Wrench, Clock, Calendar, CheckCircle, XCircle,
  Search, Filter, Star, ChevronRight, X, AlertTriangle,
  Loader2, Package, ArrowRight
} from "lucide-react";
import {
  getMyServices,
  cancelServiceBooking,
} from "../../services/serviceService";
import { formatPrice, getSavedCurrency, saveCurrency, CURRENCIES } from "../../utils/currency";
import CurrencySelector from "../../components/CurrencySelector";

const API_URL = "http://localhost:5000";
const DB_CURRENCY = "KES";

const CAT_META = {
  cleaning:   { emoji: "🧹", color: "#16a34a", bg: "rgba(22,163,74,0.08)"  },
  electrical: { emoji: "⚡", color: "#ca8a04", bg: "rgba(202,138,4,0.08)"  },
  plumbing:   { emoji: "🔧", color: "#2563eb", bg: "rgba(37,99,235,0.08)"  },
  carpentry:  { emoji: "🪵", color: "#ea580c", bg: "rgba(234,88,12,0.08)"  },
  painting:   { emoji: "🎨", color: "#db2777", bg: "rgba(219,39,119,0.08)" },
  gardening:  { emoji: "🌿", color: "#059669", bg: "rgba(5,150,105,0.08)"  },
  security:   { emoji: "🔒", color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
  other:      { emoji: "✦",  color: "#475569", bg: "rgba(71,85,105,0.08)"  },
};

const STATUS_META = {
  scheduled:   { label: "Scheduled",   color: "#2563eb", bg: "#eff6ff" },
  "in-progress":{ label: "In Progress", color: "#d97706", bg: "#fffbeb" },
  completed:   { label: "Completed",   color: "#16a34a", bg: "#f0fdf4" },
  cancelled:   { label: "Cancelled",   color: "#dc2626", bg: "#fef2f2" },
  pending:     { label: "Pending",     color: "#7c3aed", bg: "#f5f3ff" },
};

export default function ClientServices() {
  const [activeTab, setActiveTab]         = useState("browse");
  const [myServices, setMyServices]       = useState([]);
  const [available, setAvailable]         = useState([]);
  const [filtered, setFiltered]           = useState([]);
  const [loadingMy, setLoadingMy]         = useState(true);
  const [loadingAvail, setLoadingAvail]   = useState(true);
  const [search, setSearch]               = useState("");
  const [catFilter, setCatFilter]         = useState("all");
  const [currency, setCurrency]           = useState(getSavedCurrency);
  const [bookingService, setBookingService] = useState(null); // service being booked
  const [cancelTarget, setCancelTarget]   = useState(null);
  const [bookForm, setBookForm]           = useState({ date: "", time: "", notes: "" });
  const [submitting, setSubmitting]       = useState(false);
  const [toast, setToast]                 = useState(null);
  const [bookingsTab, setBookingsTab]     = useState("all");

  useEffect(() => { fetchMyServices(); fetchAvailable(); }, []);

  useEffect(() => {
    let list = available;
    if (catFilter !== "all") list = list.filter(s => (s.category || "other").toLowerCase() === catFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s => s.name?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q));
    }
    setFiltered(list);
  }, [available, catFilter, search]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMyServices = async () => {
    setLoadingMy(true);
    try {
      const data = await getMyServices();
      setMyServices(Array.isArray(data) ? data : []);
    } catch { setMyServices([]); }
    finally { setLoadingMy(false); }
  };

  // Fetch from the correct public offerings endpoint
  const fetchAvailable = async () => {
    setLoadingAvail(true);
    try {
      const res = await fetch(`${API_URL}/api/service-offerings/active`);
      const data = await res.json();
      setAvailable(Array.isArray(data) ? data : []);
    } catch { setAvailable([]); }
    finally { setLoadingAvail(false); }
  };

  const handleCurrencyChange = (code) => { saveCurrency(code); setCurrency(code); };

  const handleBook = async () => {
    if (!bookForm.date || !bookForm.time) { showToast("Please select a date and time.", "error"); return; }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/services/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          serviceOffering: bookingService._id,
          serviceType: bookingService.name,
          provider: bookingService.provider?._id || bookingService.provider,
          description: bookingService.description,
          scheduledDate: bookForm.date,
          scheduledTime: bookForm.time,
          price: bookingService.price,
          duration: bookingService.duration,
          category: bookingService.category,
          notes: bookForm.notes,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Booking failed");
      }
      showToast(`"${bookingService.name}" booked successfully!`);
      setBookingService(null);
      setBookForm({ date: "", time: "", notes: "" });
      fetchMyServices();
      setActiveTab("bookings");
    } catch (e) {
      showToast(e.message || "Failed to book service.", "error");
    } finally { setSubmitting(false); }
  };

  const handleCancel = async () => {
    try {
      await cancelServiceBooking(cancelTarget._id);
      showToast("Service booking cancelled.");
      setCancelTarget(null);
      fetchMyServices();
    } catch (e) {
      showToast("Failed to cancel booking.", "error");
      setCancelTarget(null);
    }
  };

  const filteredBookings = myServices.filter(s => bookingsTab === "all" || s.status === bookingsTab);
  const cats = ["all", ...Object.keys(CAT_META)];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');

        .cs * { box-sizing: border-box; margin: 0; padding: 0; }
        .cs { font-family: 'Outfit', sans-serif; color: #111; }

        /* HEADER */
        .cs-hdr { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 14px; }
        .cs-eyebrow { font-size: 10.5px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #16a34a; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
        .cs-eyebrow::before { content:''; width:20px; height:1.5px; background:#16a34a; display:block; }
        .cs-h1 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(26px,3.5vw,36px); font-weight: 900; line-height: 1.08; letter-spacing: -0.022em; }
        .cs-h1 em { font-style: italic; color: #16a34a; }

        /* TAB BAR */
        .cs-tabs { display: flex; gap: 4px; background: #f5f5f2; border-radius: 12px; padding: 4px; margin-bottom: 28px; width: fit-content; }
        .cs-tab { padding: 9px 20px; border-radius: 9px; border: none; background: none; font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 600; cursor: pointer; color: #888; transition: all 0.18s; white-space: nowrap; }
        .cs-tab.active { background: #fff; color: #111; box-shadow: 0 1px 6px rgba(0,0,0,0.1); }
        .cs-tab-badge { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; background: #16a34a; color: #fff; font-size: 10px; font-weight: 700; margin-left: 6px; }

        /* SEARCH + FILTER ROW */
        .cs-toolbar { display: flex; gap: 12px; margin-bottom: 22px; flex-wrap: wrap; align-items: center; }
        .cs-search-wrap { position: relative; flex: 1; min-width: 220px; }
        .cs-search-ico { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #bbb; pointer-events: none; }
        .cs-search { width: 100%; padding: 11px 14px 11px 38px; border: 1.5px solid #e4e4e0; border-radius: 11px; font-size: 14px; font-family: 'Outfit', sans-serif; background: #fafaf8; outline: none; color: #111; transition: border-color 0.15s; }
        .cs-search:focus { border-color: #0d0d0d; background: #fff; }
        .cs-search::placeholder { color: #ccc; font-weight: 300; }

        .cs-cats { display: flex; gap: 7px; flex-wrap: wrap; }
        .cs-cat-btn { padding: 7px 14px; border-radius: 100px; border: 1.5px solid #e4e4e0; background: #fff; font-family: 'Outfit', sans-serif; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: all 0.15s; color: #555; white-space: nowrap; }
        .cs-cat-btn:hover { border-color: #aaa; }
        .cs-cat-btn.active { background: #0d0d0d; color: #fff; border-color: #0d0d0d; }

        /* AVAILABLE GRID */
        .cs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(288px, 1fr)); gap: 20px; }

        .cs-avail-card {
          background: #fff; border-radius: 18px; border: 1px solid #e8e8e4;
          overflow: hidden; display: flex; flex-direction: column;
          transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
          animation: cardIn 0.4s ease both;
        }
        .cs-avail-card:hover { transform: translateY(-4px); box-shadow: 0 14px 36px rgba(0,0,0,0.09); border-color: #d0d0cc; }
        @keyframes cardIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }

        .cs-avail-img { position: relative; height: 180px; overflow: hidden; background: #f2f1ee; flex-shrink: 0; }
        .cs-avail-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; display: block; }
        .cs-avail-card:hover .cs-avail-img img { transform: scale(1.06); }
        .cs-avail-no-img { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(145deg,#f5f4f0,#ebebE7); }
        .cs-avail-no-img span:first-child { font-size: 40px; line-height: 1; }

        .cs-avail-cat { position: absolute; bottom: 10px; left: 10px; display: inline-flex; align-items: center; gap: 5px; padding: 4px 11px; border-radius: 100px; font-size: 10.5px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.4); }

        .cs-avail-body { padding: 18px 20px 16px; display: flex; flex-direction: column; flex: 1; }
        .cs-avail-name { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: #0d0d0d; margin-bottom: 7px; line-height: 1.2; }
        .cs-avail-desc { font-size: 13px; color: #888; line-height: 1.6; font-weight: 300; flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 14px; }

        .cs-avail-meta { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-top: 1px solid #f0f0ec; border-bottom: 1px solid #f0f0ec; margin-bottom: 14px; }
        .cs-avail-price { font-size: 18px; font-weight: 700; color: #0d0d0d; }
        .cs-avail-dur { display: flex; align-items: center; gap: 5px; font-size: 12.5px; color: #aaa; font-weight: 400; }

        .cs-provider { display: flex; align-items: center; gap: 6px; margin-bottom: 14px; font-size: 12.5px; color: #999; font-weight: 400; }
        .cs-provider-dot { width: 24px; height: 24px; border-radius: 50%; background: #e8f5ee; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }

        .cs-book-btn { width: 100%; padding: 12px; background: #0d0d0d; color: #fff; border: none; border-radius: 11px; font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s, transform 0.15s; }
        .cs-book-btn:hover { background: #16a34a; }
        .cs-book-btn:active { transform: scale(0.99); }

        /* BOOKINGS LIST */
        .cs-booking-tabs { display: flex; gap: 4px; margin-bottom: 20px; }
        .cs-b-tab { padding: 7px 16px; border-radius: 8px; border: 1.5px solid #e4e4e0; background: #fff; font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; color: #888; transition: all 0.15s; }
        .cs-b-tab.active { background: #0d0d0d; color: #fff; border-color: #0d0d0d; }

        .cs-booking-card { background: #fff; border: 1px solid #e8e8e4; border-radius: 16px; padding: 20px 22px; margin-bottom: 14px; transition: box-shadow 0.2s; }
        .cs-booking-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.07); }
        .cs-booking-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; gap: 12px; flex-wrap: wrap; }
        .cs-booking-name { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: #0d0d0d; margin-bottom: 3px; }
        .cs-booking-cat { font-size: 12.5px; color: #aaa; font-weight: 400; }
        .cs-status-badge { display: inline-flex; align-items: center; padding: 5px 12px; border-radius: 100px; font-size: 12px; font-weight: 700; white-space: nowrap; }
        .cs-booking-info { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; padding: 14px 0; border-top: 1px solid #f5f5f2; border-bottom: 1px solid #f5f5f2; margin-bottom: 14px; }
        .cs-info-label { font-size: 10.5px; color: #bbb; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
        .cs-info-val { font-size: 14px; font-weight: 600; color: #222; display: flex; align-items: center; gap: 5px; }
        .cs-booking-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .cs-action-btn { padding: 8px 16px; border-radius: 9px; font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; border: 1.5px solid; transition: all 0.15s; }
        .cs-action-cancel { color: #dc2626; border-color: #fca5a5; background: #fff; }
        .cs-action-cancel:hover { background: #fef2f2; border-color: #dc2626; }

        /* EMPTY */
        .cs-empty { text-align: center; padding: 64px 20px; }
        .cs-empty-icon { font-size: 56px; margin-bottom: 16px; }
        .cs-empty-h { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #222; margin-bottom: 8px; }
        .cs-empty-p { color: #aaa; font-size: 14px; font-weight: 300; }
        .cs-empty-btn { margin-top: 20px; display: inline-flex; align-items: center; gap: 8px; padding: 11px 22px; background: #0d0d0d; color: #fff; border: none; border-radius: 100px; font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 14px; cursor: pointer; transition: background 0.2s; }
        .cs-empty-btn:hover { background: #16a34a; }

        /* SHIMMER */
        .cs-shim { background: linear-gradient(90deg,#f2f1ee 25%,#e8e7e3 50%,#f2f1ee 75%); background-size:300% 100%; animation:shim 1.7s infinite; border-radius:10px; }
        @keyframes shim { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .cs-skel { background:#fff; border-radius:18px; border:1px solid #e8e8e4; overflow:hidden; }

        /* MODAL OVERLAY */
        .cs-overlay { position:fixed; inset:0; background:rgba(8,8,6,0.65); backdrop-filter:blur(10px); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px; animation:ov 0.18s ease; }
        @keyframes ov { from{opacity:0} to{opacity:1} }
        .cs-modal { background:#fff; border-radius:22px; width:100%; max-width:500px; max-height:90vh; overflow-y:auto; box-shadow:0 40px 100px rgba(0,0,0,0.25); animation:mIn 0.28s cubic-bezier(0.34,1.56,0.64,1); scrollbar-width:none; }
        .cs-modal::-webkit-scrollbar { display:none; }
        @keyframes mIn { from{opacity:0;transform:translateY(20px) scale(0.96)} to{opacity:1;transform:none} }

        .cs-modal-hdr { padding:26px 26px 20px; border-bottom:1px solid #f0f0ec; display:flex; justify-content:space-between; align-items:flex-start; position:sticky; top:0; background:#fff; z-index:2; }
        .cs-modal-eyebrow { font-size:10px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:#16a34a; margin-bottom:4px; }
        .cs-modal-title { font-family:'Playfair Display',serif; font-size:22px; font-weight:900; color:#0d0d0d; line-height:1.1; }
        .cs-modal-x { width:32px; height:32px; border-radius:50%; background:#f3f2ef; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#555; transition:background 0.15s,color 0.15s; flex-shrink:0; }
        .cs-modal-x:hover { background:#0d0d0d; color:#fff; }

        .cs-modal-body { padding:22px 26px 28px; display:flex; flex-direction:column; gap:18px; }

        /* Service summary card inside modal */
        .cs-modal-svc { background:#fafaf8; border:1px solid #eeede9; border-radius:14px; padding:16px; display:flex; align-items:flex-start; gap:14px; }
        .cs-modal-svc-img { width:64px; height:64px; border-radius:10px; object-fit:cover; flex-shrink:0; }
        .cs-modal-svc-no-img { width:64px; height:64px; border-radius:10px; background:#eeede9; display:flex; align-items:center; justify-content:center; font-size:28px; flex-shrink:0; }
        .cs-modal-svc-name { font-family:'Playfair Display',serif; font-size:16px; font-weight:700; color:#0d0d0d; margin-bottom:4px; }
        .cs-modal-svc-meta { font-size:13px; color:#888; font-weight:300; }
        .cs-modal-svc-price { font-size:17px; font-weight:700; color:#16a34a; margin-top:6px; }

        .cs-flbl { font-size:10.5px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:#555; margin-bottom:7px; display:block; }
        .cs-finp, .cs-fsel, .cs-fta { width:100%; padding:11px 14px; border:1.5px solid #e4e4e0; border-radius:11px; font-size:14px; font-family:'Outfit',sans-serif; color:#111; background:#fafaf8; outline:none; transition:border-color 0.15s; -webkit-appearance:none; }
        .cs-finp:focus, .cs-fsel:focus, .cs-fta:focus { border-color:#0d0d0d; background:#fff; }
        .cs-fta { resize:vertical; min-height:80px; line-height:1.6; }
        .cs-2col { display:grid; grid-template-columns:1fr 1fr; gap:13px; }

        .cs-confirm-btn { width:100%; padding:14px; background:#16a34a; color:#fff; border:none; border-radius:12px; font-family:'Outfit',sans-serif; font-weight:700; font-size:15px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:background 0.2s; }
        .cs-confirm-btn:hover:not(:disabled) { background:#15803d; }
        .cs-confirm-btn:disabled { opacity:0.5; cursor:not-allowed; }

        /* CONFIRM DELETE */
        .cs-cfm { background:#fff; border-radius:20px; padding:32px; width:100%; max-width:360px; text-align:center; box-shadow:0 28px 70px rgba(0,0,0,0.2); animation:mIn 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .cs-cfm-ico { width:54px; height:54px; background:#fef2f2; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; color:#dc2626; }
        .cs-cfm-h { font-family:'Playfair Display',serif; font-size:21px; font-weight:700; margin-bottom:8px; }
        .cs-cfm-p { color:#999; font-size:13.5px; font-weight:300; line-height:1.65; margin-bottom:22px; }
        .cs-cfm-btns { display:flex; gap:10px; }
        .cs-cfm-no { flex:1; padding:11px; border:1.5px solid #e4e4e0; border-radius:10px; background:#fff; font-family:'Outfit',sans-serif; font-size:14px; font-weight:500; cursor:pointer; color:#555; transition:background 0.15s; }
        .cs-cfm-no:hover { background:#f5f5f2; }
        .cs-cfm-yes { flex:1; padding:11px; background:#dc2626; color:#fff; border:none; border-radius:10px; font-family:'Outfit',sans-serif; font-size:14px; font-weight:700; cursor:pointer; transition:background 0.15s; }
        .cs-cfm-yes:hover { background:#b91c1c; }

        /* TOAST */
        .cs-toast { position:fixed; bottom:28px; right:28px; z-index:99999; padding:14px 20px; border-radius:14px; font-family:'Outfit',sans-serif; font-size:14px; font-weight:600; box-shadow:0 8px 28px rgba(0,0,0,0.15); animation:toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1); display:flex; align-items:center; gap:10px; max-width:360px; }
        @keyframes toastIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        .cs-toast.success { background:#0d0d0d; color:#fff; }
        .cs-toast.error { background:#dc2626; color:#fff; }
      `}</style>

      {/* TOAST */}
      {toast && (
        <div className={`cs-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="cs">
        {/* HEADER */}
        <div className="cs-hdr">
          <div>
            <div className="cs-eyebrow">Client Portal</div>
            <h1 className="cs-h1">Browse & <em>Book</em> Services</h1>
          </div>
          <CurrencySelector value={currency} onChange={handleCurrencyChange} />
        </div>

        {/* MAIN TABS */}
        <div className="cs-tabs">
          <button className={`cs-tab ${activeTab === "browse" ? "active" : ""}`} onClick={() => setActiveTab("browse")}>
            Browse Services
          </button>
          <button className={`cs-tab ${activeTab === "bookings" ? "active" : ""}`} onClick={() => setActiveTab("bookings")}>
            My Bookings
            {myServices.length > 0 && <span className="cs-tab-badge">{myServices.length}</span>}
          </button>
        </div>

        {/* ── BROWSE TAB ── */}
        {activeTab === "browse" && (
          <>
            {/* Toolbar */}
            <div className="cs-toolbar">
              <div className="cs-search-wrap">
                <Search size={15} className="cs-search-ico" />
                <input
                  className="cs-search"
                  placeholder="Search services…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Category pills */}
            <div className="cs-cats" style={{ marginBottom: 22 }}>
              {cats.map(c => (
                <button
                  key={c}
                  className={`cs-cat-btn ${catFilter === c ? "active" : ""}`}
                  onClick={() => setCatFilter(c)}
                >
                  {c === "all" ? "✦ All" : `${CAT_META[c]?.emoji} ${c.charAt(0).toUpperCase() + c.slice(1)}`}
                </button>
              ))}
            </div>

            {/* Grid */}
            {loadingAvail ? (
              <div className="cs-grid">
                {[1,2,3].map(i => (
                  <div key={i} className="cs-skel">
                    <div className="cs-shim" style={{ height: 180, borderRadius: 0 }} />
                    <div style={{ padding: "18px 20px" }}>
                      <div className="cs-shim" style={{ height: 20, width: "60%", marginBottom: 10 }} />
                      <div className="cs-shim" style={{ height: 13, width: "85%", marginBottom: 6 }} />
                      <div className="cs-shim" style={{ height: 13, width: "65%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="cs-empty">
                <div className="cs-empty-icon">🔍</div>
                <h3 className="cs-empty-h">No services found</h3>
                <p className="cs-empty-p">Try adjusting your search or category filter.</p>
              </div>
            ) : (
              <div className="cs-grid">
                {filtered.map((s, i) => {
                  const cat  = (s.category || "other").toLowerCase();
                  const meta = CAT_META[cat] || CAT_META.other;
                  return (
                    <div key={s._id} className="cs-avail-card" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className="cs-avail-img">
                        {s.images?.length > 0
                          ? <img src={`${API_URL}${s.images[0]}`} alt={s.name} />
                          : <div className="cs-avail-no-img"><span>{meta.emoji}</span></div>
                        }
                        <span className="cs-avail-cat" style={{ color: meta.color, background: meta.bg }}>
                          {meta.emoji} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </span>
                      </div>

                      <div className="cs-avail-body">
                        <h3 className="cs-avail-name">{s.name}</h3>
                        <p className="cs-avail-desc">{s.description}</p>

                        {s.provider?.name && (
                          <div className="cs-provider">
                            <div className="cs-provider-dot">👤</div>
                            by {s.provider.name}
                          </div>
                        )}

                        <div className="cs-avail-meta">
                          <span className="cs-avail-price">{formatPrice(s.price, currency, DB_CURRENCY)}</span>
                          {s.duration && (
                            <span className="cs-avail-dur">
                              <Clock size={12} /> {s.duration}
                            </span>
                          )}
                        </div>

                        <button className="cs-book-btn" onClick={() => { setBookingService(s); setBookForm({ date: "", time: "", notes: "" }); }}>
                          Book Now <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── BOOKINGS TAB ── */}
        {activeTab === "bookings" && (
          <>
            <div className="cs-booking-tabs">
              {["all", "scheduled", "in-progress", "completed", "cancelled"].map(t => (
                <button key={t} className={`cs-b-tab ${bookingsTab === t ? "active" : ""}`} onClick={() => setBookingsTab(t)}>
                  {t === "all" ? "All" : STATUS_META[t]?.label || t}
                </button>
              ))}
            </div>

            {loadingMy ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
                <Loader2 size={32} color="#16a34a" style={{ animation: "spin 1s linear infinite" }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="cs-empty">
                <div className="cs-empty-icon">📋</div>
                <h3 className="cs-empty-h">No bookings yet</h3>
                <p className="cs-empty-p">Browse available services and book your first one.</p>
                <button className="cs-empty-btn" onClick={() => setActiveTab("browse")}>
                  Browse Services <ArrowRight size={15} />
                </button>
              </div>
            ) : (
              filteredBookings.map(b => {
                const st   = b.status || "scheduled";
                const smeta = STATUS_META[st] || STATUS_META.scheduled;
                const cat  = (b.category || "other").toLowerCase();
                const cmeta = CAT_META[cat] || CAT_META.other;
                return (
                  <div key={b._id} className="cs-booking-card">
                    <div className="cs-booking-top">
                      <div>
                        <div className="cs-booking-name">{b.serviceType}</div>
                        <div className="cs-booking-cat">{cmeta.emoji} {cat.charAt(0).toUpperCase() + cat.slice(1)}</div>
                      </div>
                      <span className="cs-status-badge" style={{ color: smeta.color, background: smeta.bg }}>
                        {smeta.label}
                      </span>
                    </div>

                    <div className="cs-booking-info">
                      <div>
                        <div className="cs-info-label">Date</div>
                        <div className="cs-info-val"><Calendar size={13} color="#bbb" />{new Date(b.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                      </div>
                      <div>
                        <div className="cs-info-label">Time</div>
                        <div className="cs-info-val"><Clock size={13} color="#bbb" />{b.scheduledTime}</div>
                      </div>
                      <div>
                        <div className="cs-info-label">Price</div>
                        <div className="cs-info-val">{formatPrice(b.price, currency, DB_CURRENCY)}</div>
                      </div>
                      {b.duration && (
                        <div>
                          <div className="cs-info-label">Duration</div>
                          <div className="cs-info-val">{b.duration}</div>
                        </div>
                      )}
                    </div>

                    {b.status === "scheduled" && (
                      <div className="cs-booking-actions">
                        <button className="cs-action-btn cs-action-cancel" onClick={() => setCancelTarget(b)}>
                          Cancel Booking
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}
      </div>

      {/* ── BOOKING MODAL ── */}
      {bookingService && (
        <div className="cs-overlay" onClick={e => e.target === e.currentTarget && setBookingService(null)}>
          <div className="cs-modal">
            <div className="cs-modal-hdr">
              <div>
                <div className="cs-modal-eyebrow">Book Service</div>
                <div className="cs-modal-title">{bookingService.name}</div>
              </div>
              <button className="cs-modal-x" onClick={() => setBookingService(null)}><X size={15} /></button>
            </div>

            <div className="cs-modal-body">
              {/* Service summary */}
              <div className="cs-modal-svc">
                {bookingService.images?.length > 0
                  ? <img src={`${API_URL}${bookingService.images[0]}`} className="cs-modal-svc-img" alt={bookingService.name} />
                  : <div className="cs-modal-svc-no-img">{CAT_META[(bookingService.category||"other").toLowerCase()]?.emoji || "✦"}</div>
                }
                <div>
                  <div className="cs-modal-svc-name">{bookingService.name}</div>
                  <div className="cs-modal-svc-meta">{bookingService.description}</div>
                  <div className="cs-modal-svc-price">{formatPrice(bookingService.price, currency, DB_CURRENCY)}</div>
                </div>
              </div>

              <div className="cs-2col">
                <div>
                  <label className="cs-flbl">Preferred Date</label>
                  <input
                    className="cs-finp" type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={bookForm.date}
                    onChange={e => setBookForm({ ...bookForm, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="cs-flbl">Preferred Time</label>
                  <select className="cs-fsel" value={bookForm.time} onChange={e => setBookForm({ ...bookForm, time: e.target.value })}>
                    <option value="">Select time</option>
                    {["08:00 AM","09:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="cs-flbl">Additional Notes (Optional)</label>
                <textarea
                  className="cs-fta"
                  placeholder="Any specific requirements or instructions…"
                  value={bookForm.notes}
                  onChange={e => setBookForm({ ...bookForm, notes: e.target.value })}
                />
              </div>

              <button className="cs-confirm-btn" onClick={handleBook} disabled={submitting}>
                {submitting ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Booking…</> : <>Confirm Booking <CheckCircle size={16} /></>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CANCEL CONFIRM ── */}
      {cancelTarget && (
        <div className="cs-overlay" onClick={e => e.target === e.currentTarget && setCancelTarget(null)}>
          <div className="cs-cfm">
            <div className="cs-cfm-ico"><AlertTriangle size={22} /></div>
            <h3 className="cs-cfm-h">Cancel booking?</h3>
            <p className="cs-cfm-p"><strong>"{cancelTarget.serviceType}"</strong> booking will be cancelled. This action cannot be undone.</p>
            <div className="cs-cfm-btns">
              <button className="cs-cfm-no" onClick={() => setCancelTarget(null)}>Keep it</button>
              <button className="cs-cfm-yes" onClick={handleCancel}>Yes, cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
