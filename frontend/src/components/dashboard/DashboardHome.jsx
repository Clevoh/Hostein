const DashboardHome = () => {
  return (
    <div className="ml-64 mt-16 p-8">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-gray-500 text-sm">Total Tenants</h3>
          <p className="text-3xl font-bold mt-2">32</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-gray-500 text-sm">Total Units</h3>
          <p className="text-3xl font-bold mt-2">56</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-gray-500 text-sm">Occupied Units</h3>
          <p className="text-3xl font-bold mt-2">41</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-gray-500 text-sm">Monthly Revenue</h3>
          <p className="text-3xl font-bold mt-2">KSH 270,000</p>
        </div>

      </div>

      {/* Recent Tenants Table */}
      <div className="bg-white shadow rounded-xl p-6 mt-10">
        <h3 className="text-lg font-semibold mb-4">Recent Tenants</h3>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Name</th>
              <th className="py-2">Unit</th>
              <th className="py-2">Phone</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">John Mwangi</td>
              <td className="py-2">A12</td>
              <td className="py-2">0712345678</td>
              <td className="py-2 text-green-500 font-semibold">Active</td>
            </tr>

            <tr className="border-b">
              <td className="py-2">Sarah Wanjiku</td>
              <td className="py-2">B03</td>
              <td className="py-2">0798765432</td>
              <td className="py-2 text-green-500 font-semibold">Active</td>
            </tr>

            <tr>
              <td className="py-2">Peter Otieno</td>
              <td className="py-2">C07</td>
              <td className="py-2">0700112233</td>
              <td className="py-2 text-yellow-500 font-semibold">Pending</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default DashboardHome;
