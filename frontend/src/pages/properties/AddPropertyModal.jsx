import { X } from "lucide-react";
import { useState } from "react";
import { useProperties } from "../../context/PropertyContext";

export default function AddPropertyModal({ onClose }) {
  const { addProperty } = useProperties();

  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    category: "apartment",
    rentalMode: "monthly",
    furnishing: "unfurnished",
    marketplace: ["rentals"],
    monthlyPrice: "",
    dailyPrice: "",
    servicesIncluded: {
      meals: false,
      laundry: false,
      cleaning: false,
      wifi: false,
    },
    description: "",
    images: [],
  });

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setForm({ ...form, images: urls });
  };

  const toggleService = (service) => {
    setForm({
      ...form,
      servicesIncluded: {
        ...form.servicesIncluded,
        [service]: !form.servicesIncluded[service],
      },
    });
  };

  const submit = () => {
    addProperty({
      ...form,
      id: Date.now(),
      units: [],
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 space-y-4 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Add Property</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <input className="input" placeholder="Property name"
          onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <div className="grid grid-cols-2 gap-3">
          <input className="input" placeholder="City"
            onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <input className="input" placeholder="Address / Area"
            onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>

        {/* CATEGORY */}
        <select
          className="input"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="commercial">Commercial</option>
          <option value="hostel">Hostel</option>
        </select>

        {/* RENTAL MODE */}
        <select
          className="input"
          value={form.rentalMode}
          onChange={(e) => setForm({ ...form, rentalMode: e.target.value })}
        >
          <option value="monthly">Monthly</option>
          <option value="daily">Daily</option>
          <option value="both">Daily & Monthly</option>
        </select>

        {/* FURNISHING (hidden for hostel) */}
        {form.category !== "hostel" && (
          <select
            className="input"
            value={form.furnishing}
            onChange={(e) => setForm({ ...form, furnishing: e.target.value })}
          >
            <option value="unfurnished">Unfurnished</option>
            <option value="semi-furnished">Semi-furnished</option>
            <option value="furnished">Furnished</option>
          </select>
        )}

        {/* SERVICES (important for hostels) */}
        <div className="border rounded-lg p-3 space-y-2">
          <p className="font-medium text-sm">Services Included</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {["meals", "laundry", "cleaning", "wifi"].map((s) => (
              <label key={s} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.servicesIncluded[s]}
                  onChange={() => toggleService(s)}
                />
                {s}
              </label>
            ))}
          </div>
        </div>

        {/* PRICING */}
        <div className="grid grid-cols-2 gap-3">
          <input
            className="input"
            placeholder="Monthly price (KSH)"
            type="number"
            onChange={(e) => setForm({ ...form, monthlyPrice: e.target.value })}
          />
          <input
            className="input"
            placeholder="Daily price (KSH)"
            type="number"
            onChange={(e) => setForm({ ...form, dailyPrice: e.target.value })}
          />
        </div>

        <input type="file" multiple onChange={handleImages} />

        <textarea
          className="input"
          placeholder="Description"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button
          onClick={submit}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Save Property
        </button>
      </div>
    </div>
  );
}
