import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Wrench, DollarSign } from "lucide-react";

export default function MyServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "cleaning",
    description: "",
    price: "",
    duration: "",
    isActive: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/service-provider/services", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingService
        ? `http://localhost:5000/api/service-provider/services/${editingService._id}`
        : "http://localhost:5000/api/service-provider/services";

      const method = editingService ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        fetchServices();
        closeModal();
      }
    } catch (error) {
      console.error("Failed to save service:", error);
      alert("Failed to save service");
    }
  };

  const handleDelete = async (serviceId) => {
    if (!confirm("Delete this service?")) return;

    try {
      await fetch(`http://localhost:5000/api/service-provider/services/${serviceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchServices();
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  };

  const openAddModal = () => {
    setForm({
      name: "",
      category: "cleaning",
      description: "",
      price: "",
      duration: "",
      isActive: true,
    });
    setEditingService(null);
    setShowAddModal(true);
  };

  const openEditModal = (service) => {
    setForm({
      name: service.name,
      category: service.category,
      description: service.description,
      price: service.price,
      duration: service.duration,
      isActive: service.isActive,
    });
    setEditingService(service);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingService(null);
  };

  const categories = [
    { value: "cleaning", label: "🧹 Cleaning" },
    { value: "plumbing", label: "🔧 Plumbing" },
    { value: "electrical", label: "⚡ Electrical" },
    { value: "carpentry", label: "🪚 Carpentry" },
    { value: "painting", label: "🎨 Painting" },
    { value: "gardening", label: "🌱 Gardening" },
    { value: "moving", label: "📦 Moving" },
    { value: "other", label: "🛠️ Other" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Services</h2>
          <p className="text-gray-500 mt-1">Manage your service offerings</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition"
        >
          <Plus size={20} />
          Add Service
        </button>
      </div>

      {/* SERVICES GRID */}
      {services.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed">
          <Wrench size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No services yet</h3>
          <p className="text-gray-500 mb-6">Start by adding your first service offering</p>
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition"
          >
            Add Your First Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service._id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">
                      {categories.find(c => c.value === service.category)?.label.split(' ')[0] || "🛠️"}
                    </span>
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  </div>
                  <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">
                    {categories.find(c => c.value === service.category)?.label.split(' ')[1] || service.category}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(service)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <Pencil size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Price:</span>
                  <span className="font-semibold text-gray-900 flex items-center gap-1">
                    <DollarSign size={14} />
                    {service.price}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium text-gray-900">{service.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status:</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    service.isActive 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {service.isActive ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingService ? "Edit Service" : "Add New Service"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:border-green-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:border-green-400"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:border-green-400"
                  rows="3"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (RWF)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:border-green-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 hours"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:border-green-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 text-green-600"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Available for booking
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition"
                >
                  {editingService ? "Update" : "Add"} Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
