import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import AddButton from "../../components/AddButton";
import Modal from "../../components/Modal";
import { useProperties } from "../../context/PropertyContext";

export default function PropertyUnits() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { properties, addUnit } = useProperties();

  const property = properties.find((p) => p.id == propertyId);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    number: "",
    rent: "",
    status: "vacant",
  });

  if (!property) return <p>Property not found</p>;

  const submit = (e) => {
    e.preventDefault();

    addUnit(property.id, {
      id: Date.now(),
      ...form,
    });

    setOpen(false);
    setForm({ number: "", rent: "", status: "vacant" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">
          Units — {property.name}
        </h1>
      </div>

      <AddButton label="Add Unit" onClick={() => setOpen(true)} />

      <div className="bg-white border rounded-xl">
        {property.units.map((u) => (
          <div key={u.id} className="p-4 border-b">
            {u.number} — KSH {u.rent} ({u.status})
          </div>
        ))}
      </div>

      <Modal title="Add Unit" isOpen={open} onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full border px-3 py-2 rounded-lg"
            placeholder="Unit Number"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
            required
          />
          <input
            type="number"
            className="w-full border px-3 py-2 rounded-lg"
            placeholder="Rent"
            value={form.rent}
            onChange={(e) => setForm({ ...form, rent: e.target.value })}
            required
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
            Save Unit
          </button>
        </form>
      </Modal>
    </div>
  );
}
