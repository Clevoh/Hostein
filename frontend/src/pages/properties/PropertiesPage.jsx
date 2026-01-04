import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Pencil } from "lucide-react";
import { useProperties } from "../../context/PropertyContext";
import AddPropertyModal from "./AddPropertyModal";
import Modal from "../../components/Modal";
import AddButton from "../../components/AddButton";

export default function PropertiesPage() {
  const { properties, deleteProperty } = useProperties();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Properties</h2>
        <AddButton label="Add Property" onClick={() => setOpen(true)} />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {properties.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl border shadow-sm overflow-hidden"
          >
            {p.images?.[0] && (
              <img
                src={p.images[0]}
                alt={p.name}
                className="h-40 w-full object-cover"
              />
            )}

            <div className="p-4 space-y-1">
              <h3 className="font-semibold text-lg">{p.name}</h3>

              <p className="text-sm text-gray-500">
                {p.city} — {p.address}
              </p>

              <div className="flex justify-between items-center mt-4">
                {/* ✅ CORRECT UNIT NAVIGATION */}
                <button
                  onClick={() =>
                    navigate(
                      `/dashboard/properties/${p.id}/units`
                    )
                  }
                  className="flex items-center gap-1 text-sm text-blue-600"
                >
                  <Plus size={14} /> Manage Units
                </button>

                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteId(p.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {properties.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-12">
            No properties added yet
          </div>
        )}
      </div>

      {/* ADD PROPERTY MODAL */}
      {open && <AddPropertyModal onClose={() => setOpen(false)} />}

      {/* DELETE MODAL */}
      <Modal
        title="Delete Property"
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this property?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteId(null)}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              deleteProperty(deleteId);
              setDeleteId(null);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
