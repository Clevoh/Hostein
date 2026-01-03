import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function OccupancyChart({ occupied, empty }) {
  const data = [
    { name: "Occupied", value: occupied },
    { name: "Empty", value: empty },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow h-80">
      <h3 className="font-semibold mb-4">Unit Occupancy</h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={100} label>
            <Cell />
            <Cell />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
