import { useParams, Link } from "react-router-dom";
import { useProperties } from "../../context/PropertyContext";
import { useEffect, useState } from "react";
import {
  getUnitsByProperty,
  createUnit,
  deleteUnit,
  updateUnit,
  deleteUnitImage,
} from "../../services/unitService";
import { Home, Upload, X, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import Modal from "../../components/Modal";

export default function PropertyUnitsPage() {
  const { propertyId } = useParams();
  const { properties } = useProperties();

  const property = properties.find(
    (p) => String(p._id) === String(propertyId)
  );

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUnit, setEditingUnit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [form, setForm] = useState({
    unitNumber: "",
    unitType: "Bedsitter",
    bedrooms: 0,
    bathrooms: 1,
    rentAmount: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  /* ================= LOAD UNITS ================= */
  useEffect(() => {
    if (!propertyId) return;

    const loadUnits = async () => {
      try {
        setLoading(true);
        const data = await getUnitsByProperty(propertyId);
        setUnits(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("LOAD UNITS FAILED", err);
        setUnits([]);
      } finally {
        setLoading(false);
      }
    };

    loadUnits();
  }, [propertyId]);

  /* ================= PROPERTY GUARD ================= */
  if (!property) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Property not found</h2>
        <p className="text-gray-600">
          This property does not exist or was not loaded.
        </p>
        <Link to="/dashboard/properties" className="text-blue-600 underline">
          Back to Properties
        </Link>
      </div>
    );
  }

  /* ================= HANDLE IMAGE SELECTION ================= */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: files });

    // Create previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImagePreview = (index) => {
    const newImages = form.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setForm({ ...form, images: newImages });
    setImagePreviews(newPreviews);
  };

  /* ================= ADD UNIT ================= */
  const handleAddUnit = async () => {
    if (!form.unitNumber || !form.rentAmount) {
      alert("Please fill in unit number and rent amount");
      return;
    }

    const payload = {
      unitNumber: form.unitNumber,
      unitType: form.unitType,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      rentAmount: Number(form.rentAmount),
      property: propertyId,
      images: form.images,
    };

    try {
      const created = await createUnit(payload);
      setUnits((prev) => [created, ...prev]);
      
      // Reset form
      setForm({
        unitNumber: "",
        unitType: "Bedsitter",
        bedrooms: 0,
        bathrooms: 1,
        rentAmount: "",
        images: [],
      });
      setImagePreviews([]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create unit");
    }
  };

  /* ================= EDIT UNIT ================= */
  const openEditModal = (unit) => {
    setEditingUnit(unit);
    setForm({
      unitNumber: unit.unitNumber,
      unitType: unit.unitType,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      rentAmount: unit.rentAmount,
      images: [],
    });
    setImagePreviews([]);
    setIsEditModalOpen(true);
  };

  const handleUpdateUnit = async () => {
    if (!form.unitNumber || !form.rentAmount) {
      alert("Please fill in unit number and rent amount");
      return;
    }

    const payload = {
      unitNumber: form.unitNumber,
      unitType: form.unitType,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      rentAmount: Number(form.rentAmount),
      images: form.images,
    };

    try {
      const updated = await updateUnit(editingUnit._id, payload);
      setUnits((prev) =>
        prev.map((u) => (u._id === editingUnit._id ? updated : u))
      );
      setIsEditModalOpen(false);
      setEditingUnit(null);
      setForm({
        unitNumber: "",
        unitType: "Bedsitter",
        bedrooms: 0,
        bathrooms: 1,
        rentAmount: "",
        images: [],
      });
      setImagePreviews([]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update unit");
    }
  };

  /* ================= DELETE UNIT IMAGE ================= */
  const handleDeleteUnitImage = async (unitId, imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const updated = await deleteUnitImage(unitId, imageUrl);
      setUnits((prev) =>
        prev.map((u) => (u._id === unitId ? updated : u))
      );
    } catch (err) {
      alert("Failed to delete image");
    }
  };

  /* ================= DELETE UNIT ================= */
  const handleDelete = async (unitId) => {
    if (!window.confirm("Are you sure you want to delete this unit?")) return;

    try {
      await deleteUnit(unitId);
      setUnits((prev) => prev.filter((u) => u._id !== unitId));
    } catch (err) {
      alert("Failed to delete unit");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Units — {property.title}</h2>
          <p className="text-gray-500 mt-1">
            {property.city}, {property.country}
          </p>
        </div>
        <Link
          to="/dashboard/properties"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Properties
        </Link>
      </div>

      {/* ADD UNIT FORM */}
      <div className="bg-white border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Add New Unit</h3>
        <div className="grid gap-4 md:grid-cols-6">
          <input
            className="input"
            placeholder="Unit number"
            value={form.unitNumber}
            onChange={(e) => setForm({ ...form, unitNumber: e.target.value })}
          />

          <select
            className="input"
            value={form.unitType}
            onChange={(e) => setForm({ ...form, unitType: e.target.value })}
          >
            <option>Bedsitter</option>
            <option>Single Room</option>
            <option>Studio</option>
            <option>1 Bedroom</option>
            <option>2 Bedroom</option>
            <option>3 Bedroom</option>
          </select>

          <input
            type="number"
            className="input"
            placeholder="Bedrooms"
            value={form.bedrooms}
            onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
          />

          <input
            type="number"
            className="input"
            placeholder="Bathrooms"
            value={form.bathrooms}
            onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
          />

          <input
            type="number"
            className="input"
            placeholder="Rent amount"
            value={form.rentAmount}
            onChange={(e) => setForm({ ...form, rentAmount: e.target.value })}
          />

          <button
            onClick={handleAddUnit}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 font-medium transition"
          >
            Add Unit
          </button>
        </div>

        {/* IMAGE UPLOAD */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit Images (Optional)
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition">
              <Upload size={18} />
              <span className="text-sm font-medium">Choose Images</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            <span className="text-sm text-gray-500">
              {form.images.length > 0
                ? `${form.images.length} image(s) selected`
                : "No images selected"}
            </span>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => removeImagePreview(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* UNITS LIST */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading units…</p>
        </div>
      )}

      {!loading && units.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border">
          <Home className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">No units added yet for this property</p>
        </div>
      )}

      {!loading && units.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {units.map((unit) => (
            <div
              key={unit._id}
              className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition group"
            >
              {/* Unit Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                {unit.images && unit.images.length > 0 ? (
                  <img
                    src={getImageUrl(unit.images[0])}
                    alt={unit.unitNumber}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="text-gray-300" size={48} />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {unit.isOccupied ? (
                    <span className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                      <CheckCircle size={12} />
                      Occupied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                      <XCircle size={12} />
                      Vacant
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => openEditModal(unit)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg transition"
                    title="Edit unit"
                  >
                    <Pencil size={14} className="text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(unit._id)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg transition"
                    title="Delete unit"
                  >
                    <Trash2 size={14} className="text-red-600" />
                  </button>
                </div>
              </div>

              {/* Unit Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-lg">
                    Unit {unit.unitNumber}
                  </h4>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {unit.unitType}
                  </span>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>
                      🛏️ {unit.bedrooms} Bed · 🚿 {unit.bathrooms} Bath
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-gray-500">Monthly Rent</span>
                    <span className="font-bold text-gray-900">
                      ${unit.rentAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {unit.tenant && (
                  <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                    Tenant: {unit.tenant.name}
                  </div>
                )}

                {/* Image Count */}
                {unit.images && unit.images.length > 0 && (
                  <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                    📷 {unit.images.length} image(s)
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT UNIT MODAL */}
      <Modal
        title="Edit Unit"
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUnit(null);
          setImagePreviews([]);
        }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Unit Number
            </label>
            <input
              className="input w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              placeholder="Unit number"
              value={form.unitNumber}
              onChange={(e) =>
                setForm({ ...form, unitNumber: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Unit Type
            </label>
            <select
              className="input w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              value={form.unitType}
              onChange={(e) => setForm({ ...form, unitType: e.target.value })}
            >
              <option>Bedsitter</option>
              <option>Single Room</option>
              <option>Studio</option>
              <option>1 Bedroom</option>
              <option>2 Bedroom</option>
              <option>3 Bedroom</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Bedrooms
              </label>
              <input
                type="number"
                className="input w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                value={form.bedrooms}
                onChange={(e) =>
                  setForm({ ...form, bedrooms: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Bathrooms
              </label>
              <input
                type="number"
                className="input w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                value={form.bathrooms}
                onChange={(e) =>
                  setForm({ ...form, bathrooms: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Rent Amount
            </label>
            <input
              type="number"
              className="input w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              placeholder="Rent amount"
              value={form.rentAmount}
              onChange={(e) =>
                setForm({ ...form, rentAmount: e.target.value })
              }
            />
          </div>

          {/* Existing Images */}
          {editingUnit && editingUnit.images && editingUnit.images.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Images
              </label>
              <div className="grid grid-cols-3 gap-3">
                {editingUnit.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={getImageUrl(image)}
                      alt={`Unit ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() =>
                        handleDeleteUnitImage(editingUnit._id, image)
                      }
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add New Images
            </label>
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition w-fit">
              <Upload size={18} />
              <span className="text-sm font-medium">Choose Images</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => removeImagePreview(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingUnit(null);
                setImagePreviews([]);
              }}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateUnit}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition"
            >
              Update Unit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
