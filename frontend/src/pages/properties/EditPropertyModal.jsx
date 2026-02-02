import { X, Upload, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { updateProperty } from "../../services/propertyService";
import { useProperties } from "../../context/PropertyContext";

export default function EditPropertyModal({ property, onClose }) {
  const { updatePropertyInContext } = useProperties();
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]); // For new image previews
  const [imageFiles, setImageFiles] = useState([]); // New files to upload
  const [existingImages, setExistingImages] = useState(property.images || []); // Current images

  const [form, setForm] = useState({
    title: property.title || "",
    address: property.address || "",
    city: property.city || "",
    country: property.country || "Rwanda",
    category: property.category || "apartment",
    rentType: property.rentType || "monthly",
    pricePerNight: property.pricePerNight || "",
    description: property.description || "",
  });

  // Helper to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  // Handle new image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    const totalImages = existingImages.length + imageFiles.length + files.length;
    if (totalImages > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    setImageFiles([...imageFiles, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setSelectedImages([...selectedImages, ...previews]);
  };

  // Remove new image (not yet uploaded)
  const removeNewImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  // Remove existing image
  const removeExistingImage = (imageUrl) => {
    setExistingImages(existingImages.filter(img => img !== imageUrl));
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

      if (form.rentType === "daily") {
        formData.append("pricePerNight", Number(form.pricePerNight));
      }

      // Send existing images as JSON string
      formData.append("existingImages", JSON.stringify(existingImages));

      // Append new images
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

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
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit Property</h2>
          <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded">
            <X />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            className="input col-span-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            className="input col-span-2"
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

          <input
            className="input"
            placeholder="Country"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
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
              className="input col-span-2"
              type="number"
              placeholder="Price per night"
              value={form.pricePerNight}
              onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
            />
          )}

          <textarea
            className="input col-span-2"
            rows="3"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* IMAGE MANAGEMENT */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Property Images ({existingImages.length + imageFiles.length}/5)
          </label>

          {/* Existing Images */}
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

          {/* New Images Preview */}
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

          {/* Upload Button */}
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

        {/* Action Buttons */}
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
