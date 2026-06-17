import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Clock, ImageIcon, AlertTriangle } from "lucide-react";
import CurrencySelector from "../../components/CurrencySelector";
import { formatPrice, getSavedCurrency, saveCurrency, CURRENCIES } from "../../utils/currency";

const API_URL = import.meta.env.VITE_API_URL;

// The currency your DB stores prices in (change if needed)
const DB_CURRENCY = "KES";

const CATEGORIES = [
  "cleaning", "electrical", "plumbing", "carpentry",
  "painting", "gardening", "security", "other"
];

const CAT_META = {
  cleaning:   { emoji: "🧹", color: "#16a34a", bg: "rgba(22,163,74,0.1)" },
  electrical: { emoji: "⚡", color: "#ca8a04", bg: "rgba(202,138,4,0.1)" },
  plumbing:   { emoji: "🔧", color: "#2563eb", bg: "rgba(37,99,235,0.1)" },
  carpentry:  { emoji: "🪵", color: "#ea580c", bg: "rgba(234,88,12,0.1)" },
  painting:   { emoji: "🎨", color: "#db2777", bg: "rgba(219,39,119,0.1)" },
  gardening:  { emoji: "🌿", color: "#059669", bg: "rgba(5,150,105,0.1)" },
  security:   { emoji: "🔒", color: "#7c3aed", bg: "rgba(124,58,237,0.1)" },
  other:      { emoji: "✦",  color: "#475569", bg: "rgba(71,85,105,0.1)" },
};

export default function MyServicesPage() {
  const [services, setServices]     = useState([]);
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState(null);
  const [deleting, setDeleting]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currency, setCurrency]     = useState(getSavedCurrency);

  const [form, setForm] = useState({
    name: "", category: "cleaning", description: "",
    price: "", duration: "", isActive: true, image: null,
  });

  useEffect(() => { fetchServices(); }, []);

  const handleCurrencyChange = (code) => {
    saveCurrency(code);
    setCurrency(code);
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/service-offerings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch { setServices([]); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditing(null); setPreviewUrl(null);
    setForm({ name: "", category: "cleaning", description: "", price: "", duration: "", isActive: true, image: null });
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setPreviewUrl(s.images?.length > 0 ? `${API_URL}${s.images[0]}` : null);
    setForm({ name: s.name, category: s.category || "cleaning", description: s.description, price: s.price, duration: s.duration || "", isActive: s.isActive, image: null });
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setForm({ ...form, image: file }); setPreviewUrl(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    const fd = new FormData();
    Object.keys(form).forEach(k => { if (form[k] !== null && form[k] !== undefined) fd.append(k, form[k]); });
    await fetch(
      editing ? `${API_URL}/api/service-offerings/${editing._id}` : `${API_URL}/api/service-offerings`,
      { method: editing ? "PUT" : "POST", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, body: fd }
    );
    setSaving(false); setShowModal(false); setEditing(null); setPreviewUrl(null);
    fetchServices();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/api/service-offerings/${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setDeleting(null); fetchServices();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');

        .ms * { box-sizing: border-box; margin: 0; padding: 0; }
        .ms { font-family: 'Outfit', sans-serif; color: #111; }

        .ms-hdr {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 40px; padding-bottom: 28px;
          border-bottom: 1px solid #e4e4e0; flex-wrap: wrap; gap: 16px;
        }
        .ms-hdr-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
        .ms-eyebrow {
          font-size: 10.5px; font-weight: 700; letter-spacing: 0.22em;
          text-transform: uppercase; color: #16a34a; margin-bottom: 8px;
          display: flex; align-items: center; gap: 10px;
        }
        .ms-eyebrow::before { content: ''; display: block; width: 24px; height: 1.5px; background: #16a34a; }
        .ms-h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(28px, 4vw, 40px); font-weight: 900;
          line-height: 1.05; letter-spacing: -0.025em; color: #0d0d0d;
        }
        .ms-h1 em { font-style: italic; color: #16a34a; }
        .ms-sub { font-size: 13px; color: #999; margin-top: 7px; font-weight: 400; }

        .ms-add {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 12px 22px; background: #0d0d0d; color: #fff;
          border: none; border-radius: 100px; cursor: pointer;
          font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 14px;
          letter-spacing: 0.01em; transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(0,0,0,0.14); white-space: nowrap;
        }
        .ms-add:hover { background: #16a34a; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(22,163,74,0.3); }
        .ms-add-ico { width: 22px; height: 22px; border-radius: 50%; background: rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        /* currency note */
        .ms-currency-note {
          font-size: 11.5px; color: #aaa; font-weight: 400;
          display: flex; align-items: center; gap: 5px; margin-bottom: 20px;
        }
        .ms-currency-note strong { color: #666; font-weight: 600; }

        .ms-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 22px; }

        .ms-card {
          background: var(--card-bg); color: var(--text); border-radius: 18px; border: 1px solid var(--card-border);
          overflow: hidden; display: flex; flex-direction: column;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s;
          animation: cardIn 0.45s ease both;
        }
        .ms-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); border-color: #d0d0cc; }
        @keyframes cardIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .ms-card:nth-child(1){animation-delay:0.04s}.ms-card:nth-child(2){animation-delay:0.09s}
        .ms-card:nth-child(3){animation-delay:0.14s}.ms-card:nth-child(4){animation-delay:0.19s}
        .ms-card:nth-child(5){animation-delay:0.24s}.ms-card:nth-child(6){animation-delay:0.29s}

        .ms-card-img { position: relative; height: 195px; overflow: hidden; background: #f2f1ee; flex-shrink: 0; }
        .ms-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
        .ms-card:hover .ms-card-img img { transform: scale(1.07); }
        .ms-no-img { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(145deg, #f5f4f0, #ebebE7); }
        .ms-no-img span:first-child { font-size: 42px; line-height: 1; }
        .ms-no-img-lbl { font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase; color: #bbb; font-weight: 500; }

        .ms-cat { position: absolute; bottom: 12px; left: 12px; display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 100px; font-size: 11px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; backdrop-filter: blur(12px) saturate(1.8); border: 1px solid rgba(255,255,255,0.45); }

        .ms-card-body { padding: 20px 22px 18px; display: flex; flex-direction: column; flex: 1; }
        .ms-card-name { font-family: 'Playfair Display', Georgia, serif; font-size: 19px; font-weight: 700; color: #0d0d0d; line-height: 1.25; letter-spacing: -0.01em; margin-bottom: 8px; }
        .ms-card-desc { font-size: 13.5px; color: #888; line-height: 1.65; font-weight: 300; flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 16px; }

        .ms-meta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; padding: 13px 0; border-top: 1px solid #f0f0ec; border-bottom: 1px solid #f0f0ec; margin-bottom: 14px; }
        .ms-meta-item { display: flex; align-items: center; gap: 6px; font-size: 13.5px; color: #444; font-weight: 500; }
        .ms-price-val { font-size: 17px; font-weight: 700; color: #0d0d0d; }
        .ms-sep { width: 1px; height: 14px; background: #e4e4e0; }

        .ms-actions { display: flex; gap: 8px; justify-content: flex-end; }
        .ms-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 15px; border-radius: 9px; font-family: 'Outfit', sans-serif; font-size: 12.5px; font-weight: 600; cursor: pointer; border: 1px solid; transition: all 0.15s; }
        .ms-btn-edit { color: #444; border-color: #e0e0dc; background: #fafaf8; }
        .ms-btn-edit:hover { border-color: #0d0d0d; color: #0d0d0d; background: #f3f3f0; }
        .ms-btn-del { color: #c0392b; border-color: #fac8c5; background: #fff8f8; }
        .ms-btn-del:hover { background: #fff0ef; border-color: #c0392b; }

        .ms-skel { background: var(--card-bg); border-radius: 18px; border: 1px solid var(--card-border); }
        .ms-shim { background: linear-gradient(90deg,#f2f1ee 25%,#e8e7e3 50%,#f2f1ee 75%); background-size: 300% 100%; animation: shim 1.7s infinite; }
        @keyframes shim { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        .ms-empty { grid-column:1/-1; text-align:center; padding:80px 20px; }
        .ms-empty-glyph { font-family:'Playfair Display',serif; font-style:italic; font-size:90px; color:#e8e7e3; line-height:1; margin-bottom:20px; }
        .ms-empty-h { font-family:'Playfair Display',serif; font-size:26px; font-weight:700; color:#222; margin-bottom:8px; }
        .ms-empty-p { color:#aaa; font-size:14px; font-weight:300; }

        .ms-overlay { position:fixed; inset:0; background:rgba(8,8,6,0.65); backdrop-filter:blur(10px); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px; animation:ov 0.18s ease; }
        @keyframes ov { from{opacity:0} to{opacity:1} }

        .ms-modal { background: var(--card-bg); color: var(--text); }
        .ms-modal::-webkit-scrollbar { display:none; }
        @keyframes mIn { from{opacity:0;transform:translateY(22px) scale(0.96)} to{opacity:1;transform:none} }

        .ms-modal-hdr { background: var(--card-bg); border-bottom:1px solid var(--card-border); }
        .ms-modal-eyebrow { font-size:10px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:#16a34a; margin-bottom:5px; }
        .ms-modal-title { font-family:'Playfair Display',serif; font-size:24px; font-weight:900; color:#0d0d0d; line-height:1.1; }
        .ms-modal-x { width:34px; height:34px; border-radius:50%; background:#f3f2ef; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#555; flex-shrink:0; margin-top:2px; transition:background 0.15s,color 0.15s; }
        .ms-modal-x:hover { background:#0d0d0d; color:#fff; }

        .ms-form { padding:24px 28px 30px; display:flex; flex-direction:column; gap:20px; }
        .ms-lbl { display:block; font-size:10.5px; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; color:#555; margin-bottom:7px; }
        .ms-inp,.ms-ta,.ms-sel { width:100%; padding:12px 16px; border:1.5px solid #e4e4e0; border-radius:11px; font-size:14.5px; font-family:'Outfit',sans-serif; font-weight:400; color:#111; background:#fafaf8; outline:none; transition:border-color 0.15s,background 0.15s; -webkit-appearance:none; }
        .ms-inp:focus,.ms-ta:focus,.ms-sel:focus { border-color: var(--accent); background: var(--surface); }
        .ms-inp::placeholder,.ms-ta::placeholder { color:#c0c0bc; font-weight:300; }
        .ms-ta { resize:vertical; min-height:88px; line-height:1.6; }
        .ms-2col { display:grid; grid-template-columns:1fr 1fr; gap:14px; }

        /* price field note */
        .ms-price-note { font-size:11px; color:#bbb; margin-top:5px; font-weight:400; }
        .ms-price-note strong { color:#888; }

        .ms-upzone { border:2px dashed #ddddd8; border-radius:13px; overflow:hidden; cursor:pointer; transition:border-color 0.15s; background:#fafaf8; position:relative; }
        .ms-upzone:hover { border-color:#0d0d0d; }
        .ms-upzone input { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; }
        .ms-up-preview { width:100%; height:160px; object-fit:cover; display:block; }
        .ms-up-ph { height:120px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; }
        .ms-up-ico { width:42px; height:42px; background:#eeede9; border-radius:11px; display:flex; align-items:center; justify-content:center; }
        .ms-up-txt { font-size:13px; color:#aaa; font-weight:400; }
        .ms-up-txt strong { color:#555; font-weight:600; }

        .ms-submit { width:100%; padding:15px; background:#0d0d0d; color:#fff; border:none; border-radius:12px; cursor:pointer; font-family:'Outfit',sans-serif; font-weight:700; font-size:15px; letter-spacing:0.03em; transition:background 0.2s,transform 0.15s; }
        .ms-submit:hover:not(:disabled) { background:#16a34a; }
        .ms-submit:active:not(:disabled) { transform:scale(0.99); }
        .ms-submit:disabled { opacity:0.45; cursor:not-allowed; }

        .ms-cfm { background: var(--card-bg); color: var(--text); }
        .ms-cfm-ico { width:56px; height:56px; background:#fff0ef; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 18px; color:#c0392b; }
        .ms-cfm-h { font-family:'Playfair Display',serif; font-size:22px; font-weight:700; margin-bottom:10px; }
        .ms-cfm-p { color:#999; font-size:14px; font-weight:300; line-height:1.65; margin-bottom:26px; }
        .ms-cfm-p strong { color:#555; font-weight:500; }
        .ms-cfm-btns { display:flex; gap:10px; }
        .ms-cfm-cancel { flex:1; padding:12px; border:1.5px solid #e4e4e0; border-radius:10px; background:#fff; font-family:'Outfit',sans-serif; font-size:14px; font-weight:500; cursor:pointer; color:#555; transition:background 0.15s; }
        .ms-cfm-cancel:hover { background:#f5f5f2; }
        .ms-cfm-del { flex:1; padding:12px; background:#c0392b; color:#fff; border:none; border-radius:10px; font-family:'Outfit',sans-serif; font-size:14px; font-weight:700; cursor:pointer; transition:background 0.15s; }
        .ms-cfm-del:hover { background:#a93226; }
      `}</style>

      <div className="ms">
        {/* HEADER */}
        <div className="ms-hdr">
          <div>
            <div className="ms-eyebrow">Provider Dashboard</div>
            <h1 className="ms-h1">My <em>Services</em></h1>
            {!loading && (
              <p className="ms-sub">
                {services.length === 0 ? "No services yet — add your first one" : `${services.length} service${services.length !== 1 ? "s" : ""} listed`}
              </p>
            )}
          </div>
          <div className="ms-hdr-right">
            <CurrencySelector value={currency} onChange={handleCurrencyChange} />
            <button className="ms-add" onClick={openAdd}>
              <span className="ms-add-ico"><Plus size={13} strokeWidth={3} /></span>
              Add Service
            </button>
          </div>
        </div>

        {/* Currency info note */}
        {!loading && services.length > 0 && (
          <p className="ms-currency-note">
            💡 Prices shown in <strong>{CURRENCIES.find(c => c.code === currency)?.label || currency}</strong>. Rates are approximate.
          </p>
        )}

        {/* GRID */}
        <div className="ms-grid">
          {loading ? (
            [1,2,3].map(i => (
              <div key={i} className="ms-skel">
                <div className="ms-shim" style={{ height: 195 }} />
                <div style={{ padding: "20px 22px" }}>
                  <div className="ms-shim" style={{ height: 20, width: "58%", borderRadius: 6, marginBottom: 10 }} />
                  <div className="ms-shim" style={{ height: 13, width: "88%", borderRadius: 4, marginBottom: 6 }} />
                  <div className="ms-shim" style={{ height: 13, width: "68%", borderRadius: 4 }} />
                </div>
              </div>
            ))
          ) : services.length === 0 ? (
            <div className="ms-empty">
              <div className="ms-empty-glyph">∅</div>
              <h3 className="ms-empty-h">Nothing here yet</h3>
              <p className="ms-empty-p">Add your first service offering to get started.</p>
            </div>
          ) : (
            services.map(s => {
              const cat  = (s.category || "other").toLowerCase();
              const meta = CAT_META[cat] || CAT_META.other;
              return (
                <div key={s._id} className="ms-card">
                  <div className="ms-card-img">
                    {s.images?.length > 0
                      ? <img src={`${API_URL}${s.images[0]}`} alt={s.name} />
                      : <div className="ms-no-img">
                          <span>{meta.emoji}</span>
                          <span className="ms-no-img-lbl">No image</span>
                        </div>
                    }
                    <span className="ms-cat" style={{ color: meta.color, background: meta.bg }}>
                      {meta.emoji} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </span>
                  </div>

                  <div className="ms-card-body">
                    <h3 className="ms-card-name">{s.name}</h3>
                    <p className="ms-card-desc">{s.description}</p>

                    <div className="ms-meta">
                      {s.price && (
                        <div className="ms-meta-item">
                          <span className="ms-price-val">
                            {formatPrice(s.price, currency, DB_CURRENCY)}
                          </span>
                        </div>
                      )}
                      {s.price && s.duration && <div className="ms-sep" />}
                      {s.duration && (
                        <div className="ms-meta-item">
                          <Clock size={13} color="#bbb" />
                          {s.duration}
                        </div>
                      )}
                    </div>

                    <div className="ms-actions">
                      <button className="ms-btn ms-btn-edit" onClick={() => openEdit(s)}>
                        <Pencil size={12} strokeWidth={2.5} /> Edit
                      </button>
                      <button className="ms-btn ms-btn-del" onClick={() => setDeleting(s)}>
                        <Trash2 size={12} strokeWidth={2.5} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="ms-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="ms-modal">
            <div className="ms-modal-hdr">
              <div>
                <div className="ms-modal-eyebrow">{editing ? "Edit service" : "New service"}</div>
                <div className="ms-modal-title">{editing ? editing.name : "Add a Service"}</div>
              </div>
              <button className="ms-modal-x" onClick={() => setShowModal(false)}><X size={15} /></button>
            </div>

            <form onSubmit={handleSubmit} className="ms-form">
              <div>
                <label className="ms-lbl">Cover Image</label>
                <div className="ms-upzone">
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  {previewUrl
                    ? <img src={previewUrl} className="ms-up-preview" alt="Preview" />
                    : <div className="ms-up-ph">
                        <div className="ms-up-ico"><ImageIcon size={18} color="#aaa" /></div>
                        <span className="ms-up-txt"><strong>Click to upload</strong> or drag & drop</span>
                      </div>
                  }
                </div>
              </div>

              <div>
                <label className="ms-lbl">Service Name</label>
                <input className="ms-inp" type="text" placeholder="e.g. Deep House Cleaning"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>

              <div>
                <label className="ms-lbl">Category</label>
                <select className="ms-sel" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{CAT_META[c].emoji} {c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="ms-lbl">Description</label>
                <textarea className="ms-ta" placeholder="Describe what clients can expect…"
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              </div>

              <div className="ms-2col">
                <div>
                  <label className="ms-lbl">Price (KES)</label>
                  <input className="ms-inp" type="number" placeholder="500"
                    value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                  <p className="ms-price-note">Enter price in <strong>KES</strong>. Other currencies are auto-converted.</p>
                </div>
                <div>
                  <label className="ms-lbl">Duration</label>
                  <input className="ms-inp" type="text" placeholder="e.g. 2 hours"
                    value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
                </div>
              </div>

              <button className="ms-submit" type="submit" disabled={saving}>
                {saving ? "Saving…" : editing ? "Save Changes" : "Create Service"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleting && (
        <div className="ms-overlay" onClick={e => e.target === e.currentTarget && setDeleting(null)}>
          <div className="ms-cfm">
            <div className="ms-cfm-ico"><AlertTriangle size={24} /></div>
            <h3 className="ms-cfm-h">Delete service?</h3>
            <p className="ms-cfm-p"><strong>"{deleting.name}"</strong> will be permanently removed and cannot be recovered.</p>
            <div className="ms-cfm-btns">
              <button className="ms-cfm-cancel" onClick={() => setDeleting(null)}>Cancel</button>
              <button className="ms-cfm-del" onClick={() => handleDelete(deleting._id)}>Yes, delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
