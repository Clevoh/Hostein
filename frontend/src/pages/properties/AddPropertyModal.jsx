import { X, Upload, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { createProperty } from "../../services/propertyService";
import { useProperties } from "../../context/PropertyContext";

export default function AddPropertyModal({ onClose }) {
  const { addProperty } = useProperties();
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);

  const [form, setForm] = useState({
    title: "",
    address: "",
    city: "",
    country: "Rwanda",
    category: "apartment",
    rentType: "monthly",
    pricePerNight: "",
    description: "",
    hostelType: "accommodation_only",
    amenities: [],
  });

  const amenitiesOptions = [
    "WiFi", "Laundry", "Kitchen", "Parking", "Gym",
    "Study Room", "Common Area", "24/7 Security", "Cleaning Service",
  ];

  const toggleAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    setImageFiles([...imageFiles, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setSelectedImages([...selectedImages, ...previews]);
  };

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
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
      formData.append("category", form.category);
      formData.append("rentType", form.rentType);
      formData.append("description", form.description);
      formData.append("amenities", JSON.stringify(form.amenities));

      if (form.rentType === "daily") {
        formData.append("pricePerNight", Number(form.pricePerNight));
      }

      // 🆕 Hostel fields
      if (form.category === "hostel") {
        formData.append("hostelType", form.hostelType);
        if (mealPlans.length > 0) {
          formData.append("mealPlans", JSON.stringify(mealPlans));
        }
      }

      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const createdProperty = await createProperty(formData);
      addProperty(createdProperty);
      onClose();
    } catch (err) {
      console.error("SAVE PROPERTY FAILED", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to save property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Add Property</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <input
          className="input"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          className="input"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <input
            className="input"
            placeholder="Country"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />
        </div>

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

        {form.rentType === "daily" && (
          <input
            className="input"
            type="number"
            placeholder="Price per night"
            value={form.pricePerNight}
            onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
          />
        )}

        {/*  HOSTEL SECTION - only shows when Hostel is selected */}
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

            {/* Meal Plans - show for meals_included or mixed */}
            {(form.hostelType === "meals_included" || form.hostelType === "mixed") && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Meal Plans Available
                  </label>
                  <button
                    type="button"
                    onClick={addMealPlan}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Plus size={16} />
                    Add Meal Plan
                  </button>
                </div>

                {mealPlans.length === 0 && (
                  <p className="text-sm text-gray-400 italic">
                    Click "Add Meal Plan" to define what meals you offer
                  </p>
                )}

                {mealPlans.map((plan, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 space-y-3 border border-blue-100">
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

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Daily Price (RWF)</label>
                        <input
                          className="input text-sm"
                          type="number"
                          placeholder="e.g. 5000"
                          value={plan.priceDaily}
                          onChange={(e) => updateMealPlan(index, "priceDaily", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Monthly Price (RWF)</label>
                        <input
                          className="input text-sm"
                          type="number"
                          placeholder="e.g. 100000"
                          value={plan.priceMonthly}
                          onChange={(e) => updateMealPlan(index, "priceMonthly", e.target.value)}
                        />
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

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amenities
          </label>
          <div className="flex flex-wrap gap-2">
            {amenitiesOptions.map((amenity) => (
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

        <textarea
          className="input"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* IMAGE UPLOAD SECTION */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Property Images (Max 5)
          </label>

          <label className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
            <Upload size={20} className="text-gray-500" />
            <span className="text-sm text-gray-600">
              {imageFiles.length > 0 ? `${imageFiles.length} image(s) selected` : "Choose images"}
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {selectedImages.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mt-2">
              {selectedImages.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-20 w-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50 font-medium hover:bg-blue-700 transition"
        >
          {loading ? "Saving..." : "Save Property"}
        </button>
      </div>
    </div>
  );
}
