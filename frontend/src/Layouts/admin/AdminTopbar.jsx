// src/Layouts/admin/AdminTopbar.jsx
export default function AdminTopbar() {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow flex items-center justify-between px-6 z-10">
      <h2 className="text-lg font-semibold">Admin Dashboard</h2>

      <div className="flex items-center gap-4">
        <span className="text-gray-600">Admin</span>
        <div className="w-9 h-9 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
          A
        </div>
      </div>
    </header>
  );
}
