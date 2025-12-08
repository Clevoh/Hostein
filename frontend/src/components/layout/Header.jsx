const Header = () => {
  return (
    <div className="w-full h-16 bg-white shadow flex items-center justify-between px-6 fixed top-0 left-64">
      <h2 className="text-xl font-semibold">Dashboard</h2>

      <div className="flex items-center gap-4">
        <span className="text-gray-600">Hello, Cleve</span>
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          C
        </div>
      </div>
    </div>
  );
};

export default Header;
