import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  DollarSign,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  Building2,
  Pencil,
  Trash2
} from "lucide-react";
import { getAllUnits, deleteUnit } from "../../services/unitService";
import AddButton from "../../components/AddButton";

export default function AllUnitsPage() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupedUnits, setGroupedUnits] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = async () => {
    try {
      setLoading(true);
      const data = await getAllUnits();
      setUnits(Array.isArray(data) ? data : []);

      // Group units by property
      const grouped = (Array.isArray(data) ? data : []).reduce((acc, unit) => {
        const propertyId = unit.property?._id || 'unassigned';
        const propertyName = unit.property?.title || 'Unassigned';

        if (!acc[propertyId]) {
          acc[propertyId] = {
            propertyName,
            propertyCity: unit.property?.city || '',
            propertyImages: unit.property?.images || [],
            units: []
          };
        }
        acc[propertyId].units.push(unit);
        return acc;
      }, {});

      setGroupedUnits(grouped);
    } catch (error) {
      console.error("Failed to load units:", error);
      setUnits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (unitId) => {
    if (!window.confirm("Are you sure you want to delete this unit?")) return;

    try {
      await deleteUnit(unitId);
      loadUnits(); // Reload to refresh the grouping
    } catch (error) {
      alert("Failed to delete unit");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading units...</p>
        </div>
      </div>
    );
  }

  const totalUnits = units.length;
  const occupiedUnits = units.filter(u => u.isOccupied).length;
  const vacantUnits = totalUnits - occupiedUnits;
  const totalRevenue = units.reduce((sum, u) => u.isOccupied ? sum + u.rentAmount : sum, 0);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">All Units</h2>
          <p className="text-gray-500 mt-1">Manage units across all properties</p>
        </div>
        <AddButton
          label="Add Property"
          onClick={() => navigate('/dashboard/properties')}
        />
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Units</p>
              <p className="text-2xl font-bold text-gray-900">{totalUnits}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Home className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Occupied</p>
              <p className="text-2xl font-bold text-green-600">{occupiedUnits}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Vacant</p>
              <p className="text-2xl font-bold text-orange-600">{vacantUnits}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <XCircle className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <DollarSign className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* UNITS GROUPED BY PROPERTY */}
      <div className="space-y-8">
        {Object.entries(groupedUnits).map(([propertyId, data]) => (
          <div key={propertyId} className="space-y-4">
            {/* PROPERTY HEADER */}
            <div className="flex items-center gap-3 pb-2 border-b">
              <Building2 className="text-gray-600" size={20} />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {data.propertyName}
                </h3>
                {data.propertyCity && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin size={14} />
                    {data.propertyCity}
                  </p>
                )}
              </div>
              <span className="ml-auto text-sm text-gray-500">
                {data.units.length} unit{data.units.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* UNITS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {data.units.map((unit) => (
                <div
                  key={unit._id}
                  className="group bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* UNIT IMAGE - Prioritize unit images, fallback to property images */}
                  <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200">
                    {unit.images && unit.images.length > 0 ? (
                      <img
                        src={getImageUrl(unit.images[0])}
                        alt={unit.unitNumber}
                        className="w-full h-full object-cover"
                      />
                    ) : data.propertyImages?.[0] ? (
                      <img
                        src={getImageUrl(data.propertyImages[0])}
                        alt={unit.unitNumber}
                        className="w-full h-full object-cover opacity-70"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="text-gray-300" size={48} />
                      </div>
                    )}

                    {/* STATUS BADGE */}
                    <div className="absolute top-3 right-3">
                      {unit.isOccupied ? (
                        <span className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                          <CheckCircle size={12} />
                          Occupied
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                          <XCircle size={12} />
                          Vacant
                        </span>
                      )}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/properties/${unit.property?._id}/units`);
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg transition"
                        title="Edit unit"
                      >
                        <Pencil size={14} className="text-gray-700" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(unit._id);
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg transition"
                        title="Delete unit"
                      >
                        <Trash2 size={14} className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* UNIT INFO */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">
                        Unit {unit.unitNumber}
                      </h4>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {unit.unitType}
                      </span>
                    </div>

                    {/* DETAILS */}
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>🛏️ {unit.bedrooms} Bed · 🚿 {unit.bathrooms} Bath</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-xs text-gray-500">Monthly Rent</span>
                        <span className="font-bold text-gray-900">
                          ${unit.rentAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* TENANT INFO */}
                    {unit.tenant && (
                      <div className="flex items-center gap-2 pt-2 border-t text-sm">
                        <Users size={14} className="text-gray-400" />
                        <span className="text-gray-600 truncate">
                          {unit.tenant.name}
                        </span>
                      </div>
                    )}

                    {/* IMAGE COUNT */}
                    {unit.images && unit.images.length > 1 && (
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        📷 {unit.images.length} images
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {units.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No units yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start by adding properties and units to manage your rentals
              </p>
              <button
                onClick={() => navigate('/dashboard/properties')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                Go to Properties
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
