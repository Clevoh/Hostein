// src/components/AddButton.jsx
import { Plus } from "lucide-react";

export default function AddButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
    >
      <Plus size={18} />
      {label}
    </button>
  );
}
