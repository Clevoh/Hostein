import { useState, useEffect } from "react";
import { Search, Home, MapPin, DollarSign, Eye } from "lucide-react";
import { getAllProperties, updatePropertyStatus, deleteProperty } from "../../services/adminService";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadProperties();
  }, [statusFilter]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (statusFilter !== "all") filters.status = statusFilter;
      if (searchQuery) filters.search = searchQuery;
      
      const data = await getAllProperties(filters);
      setProperties(data);
    } catch (error) {
      console.error("Failed to load properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (propertyId, newStatus) => {
    try {
      await updatePropertyStatus(propertyId, newStatus);
      loadProperties();
    } catch (error) {
      alert("Failed to update property status");
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    
    try {
      await deleteProperty(propertyId);
      loadProperties();
    } catch (error) {
      alert("Failed to delete property");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      inactive: "bg-gray-100 text-gray-700 border-gray-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
    };
    return badges[status] || badges.pending;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const filteredProperties = properties.filter((property) =>
    property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
        <p className="text-gray-600 mt-1">Monitor all properties listed on the platform</p>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && loadProperties()}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={loadProperties}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Total Properties</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{properties.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {properties.filter((p) => p.status === "active").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {properties.filter((p) => p.status === "pending").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Inactive</p>
          <p className="text-2xl font-bold text-gray-600 mt-1">
            {properties.filter((p) => p.status === "inactive").length}
          </p>
        </div>
      </div>

      {/* PROPERTIES GRID */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property._id}
              className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* IMAGE */}
              <div className="h-48 overflow-hidden">
                <img
                  src={getImageUrl(property.images?.[0])}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{property.title}</h3>
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                      property.status
                    )}`}
                  >
                    {property.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
                  <MapPin size={14} />
                  {property.city}, {property.country}
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <DollarSign size={14} />
                    {property.price}/mo
                  </span>
                  <span className="flex items-center gap-1">
                    <Home size={14} />
                    {property.units?.length || 0} units
                  </span>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  <p>Host: {property.owner?.name || "Unknown"}</p>
                  <p>Listed: {new Date(property.createdAt).toLocaleDateString()}</p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">
                  {property.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(property._id, "active")}
                        className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(property._id, "rejected")}
                        className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {property.status === "active" && (
                    <button
                      onClick={() => handleUpdateStatus(property._id, "inactive")}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
                    >
                      Deactivate
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteProperty(property._id)}
                    className="px-3 py-2 text-red-600 border border-red-300 text-sm rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <p className="text-gray-500">No properties found</p>
        </div>
      )}
    </div>
  );
}
