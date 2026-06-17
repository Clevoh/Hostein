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
  Trash2,
  Search,
} from "lucide-react";
import { getAllUnits, deleteUnit } from "../../services/unitService";

export default function AllUnitsPage() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupedUnits, setGroupedUnits] = useState({});
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = async () => {
    try {
      setLoading(true);

      const data = await getAllUnits();
      const list = Array.isArray(data) ? data : [];

      setUnits(list);

      const grouped = list.reduce((acc, unit) => {
        const propertyId = unit.property?._id || "unassigned";

        if (!acc[propertyId]) {
          acc[propertyId] = {
            propertyName: unit.property?.title || "Unassigned",
            propertyCity: unit.property?.city || "",
            propertyImages: unit.property?.images || [],
            units: [],
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
    if (!window.confirm("Delete this unit permanently?")) return;

    try {
      await deleteUnit(unitId);
      loadUnits();
    } catch {
      alert("Failed to delete unit");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;

    return `${import.meta.env.VITE_API_URL}${imagePath}`;
  };

  const totalUnits = units.length;
  const occupiedUnits = units.filter((u) => u.isOccupied).length;
  const vacantUnits = totalUnits - occupiedUnits;

  const totalRevenue = units.reduce(
    (sum, u) => (u.isOccupied ? sum + u.rentAmount : sum),
    0
  );

  const filteredGroups = Object.entries(groupedUnits).reduce(
    (acc, [id, data]) => {
      const filtered = data.units.filter((u) => {
        const q = search.toLowerCase();

        return (
          !q ||
          u.unitNumber?.toLowerCase().includes(q) ||
          u.unitType?.toLowerCase().includes(q) ||
          data.propertyName?.toLowerCase().includes(q)
        );
      });

      if (filtered.length > 0) {
        acc[id] = { ...data, units: filtered };
      }

      return acc;
    },
    {}
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-2 animate-spin"
            style={{
              borderColor: "var(--border)",
              borderTopColor: "var(--text)",
            }}
          />

          <p
            className="text-sm"
            style={{ color: "var(--text2)" }}
          >
            Loading units…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            All Units
          </h1>

          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--text2)" }}
          >
            Manage units across all properties
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/properties")}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm text-white"
          style={{ background: "var(--text)" }}
        >
          <Building2 size={15} />
          Go to Properties
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Total Units",
            value: totalUnits,
            icon: Home,
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "Occupied",
            value: occupiedUnits,
            icon: CheckCircle,
            color: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Vacant",
            value: vacantUnits,
            icon: XCircle,
            color: "bg-orange-50 text-orange-600",
          },
          {
            label: "Monthly Revenue",
            value: `$${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "bg-violet-50 text-violet-600",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl p-4 border shadow-sm"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <p
                className="text-xs font-medium"
                style={{ color: "var(--text2)" }}
              >
                {label}
              </p>

              <div className={`p-2 rounded-xl ${color}`}>
                <Icon size={15} />
              </div>
            </div>

            <p
              className="text-xl font-bold"
              style={{ color: "var(--text)" }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text2)" }}
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by unit number, type, or property…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 transition"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
        />
      </div>

      {/* GROUPED UNITS */}
      <div className="space-y-8">
        {Object.entries(filteredGroups).map(([propertyId, data]) => (
          <div key={propertyId}>
            {/* Property header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--bg)" }}
              >
                <Building2
                  size={15}
                  style={{ color: "var(--text2)" }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className="font-semibold truncate"
                  style={{ color: "var(--text)" }}
                >
                  {data.propertyName}
                </h3>

                {data.propertyCity && (
                  <p
                    className="text-xs flex items-center gap-1"
                    style={{ color: "var(--text2)" }}
                  >
                    <MapPin size={10} />
                    {data.propertyCity}
                  </p>
                )}
              </div>

              <span
                className="text-xs flex-shrink-0"
                style={{ color: "var(--text2)" }}
              >
                {data.units.length} unit
                {data.units.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {data.units.map((unit) => {
                const img =
                  unit.images?.[0] || data.propertyImages?.[0];

                return (
                  <div
                    key={unit._id}
                    className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {/* IMAGE */}
                    <div
                      className="relative h-36"
                      style={{ background: "var(--bg)" }}
                    >
                      {img ? (
                        <img
                          src={getImageUrl(img)}
                          alt={unit.unitNumber}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home
                            size={32}
                            style={{ color: "var(--text2)" }}
                          />
                        </div>
                      )}

                      {/* STATUS */}
                      <div className="absolute top-2.5 right-2.5">
                        {unit.isOccupied ? (
                          <span className="flex items-center gap-1 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                            <CheckCircle size={10} />
                            Occupied
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                            <XCircle size={10} />
                            Vacant
                          </span>
                        )}
                      </div>

                      {/* ACTIONS */}
                      <div className="absolute top-2.5 left-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            navigate(
                              `/dashboard/properties/${unit.property?._id}/units`
                            )
                          }
                          className="p-1.5 rounded-xl shadow transition"
                          style={{ background: "var(--surface)" }}
                        >
                          <Pencil
                            size={12}
                            style={{ color: "var(--text)" }}
                          />
                        </button>

                        <button
                          onClick={() => handleDelete(unit._id)}
                          className="p-1.5 rounded-xl shadow transition"
                          style={{ background: "var(--surface)" }}
                        >
                          <Trash2
                            size={12}
                            className="text-red-500"
                          />
                        </button>
                      </div>
                    </div>

                    {/* INFO */}
                    <div className="p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className="font-semibold text-sm"
                          style={{ color: "var(--text)" }}
                        >
                          Unit {unit.unitNumber}
                        </span>

                        <span
                          className="text-xs px-2 py-0.5 rounded-lg"
                          style={{
                            background: "var(--bg)",
                            color: "var(--text2)",
                          }}
                        >
                          {unit.unitType}
                        </span>
                      </div>

                      <p
                        className="text-xs"
                        style={{ color: "var(--text2)" }}
                      >
                        🛏 {unit.bedrooms} Bed · 🚿 {unit.bathrooms} Bath
                      </p>

                      <div
                        className="flex items-center justify-between pt-2 border-t"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <span
                          className="text-xs"
                          style={{ color: "var(--text2)" }}
                        >
                          Monthly
                        </span>

                        <span
                          className="font-bold text-sm"
                          style={{ color: "var(--text)" }}
                        >
                          ${unit.rentAmount.toLocaleString()}
                        </span>
                      </div>

                      {unit.tenant && (
                        <div
                          className="flex items-center gap-1.5 text-xs pt-1 border-t"
                          style={{
                            color: "var(--text2)",
                            borderColor: "var(--border)",
                          }}
                        >
                          <Users size={11} />
                          <span className="truncate">
                            {unit.tenant.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY */}
      {units.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
            style={{ background: "var(--bg)" }}
          >
            <Home
              size={36}
              style={{ color: "var(--text2)" }}
            />
          </div>

          <h3
            className="text-xl font-bold mb-2"
            style={{ color: "var(--text)" }}
          >
            No units yet
          </h3>

          <p
            className="text-sm mb-6 max-w-xs"
            style={{ color: "var(--text2)" }}
          >
            Start by adding properties and units to manage your rentals
          </p>

          <button
            onClick={() => navigate("/dashboard/properties")}
            className="px-6 py-3 rounded-xl font-medium text-sm transition text-white"
            style={{ background: "var(--text)" }}
          >
            Go to Properties
          </button>
        </div>
      )}
    </div>
  );
}