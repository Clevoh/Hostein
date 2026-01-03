import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RevenueChart({ data }) {
  const formatted = data.map((item) => ({
    month: `${item._id.month}/${item._id.year}`,
    amount: item.total,
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow h-80">
      <h3 className="font-semibold mb-4">Monthly Revenue</h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formatted}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
