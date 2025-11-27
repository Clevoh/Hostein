import Card from "../../components/Card";
import StatCard from "../../components/StatCard";
import ChartPlaceholder from "../../components/ChartPlaceholder";

const DashboardHome = () => {
  return (
    <div className="p-8 ml-64">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard title="Total Tenants" number={120} />
        <StatCard title="Empty Units" number={30} />
        <StatCard title="Revenue" number="$45,000" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartPlaceholder title="Monthly Revenue" />
        <ChartPlaceholder title="Occupancy Rate" />
      </div>
    </div>
  );
};

export default DashboardHome;
