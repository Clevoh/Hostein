import { X, Upload, Trash2 } from "lucide-react";
import { useState } from "react";
import { createProperty } from "../../services/propertyService";
import { useProperties } from "../../context/PropertyContext";

export default function AddPropertyModal({ onClose }) {
  const { addProperty } = useProperties();
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]); // For preview
  const [imageFiles, setImageFiles] = useState([]); // Actual files

  const [form, setForm] = useState({
    title: "",
    address: "",
    city: "",
    country: "Rwanda",
    category: "apartment",
    rentType: "monthly",
    pricePerNight: "",
    description: "",
  });

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + imageFiles.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    // Store actual files
    setImageFiles([...imageFiles, ...files]);

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setSelectedImages([...selectedImages, ...previews]);
  };

  // Remove image
  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.address || !form.city) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("address", form.address);
      formData.append("city", form.city);
      formData.append("country", form.country);
      formData.append("category", form.category);
      formData.append("rentType", form.rentType);
      formData.append("description", form.description);

      if (form.rentType === "daily") {
        formData.append("pricePerNight", Number(form.pricePerNight));
      }

      // Append all images
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const createdProperty = await createProperty(formData);

      addProperty(createdProperty); // update context
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
      <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Add Property</h2>
          <button onClick={onClose}>
            <X />
          </button>
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

        <input
          className="input"
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />

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

        {form.rentType === "daily" && (
          <input
            className="input"
            type="number"
            placeholder="Price per night"
            value={form.pricePerNight}
            onChange={(e) =>
              setForm({ ...form, pricePerNight: e.target.value })
            }
          />
        )}

        <textarea
          className="input"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* 🆕 IMAGE UPLOAD SECTION */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Property Images (Max 5)
          </label>
          
          {/* Upload Button */}
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

          {/* Image Previews */}
          {selectedImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {selectedImages.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Property"}
        </button>
      </div>
    </div>
  );
}
