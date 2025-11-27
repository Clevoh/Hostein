const ChartPlaceholder = ({ title }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-gray-500 mb-2">{title}</p>
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        Chart goes here
      </div>
    </div>
  );
};

export default ChartPlaceholder;
