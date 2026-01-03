import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 180000 },
  { month: "Feb", revenue: 220000 },
  { month: "Mar", revenue: 270000 },
  { month: "Apr", revenue: 250000 },
];

const occupancyData = [
  { name: "Occupied", value: 35 },
  { name: "Vacant", value: 13 },
];

const COLORS = ["#2563eb", "#e5e7eb"];

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* MONTHLY REVENUE */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="font-semibold mb-4">Monthly Revenue</h3>

        {/* 🔥 FIX: explicit height wrapper */}
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="revenue"
                fill="#2563eb"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* OCCUPANCY RATE */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="font-semibold mb-4">Occupancy Rate</h3>

        {/* 🔥 FIX: explicit height wrapper */}
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={occupancyData}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
              >
                {occupancyData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-6 mt-4 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-600 rounded-full" />
            Occupied
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-gray-300 rounded-full" />
            Vacant
          </span>
        </div>
      </div>
    </div>
  );
}
