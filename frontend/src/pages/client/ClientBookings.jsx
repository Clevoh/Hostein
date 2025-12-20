export default function ClientBookings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Bookings</h1>

      <div className="bg-white rounded-xl border p-6 text-center">
        <p className="text-gray-600 mb-4">
          You don’t have any bookings yet.
        </p>
        <button className="px-5 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
          Find a place to stay
        </button>
      </div>
    </div>
  );
}
