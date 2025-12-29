// src/pages/client/ClientServices.jsx
export default function ClientServices() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">My Services</h1>

      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold mb-1">
          No services scheduled
        </h3>
        <p className="text-gray-600">
          Service bookings will appear here.
        </p>
      </div>
    </div>
  );
}
