import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

export default function AssignTenant() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [units, setUnits] = useState([]);

  const [formData, setFormData] = useState({
    clientEmail: "",
    propertyId: "",
    unitId: "",
    rentAmount: "",
    leaseStart: "",
    leaseEnd: "",
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      fetchUnits(selectedProperty);
    }
  }, [selectedProperty]);

  const fetchProperties = async () => {
    const res = await fetch("${import.meta.env.VITE_API_URL}/api/properties/mine", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    setProperties(data);
  };

  const fetchUnits = async (propertyId) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/units/property/${propertyId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await res.json();
    setUnits(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "${import.meta.env.VITE_API_URL}/api/tenant-assignments/assign",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(data.message);

        setFormData({
          clientEmail: "",
          propertyId: "",
          unitId: "",
          rentAmount: "",
          leaseStart: "",
          leaseEnd: "",
        });

        setSelectedProperty("");
      } else {
        alert(data.message || "Failed to assign tenant");
      }
    } catch (error) {
      alert("Error assigning tenant");
    }
  };

  const inputStyle = {
    borderColor: "var(--border)",
    background: "var(--surface)",
    color: "var(--text)",
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="rounded-xl p-6 shadow"
        style={{ background: "var(--surface)" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Plus size={24} />

          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--text)" }}
          >
            Assign Tenant to Unit
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--text)" }}
            >
              Client Email
            </label>

            <input
              type="email"
              value={formData.clientEmail}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  clientEmail: e.target.value,
                })
              }
              className="w-full px-4 py-2 border rounded-lg"
              style={inputStyle}
              placeholder="client@example.com"
              required
            />

            <p
              className="text-xs mt-1"
              style={{ color: "var(--text2)" }}
            >
              We'll create an account for them if they don't have one
            </p>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--text)" }}
            >
              Property
            </label>

            <select
              value={selectedProperty}
              onChange={(e) => {
                setSelectedProperty(e.target.value);

                setFormData({
                  ...formData,
                  propertyId: e.target.value,
                });
              }}
              className="w-full px-4 py-2 border rounded-lg"
              style={inputStyle}
              required
            >
              <option value="">Select Property</option>

              {properties.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--text)" }}
            >
              Unit
            </label>

            <select
              value={formData.unitId}
              onChange={(e) => {
                const unit = units.find(
                  (u) => u._id === e.target.value
                );

                setFormData({
                  ...formData,
                  unitId: e.target.value,
                  rentAmount: unit?.rentAmount || "",
                });
              }}
              className="w-full px-4 py-2 border rounded-lg"
              style={inputStyle}
              required
              disabled={!selectedProperty}
            >
              <option value="">Select Unit</option>

              {units
                .filter((u) => !u.isOccupied)
                .map((u) => (
                  <option key={u._id} value={u._id}>
                    Unit {u.unitNumber} - {u.unitType}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--text)" }}
            >
              Rent Amount (RWF)
            </label>

            <input
              type="number"
              value={formData.rentAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  rentAmount: e.target.value,
                })
              }
              className="w-full px-4 py-2 border rounded-lg"
              style={inputStyle}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--text)" }}
              >
                Lease Start
              </label>

              <input
                type="date"
                value={formData.leaseStart}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    leaseStart: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--text)" }}
              >
                Lease End
              </label>

              <input
                type="date"
                value={formData.leaseEnd}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    leaseEnd: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
                style={inputStyle}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
          >
            Assign Tenant
          </button>
        </form>
      </div>
    </div>
  );
}