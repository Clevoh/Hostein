export default function Reports() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Reports & Analytics</h2>

      <p className="text-gray-600 mb-6">
        View system statistics, revenue and platform performance.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">Total Users</h3>
          <p className="text-2xl mt-2">—</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">Active Listings</h3>
          <p className="text-2xl mt-2">—</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">Monthly Revenue</h3>
          <p className="text-2xl mt-2">—</p>
        </div>
      </div>
    </div>
  );
}
