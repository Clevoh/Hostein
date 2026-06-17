import { X, Upload, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { updateProperty } from "../../services/propertyService";
import { useProperties } from "../../context/PropertyContext";

// ─── East Africa Data ──────────────────────────────────────────────────────
const EAST_AFRICA = {
  Rwanda:   ["Kigali", "Musanze", "Rubavu", "Huye", "Muhanga", "Nyagatare", "Rusizi"],
  Kenya:    ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Malindi"],
  Uganda:   ["Kampala", "Entebbe", "Jinja", "Gulu", "Mbarara", "Mbale", "Fort Portal"],
  Tanzania: ["Dar es Salaam", "Dodoma", "Arusha", "Mwanza", "Zanzibar", "Morogoro", "Tanga"],
  Burundi:  ["Bujumbura", "Gitega", "Ngozi", "Rumonge", "Muyinga", "Kayanza", "Bururi"],
};

const CURRENCY = {
  Rwanda:   { code: "RWF", symbol: "RWF" },
  Kenya:    { code: "KES", symbol: "KSh" },
  Uganda:   { code: "UGX", symbol: "USh" },
  Tanzania: { code: "TZS", symbol: "TSh" },
  Burundi:  { code: "BIF", symbol: "BIF" },
};

const COUNTRIES = Object.keys(EAST_AFRICA);

const AMENITIES_OPTIONS = [
  "WiFi", "Laundry", "Kitchen", "Parking", "Gym",
  "Study Room", "Common Area", "24/7 Security", "Cleaning Service",
];
// ───────────────────────────────────────────────────────────────────────────

export default function EditPropertyModal({ property, onClose }) {
  const { updatePropertyInContext } = useProperties();
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(property.images || []);

  const [mealPlans, setMealPlans] = useState(
    property.mealPlans?.length ? property.mealPlans : []
  );

  const [form, setForm] = useState({
    title: property.title || "",
    address: property.address || "",
    city: property.city || "",
    country: property.country || "Rwanda",
    category: property.category || "apartment",
    rentType: property.rentType || "monthly",
    pricePerNight: property.pricePerNight || "",
    description: property.description || "",
    hostelType: property.hostelType || "accommodation_only",
    amenities: property.amenities || [],
  });

  // Derived values based on selected country
  const citySuggestions = EAST_AFRICA[form.country] || [];
  const currency = CURRENCY[form.country] || { code: "", symbol: "" };

  // Check if the stored city is a custom (non-listed) value
  const cityIsCustom = form.city && !citySuggestions.includes(form.city);

  const handleCountryChange = (e) => {
    setForm((prev) => ({ ...prev, country: e.target.value, city: "" }));
  };

  const handleCitySelectChange = (e) => {
    setForm((prev) => ({ ...prev, city: e.target.value }));
  };

  const toggleAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `${import.meta.env.VITE_API_URL}${imagePath}`;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (existingImages.length + imageFiles.length + files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    setImageFiles([...imageFiles, ...files]);
    setSelectedImages([...selectedImages, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeNewImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageUrl) => {
    setExistingImages(existingImages.filter((img) => img !== imageUrl));
  };

  const addMealPlan = () => {
    setMealPlans([
      ...mealPlans,
      { name: "breakfast", priceDaily: "", priceMonthly: "", description: "", isIncluded: false },
    ]);
  };

  const updateMealPlan = (index, field, value) => {
    const updated = [...mealPlans];
    updated[index][field] = value;
    setMealPlans(updated);
  };

  const removeMealPlan = (index) => {
    setMealPlans(mealPlans.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.address || !form.city) {
      alert("Please fill all required fields");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("address", form.address);
      formData.append("city", form.city);
      formData.append("country", form.country);
      formData.append("currency", currency.code);
      formData.append("category", form.category);
      formData.append("rentType", form.rentType);
      formData.append("description", form.description);
      formData.append("amenities", JSON.stringify(form.amenities));

      if (form.rentType === "daily") {
        formData.append("pricePerNight", Number(form.pricePerNight));
      }

      if (form.category === "hostel") {
        formData.append("hostelType", form.hostelType);
        formData.append("mealPlans", JSON.stringify(mealPlans.filter((p) => p.name)));
      }

      formData.append("existingImages", JSON.stringify(existingImages));
      imageFiles.forEach((file) => formData.append("images", file));

      const updatedProperty = await updateProperty(property._id, formData);
      updatePropertyInContext(updatedProperty);
      onClose();
    } catch (err) {
      console.error("UPDATE PROPERTY FAILED", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to update property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit Property</h2>
          <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded">
            <X />
          </button>
        </div>

        <input
          className="input"
          placeholder="Title *"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          className="input"
          placeholder="Address *"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        {/* ── Country & City ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4">
          {/* Country */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Country *</label>
            <select className="input" value={form.country} onChange={handleCountryChange}>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {/* Currency badge */}
            <span className="inline-block mt-1 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded px-2 py-0.5">
              {currency.code} ({currency.symbol})
            </span>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">City *</label>
            <select
              className="input"
              value={cityIsCustom ? "__other__" : form.city}
              onChange={handleCitySelectChange}
            >
              <option value="">Select city…</option>
              {citySuggestions.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
              <option value="__other__">Other…</option>
            </select>
            {(form.city === "__other__" || cityIsCustom) && (
              <input
                className="input mt-2"
                placeholder="Enter city name"
                value={cityIsCustom ? form.city : ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, city: e.target.value }))
                }
              />
            )}
          </div>
        </div>

        {/* ── Category & Rent Type ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4">
          <select
            className="input"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="apartment">Apartment</option>
            <option value="hostel">Hostel</option>
            <option value="short_stay">Short Stay</option>
          </select>

          <select
            className="input"
            value={form.rentType}
            onChange={(e) => setForm({ ...form, rentType: e.target.value })}
          >
            <option value="monthly">Monthly</option>
            <option value="daily">Daily</option>
          </select>
        </div>

        {/* ── Price per Night (daily only) ─────────────────────────────────── */}
        {form.rentType === "daily" && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Price per Night ({currency.symbol})
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sm font-semibold text-gray-400 select-none pointer-events-none">
                {currency.symbol}
              </span>
              <input
                className="input pl-14"
                type="number"
                placeholder="0"
                value={form.pricePerNight}
                onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
              />
            </div>
          </div>
        )}

        <textarea
          className="input"
          rows="3"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* ── Hostel Section ────────────────────────────────────────────────── */}
        {form.category === "hostel" && (
          <div className="border border-blue-200 bg-blue-50 rounded-xl p-4 space-y-4">
            <h3 className="font-semibold text-blue-900 flex items-center gap-2">
              🏨 Hostel Configuration
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Accommodation Type
              </label>
              <select
                className="input"
                value={form.hostelType}
                onChange={(e) => setForm({ ...form, hostelType: e.target.value })}
              >
                <option value="accommodation_only">Accommodation Only</option>
                <option value="meals_included">Meals Included</option>
                <option value="mixed">Mixed (Some units with meals)</option>
              </select>
            </div>

            {(form.hostelType === "meals_included" || form.hostelType === "mixed") && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Meal Plans</label>
                  <button
                    type="button"
                    onClick={addMealPlan}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Plus size={16} /> Add Meal Plan
                  </button>
                </div>

                {mealPlans.length === 0 && (
                  <p className="text-sm text-gray-400 italic">No meal plans yet</p>
                )}

                {mealPlans.map((plan, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 space-y-3 border border-blue-100"
                  >
                    <div className="flex items-center justify-between">
                      <select
                        className="input text-sm"
                        value={plan.name}
                        onChange={(e) => updateMealPlan(index, "name", e.target.value)}
                      >
                        <option value="breakfast">🍳 Breakfast</option>
                        <option value="lunch">🍱 Lunch</option>
                        <option value="dinner">🍽️ Dinner</option>
                        <option value="half_board">Half Board (2 meals/day)</option>
                        <option value="full_board">Full Board (3 meals/day)</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeMealPlan(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Meal plan prices with currency */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Daily Price ({currency.symbol})
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-xs font-semibold text-gray-400 select-none pointer-events-none">
                            {currency.symbol}
                          </span>
                          <input
                            className="input text-sm pl-14"
                            type="number"
                            placeholder="0"
                            value={plan.priceDaily}
                            onChange={(e) => updateMealPlan(index, "priceDaily", e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Monthly Price ({currency.symbol})
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-xs font-semibold text-gray-400 select-none pointer-events-none">
                            {currency.symbol}
                          </span>
                          <input
                            className="input text-sm pl-14"
                            type="number"
                            placeholder="0"
                            value={plan.priceMonthly}
                            onChange={(e) => updateMealPlan(index, "priceMonthly", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <input
                      className="input text-sm"
                      placeholder="Description (e.g. Includes tea and toast)"
                      value={plan.description}
                      onChange={(e) => updateMealPlan(index, "description", e.target.value)}
                    />

                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={plan.isIncluded}
                        onChange={(e) => updateMealPlan(index, "isIncluded", e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      Included in base rent price
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Amenities ──────────────────────────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {AMENITIES_OPTIONS.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition border ${
                  form.amenities.includes(amenity)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>

        {/* ── Image Management ────────────────────────────────────────────────── */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Property Images ({existingImages.length + imageFiles.length}/5)
          </label>

          {existingImages.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Current Images</p>
              <div className="grid grid-cols-5 gap-2">
                {existingImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={getImageUrl(img)}
                      alt={`Existing ${index + 1}`}
                      className="h-20 w-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeExistingImage(img)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedImages.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">New Images to Upload</p>
              <div className="grid grid-cols-5 gap-2">
                {selectedImages.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`New ${index + 1}`}
                      className="h-20 w-full object-cover rounded-lg border-2 border-blue-400"
                    />
                    <button
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {existingImages.length + imageFiles.length < 5 && (
            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
              <Upload size={20} className="text-gray-500" />
              <span className="text-sm text-gray-600">Add more images</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* ── Actions ────────────────────────────────────────────────────────── */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 transition"
          >
            {loading ? "Updating..." : "Update Property"}
          </button>
        </div>
      </div>
    </div>
  );
}
