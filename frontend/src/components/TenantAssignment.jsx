import { useState, useEffect } from "react";
import { Home, MapPin, User, Calendar } from "lucide-react";

export default function TenantAssignment() {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignment();
  }, []);

  const fetchAssignment = async () => {
    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/tenant-assignments/my-assignment", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      
      if (data.hasAssignment) {
        setAssignment(data.assignment);
      }
    } catch (error) {
      console.error("Failed to fetch assignment:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!assignment) return null;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Home size={24} />
        <h3 className="text-xl font-bold">Your Assigned Property</h3>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-3">
        <div>
          <p className="text-sm text-white/70">Property</p>
          <p className="font-semibold text-lg">{assignment.property.title}</p>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span className="text-sm">{assignment.property.address}, {assignment.property.city}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/20">
          <div>
            <p className="text-sm text-white/70">Unit</p>
            <p className="font-semibold">{assignment.unit.unitNumber}</p>
          </div>
          <div>
            <p className="text-sm text-white/70">Rent</p>
            <p className="font-semibold">{assignment.unit.rentAmount.toLocaleString()} RWF/month</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-white/20">
          <User size={16} />
          <div>
            <p className="text-xs text-white/70">Assigned by</p>
            <p className="text-sm font-medium">{assignment.assignedBy.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <div>
            <p className="text-xs text-white/70">Assigned on</p>
            <p className="text-sm">{new Date(assignment.assignedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}