import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Pencil, MapPin, Grid3x3, LayoutList } from "lucide-react";
import { useProperties } from "../../context/PropertyContext";
import AddPropertyModal from "./AddPropertyModal";
import EditPropertyModal from "./EditPropertyModal";
import PropertyDetailsModal from "./propertyDetailsModal";
import Modal from "../../components/Modal";

const CATEGORY_LABELS = {
  apartment: "Apartment",
  hostel: "Hostel",
  short_stay: "Short Stay",
};

const CATEGORY_COLORS = {
  apartment: "bg-blue-50 text-blue-700 border-blue-100",
  hostel: "bg-violet-50 text-violet-700 border-violet-100",
  short_stay: "bg-amber-50 text-amber-700 border-amber-100",
};

export default function PropertiesPage() {
  const { properties, deleteProperty, loading } = useProperties();
  const [openAdd, setOpenAdd] = useState(false);
  const [editProperty, setEditProperty] = useState(null);
  const [viewProperty, setViewProperty] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [view, setView] = useState("grid");
  const navigate = useNavigate();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `${import.meta.env.VITE_API_URL}${imagePath}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-slate-200 border-t-slate-700 animate-spin" />
          <p className="text-slate-500 text-sm">Loading properties…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>My Properties</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>
            {properties.length} listing{properties.length !== 1 ? "s" : ""} managed
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
            >
              <Grid3x3 size={16} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
            >
              <LayoutList size={16} />
            </button>
          </div>
          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add Property
          </button>
        </div>
      </div>

      {/* ── GRID VIEW ── */}
      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {properties.map((p) => (
            <div
              key={p._id}
              className="group cursor-pointer rounded-2xl overflow-hidden border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              onClick={() => setViewProperty(p)}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                {p.images?.[0] ? (
                  <img
                    src={getImageUrl(p.images[0])}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                    <MapPin className="text-slate-300" size={32} />
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Category pill */}
                <div className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm ${CATEGORY_COLORS[p.category] || "bg-slate-50 text-slate-700 border-slate-100"}`}>
                  {CATEGORY_LABELS[p.category] || p.category}
                </div>

                {/* Image count */}
                {p.images?.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg font-medium">
                    +{p.images.length - 1}
                  </div>
                )}

                {/* Action buttons - show on hover */}
                <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditProperty(p); }}
                    className="p-2 bg-white/95 backdrop-blur-sm rounded-xl hover:bg-white shadow-md transition"
                    title="Edit"
                  >
                    <Pencil size={14} className="text-slate-700" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteId(p._id); }}
                    className="p-2 bg-white/95 backdrop-blur-sm rounded-xl hover:bg-white shadow-md transition"
                    title="Delete"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text2)" }}>
                  <MapPin size={12} />
                  <span>{p.city}, {p.country}</span>
                </div>
                <h3 className="font-semibold text-sm leading-snug line-clamp-1" style={{ color: "var(--text)" }}>{p.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-1">{p.address}</p>

                {/* Price */}
                <div className="pt-1">
                  {p.rentType === "daily" && p.pricePerNight ? (
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold" style={{ color: "var(--text)" }}>${p.pricePerNight}</span>
                      <span className="text-xs" style={{ color: "var(--text2)" }}>/ night</span>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">Monthly rental</span>
                  )}
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/properties/${p._id}/units`); }}
                  className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-900 hover:bg-slate-700 text-white rounded-xl transition text-xs font-semibold"
                >
                  <Plus size={14} />
                  Manage Units
                </button>
              </div>
            </div>
          ))}

          {/* Add property card */}
          {properties.length > 0 && (
            <button
              onClick={() => setOpenAdd(true)}
              className="group aspect-auto min-h-[280px] rounded-2xl border-2 border-dashed border-slate-200 hover:border-slate-400 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-slate-600 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
                <Plus size={22} />
              </div>
              <span className="text-sm font-medium">Add property</span>
            </button>
          )}
        </div>
      )}

      {/* ── LIST VIEW ── */}
      {view === "list" && (
        <div className="space-y-3">
          {properties.map((p) => (
            <div
              key={p._id}
              className="group flex items-center gap-4 border rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              onClick={() => setViewProperty(p)}
            >
              {/* Thumb */}
              <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100">
                {p.images?.[0] ? (
                  <img src={getImageUrl(p.images[0])} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><MapPin size={20} className="text-slate-300" /></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[p.category] || "bg-slate-50 text-slate-700 border-slate-100"}`}>
                    {CATEGORY_LABELS[p.category]}
                  </span>
                </div>
                <h3 className="font-semibold truncate" style={{ color: "var(--text)" }}>{p.title}</h3>
                <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--text2)" }}>
                  <MapPin size={10} /> {p.city}, {p.country}
                </p>
              </div>

              <div className="hidden sm:block text-right flex-shrink-0">
                {p.rentType === "daily" && p.pricePerNight ? (
                  <div>
                    <span className="font-bold" style={{ color: "var(--text)" }}>${p.pricePerNight}</span>
                    <span className="text-xs text-slate-400 ml-1">/ night</span>
                  </div>
                ) : (
                  <span className="text-xs" style={{ color: "var(--text2)" }}>Monthly</span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/properties/${p._id}/units`); }}
                  className="hidden sm:flex items-center gap-1 px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-medium hover:bg-slate-700 transition"
                >
                  <Plus size={12} /> Units
                </button>
                <button onClick={(e) => { e.stopPropagation(); setEditProperty(p); }} className="p-2 hover:bg-slate-100 rounded-xl transition">
                  <Pencil size={15} className="text-slate-500" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setDeleteId(p._id); }} className="p-2 hover:bg-red-50 rounded-xl transition">
                  <Trash2 size={15} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {properties.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-5">
            <MapPin size={36} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>No properties yet</h3>
          <p className="text-sm mb-6 max-w-xs" style={{ color: "var(--text2)" }}>
            Add your first property to start managing your rental listings
          </p>
          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-slate-700 transition shadow-sm"
          >
            <Plus size={16} /> Add Your First Property
          </button>
        </div>
      )}

      {/* ── MODALS ── */}
      {openAdd && <AddPropertyModal onClose={() => setOpenAdd(false)} />}
      {editProperty && <EditPropertyModal property={editProperty} onClose={() => setEditProperty(null)} />}
      {viewProperty && <PropertyDetailsModal property={viewProperty} onClose={() => setViewProperty(null)} />}

      <Modal title="Delete Property" isOpen={!!deleteId} onClose={() => setDeleteId(null)}>
        <div className="text-center py-2">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trash2 className="text-red-500" size={24} />
          </div>
          <p className="text-sm mb-6" style={{ color: "var(--text2)" }}>
            Are you sure? This property and all its data will be permanently deleted.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteId(null)}
              className="flex-1 px-4 py-2.5 border rounded-xl font-medium text-sm hover:bg-slate-50 transition"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
            >
              Cancel
            </button>
            <button
              onClick={async () => { await deleteProperty(deleteId); setDeleteId(null); }}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-sm transition"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}