import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Pencil, MapPin } from "lucide-react";
import { useProperties } from "../../context/PropertyContext";
import AddPropertyModal from "./AddPropertyModal";
import EditPropertyModal from "./EditPropertyModal";
import PropertyDetailsModal from "./propertyDetailsModal";
import Modal from "../../components/Modal";
import AddButton from "../../components/AddButton";

export default function PropertiesPage() {
  const { properties, deleteProperty, loading } = useProperties();
  const [openAdd, setOpenAdd] = useState(false);
  const [editProperty, setEditProperty] = useState(null);
  const [viewProperty, setViewProperty] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) {
    return <p className="text-gray-500">Loading properties…</p>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">My Properties</h2>
          <p className="text-gray-500 mt-1">Manage your rental listings</p>
        </div>
        <AddButton label="Add Property" onClick={() => setOpenAdd(true)} />
      </div>

      {/* AIRBNB-STYLE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((p) => (
          <div
            key={p._id}
            className="group cursor-pointer"
            onClick={() => setViewProperty(p)}
          >
            {/* IMAGE CONTAINER */}
            <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
              {/* Main Image */}
              {p.images?.[0] ? (
                <img
                  src={getImageUrl(p.images[0])}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No image</span>
                </div>
              )}

              {/* Image Counter Badge */}
              {p.images && p.images.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-gray-700">
                  1/{p.images.length}
                </div>
              )}

              {/* Action Buttons Overlay */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditProperty(p);
                  }}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg transition"
                >
                  <Pencil size={16} className="text-gray-700" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(p._id);
                  }}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg transition"
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>

              {/* Category Badge */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                {p.category === 'apartment' ? 'Apartment' : 
                 p.category === 'hostel' ? 'Hostel' : 'Short Stay'}
              </div>
            </div>

            {/* PROPERTY INFO */}
            <div className="space-y-1">
              {/* Location */}
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin size={14} />
                <span className="font-medium">{p.city}, {p.country}</span>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-gray-900 truncate">{p.title}</h3>

              {/* Address */}
              <p className="text-sm text-gray-500 truncate">{p.address}</p>

              {/* Rent Type & Price */}
              <div className="flex items-center gap-2 pt-1">
                {p.rentType === 'daily' && p.pricePerNight ? (
                  <div className="flex items-baseline gap-1">
                    <span className="font-semibold text-gray-900">${p.pricePerNight}</span>
                    <span className="text-sm text-gray-600">/ night</span>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    Monthly Rental
                  </span>
                )}
              </div>

              {/* Manage Units Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/dashboard/properties/${p._id}/units`);
                }}
                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition text-sm font-medium"
              >
                <Plus size={16} />
                Manage Units
              </button>
            </div>
          </div>
        ))}

        {properties.length === 0 && (
          <div className="col-span-full text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No properties yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start by adding your first property to begin managing your rentals
              </p>
              <button
                onClick={() => setOpenAdd(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                Add Your First Property
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {openAdd && <AddPropertyModal onClose={() => setOpenAdd(false)} />}
      {editProperty && <EditPropertyModal property={editProperty} onClose={() => setEditProperty(null)} />}
      {viewProperty && <PropertyDetailsModal property={viewProperty} onClose={() => setViewProperty(null)} />}

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        title="Delete Property"
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this property? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteId(null)}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              await deleteProperty(deleteId);
              setDeleteId(null);
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
