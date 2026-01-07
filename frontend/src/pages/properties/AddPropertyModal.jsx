import { X } from "lucide-react";
import { useState } from "react";
import { createProperty } from "../../services/propertyService";
import { useProperties } from "../../context/PropertyContext";

export default function AddPropertyModal({ onClose }) {
  const { addProperty } = useProperties();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    address: "",
    city: "",
    country: "Rwanda",
    category: "apartment",
    rentType: "monthly",
    pricePerNight: "",
    description: "",
    images: [],
  });

  const handleSubmit = async () => {
    if (!form.title || !form.address || !form.city) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: form.title,
        address: form.address,
        city: form.city,
        country: form.country,
        category: form.category,
        rentType: form.rentType,
        description: form.description,
        images: [],
      };

      if (form.rentType === "daily") {
        payload.pricePerNight = Number(form.pricePerNight);
      }

      const createdProperty = await createProperty(payload);

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
      <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4">
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
