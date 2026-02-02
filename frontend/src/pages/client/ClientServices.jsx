// src/pages/client/ClientServices.jsx
import { useState } from "react";
import {
  Wrench,
  Droplet,
  Zap,
  Wind,
  Sparkles,
  Package,
  Clock,
  CheckCircle,
  Calendar,
  DollarSign,
  Plus,
} from "lucide-react";
import Modal from "../../components/Modal";

export default function ClientServices() {
  const [activeTab, setActiveTab] = useState("all");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    date: "",
    time: "",
    notes: "",
  });

  const [myServices] = useState([
    {
      id: 1,
      name: "AC Repair",
      provider: "CoolTech Solutions",
      status: "scheduled",
      scheduledDate: "Feb 15, 2026",
      scheduledTime: "10:00 AM",
      price: 120,
      category: "maintenance",
    },
    {
      id: 2,
      name: "Deep Cleaning",
      provider: "Sparkle Clean Co",
      status: "in-progress",
      scheduledDate: "Feb 10, 2026",
      scheduledTime: "2:00 PM",
      price: 85,
      category: "cleaning",
    },
    {
      id: 3,
      name: "Plumbing Repair",
      provider: "QuickFix Plumbing",
      status: "completed",
      scheduledDate: "Jan 28, 2026",
      scheduledTime: "11:00 AM",
      price: 95,
      category: "maintenance",
    },
  ]);

  const [availableServices] = useState([
    {
      id: 1,
      name: "AC Maintenance",
      description: "Regular AC servicing and cleaning",
      category: "maintenance",
      icon: Wind,
      price: 80,
      duration: "2 hours",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Plumbing Service",
      description: "Fix leaks, unclog drains, repair pipes",
      category: "maintenance",
      icon: Droplet,
      price: 100,
      duration: "1-3 hours",
      rating: 4.7,
    },
    {
      id: 3,
      name: "Electrical Repair",
      description: "Fix wiring, outlets, and lighting issues",
      category: "maintenance",
      icon: Zap,
      price: 90,
      duration: "1-2 hours",
      rating: 4.9,
    },
    {
      id: 4,
      name: "Deep Cleaning",
      description: "Thorough cleaning of entire property",
      category: "cleaning",
      icon: Sparkles,
      price: 150,
      duration: "3-4 hours",
      rating: 4.6,
    },
    {
      id: 5,
      name: "Regular Cleaning",
      description: "Weekly or bi-weekly cleaning service",
      category: "cleaning",
      icon: Sparkles,
      price: 60,
      duration: "2 hours",
      rating: 4.5,
    },
    {
      id: 6,
      name: "Move-in/Move-out",
      description: "Complete property preparation service",
      category: "other",
      icon: Package,
      price: 200,
      duration: "4-5 hours",
      rating: 4.8,
    },
  ]);

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: {
        text: "Scheduled",
        className: "bg-blue-100 text-blue-700 border-blue-200",
      },
      "in-progress": {
        text: "In Progress",
        className: "bg-yellow-100 text-yellow-700 border-yellow-200",
      },
      completed: {
        text: "Completed",
        className: "bg-green-100 text-green-700 border-green-200",
      },
    };

    const badge = badges[status];
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${badge.className}`}
      >
        {badge.text}
      </span>
    );
  };

  const handleBookService = (service) => {
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  const handleSubmitBooking = () => {
    if (!bookingForm.date || !bookingForm.time) {
      alert("Please select date and time");
      return;
    }

    alert(`Service booked successfully!\nDate: ${bookingForm.date}\nTime: ${bookingForm.time}`);
    setIsBookingModalOpen(false);
    setBookingForm({ date: "", time: "", notes: "" });
  };

  const tabs = [
    { id: "all", label: "All Services" },
    { id: "scheduled", label: "Scheduled" },
    { id: "completed", label: "Completed" },
  ];

  const filteredServices = myServices.filter((service) => {
    if (activeTab === "all") return true;
    return service.status === activeTab;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
        <p className="text-gray-600 mt-1">
          Book and manage maintenance and cleaning services
        </p>
      </div>

      {/* MY SERVICES SECTION */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            My Service Bookings
          </h2>
        </div>

        {/* TABS */}
        <div className="px-6 border-b">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 font-medium text-sm transition-colors relative ${
                  activeTab === tab.id
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* SERVICES LIST */}
        <div className="p-6">
          {filteredServices.length > 0 ? (
            <div className="space-y-4">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Provider: {service.provider}
                      </p>
                    </div>
                    {getStatusBadge(service.status)}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p className="font-medium text-gray-900 flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        {service.scheduledDate}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Time</p>
                      <p className="font-medium text-gray-900 flex items-center gap-1">
                        <Clock size={14} className="text-gray-400" />
                        {service.scheduledTime}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Price</p>
                      <p className="font-medium text-gray-900 flex items-center gap-1">
                        <DollarSign size={14} className="text-gray-400" />
                        ${service.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      View Details
                    </button>
                    {service.status === "scheduled" && (
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        Reschedule
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-600">No {activeTab} services</p>
            </div>
          )}
        </div>
      </div>

      {/* AVAILABLE SERVICES */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Available Services
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Book professional services for your property
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableServices.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="border rounded-xl p-5 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-lg ${
                        service.category === "maintenance"
                          ? "bg-blue-100"
                          : service.category === "cleaning"
                          ? "bg-purple-100"
                          : "bg-green-100"
                      }`}
                    >
                      <Icon
                        size={24}
                        className={
                          service.category === "maintenance"
                            ? "text-blue-600"
                            : service.category === "cleaning"
                            ? "text-purple-600"
                            : "text-green-600"
                        }
                      />
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium text-gray-900">
                        {service.rating}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 text-lg mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between mb-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-medium text-gray-900 text-sm">
                        {service.duration}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Starting at</p>
                      <p className="font-bold text-gray-900 text-xl">
                        ${service.price}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookService(service)}
                    className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 group-hover:shadow-md"
                  >
                    <Plus size={18} />
                    Book Service
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOOKING MODAL */}
      <Modal
        title={`Book ${selectedService?.name || "Service"}`}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setBookingForm({ date: "", time: "", notes: "" });
        }}
      >
        <div className="space-y-4">
          {selectedService && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    selectedService.category === "maintenance"
                      ? "bg-blue-100"
                      : selectedService.category === "cleaning"
                      ? "bg-purple-100"
                      : "bg-green-100"
                  }`}
                >
                  {selectedService.icon &&
                    (() => {
                      const Icon = selectedService.icon;
                      return (
                        <Icon
                          size={20}
                          className={
                            selectedService.category === "maintenance"
                              ? "text-blue-600"
                              : selectedService.category === "cleaning"
                              ? "text-purple-600"
                              : "text-green-600"
                          }
                        />
                      );
                    })()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedService.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedService.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>Duration: {selectedService.duration}</span>
                    <span>•</span>
                    <span className="font-semibold text-gray-900">
                      ${selectedService.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Preferred Date
            </label>
            <input
              type="date"
              value={bookingForm.date}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, date: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Preferred Time
            </label>
            <select
              value={bookingForm.time}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, time: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Select time</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="01:00 PM">01:00 PM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Additional Notes (Optional)
            </label>
            <textarea
              value={bookingForm.notes}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, notes: e.target.value })
              }
              rows={3}
              placeholder="Any specific requirements or instructions..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setIsBookingModalOpen(false);
                setBookingForm({ date: "", time: "", notes: "" });
              }}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitBooking}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
