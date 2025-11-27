const StatCard = ({ title, number }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 text-center">
      <p className="text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-2">{number}</p>
    </div>
  );
};

export default StatCard;
