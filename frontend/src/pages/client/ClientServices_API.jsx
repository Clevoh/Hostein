// src/pages/client/ClientServices.jsx
import { useState, useEffect } from "react";
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
import {
  getMyServices,
  getAvailableServices,
  bookService,
  cancelServiceBooking,
  rescheduleService,
} from "../../services/serviceService";

export default function ClientServices() {
  const [activeTab, setActiveTab] = useState("all");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myServices, setMyServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);

  const [bookingForm, setBookingForm] = useState({
    date: "",
    time: "",
    notes: "",
  });

  // Icon mapping for available services
  const iconMap = {
    "AC Maintenance": Wind,
    "Plumbing Service": Droplet,
    "Electrical Repair": Zap,
    "Deep Cleaning": Sparkles,
    "Regular Cleaning": Sparkles,
    "Move-in/Move-out": Package,
  };

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const [myServicesData, availableServicesData] = await Promise.all([
        getMyServices(),
        getAvailableServices(),
      ]);

      setMyServices(myServicesData);
      
      // Add icons to available services
      const servicesWithIcons = availableServicesData.map((service) => ({
        ...service,
        icon: iconMap[service.name] || Wrench,
      }));
      
      setAvailableServices(servicesWithIcons);
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  };

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
      cancelled: {
        text: "Cancelled",
        className: "bg-red-100 text-red-700 border-red-200",
      },
    };

    const badge = badges[status] || badges.scheduled;
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

  const handleSubmitBooking = async () => {
    if (!bookingForm.date || !bookingForm.time) {
      alert("Please select date and time");
      return;
    }

    try {
      await bookService({
        serviceType: selectedService.name,
        provider: "Default Provider",
        description: selectedService.description,
        scheduledDate: bookingForm.date,
        scheduledTime: bookingForm.time,
        price: selectedService.price,
        duration: selectedService.duration,
        category: selectedService.category,
        notes: bookingForm.notes,
      });

      alert("Service booked successfully!");
      setIsBookingModalOpen(false);
      setBookingForm({ date: "", time: "", notes: "" });
      loadServices(); // Reload services
    } catch (error) {
      alert("Failed to book service: " + (error.response?.data?.message || error.message));
    }
  };

  const handleCancelService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to cancel this service?")) return;

    try {
      await cancelServiceBooking(serviceId);
      await loadServices(); // Reload services
    } catch (error) {
      alert("Failed to cancel service: " + (error.response?.data?.message || error.message));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const tabs = [
    { id: "all", label: "All Services", count: myServices.length },
    {
      id: "scheduled",
      label: "Scheduled",
      count: myServices.filter((s) => s.status === "scheduled").length,
    },
    {
      id: "completed",
      label: "Completed",
      count: myServices.filter((s) => s.status === "completed").length,
    },
  ];

  const filteredServices = myServices.filter((service) => {
    if (activeTab === "all") return true;
    return service.status === activeTab;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading services...</p>
        </div>
      </div>
    );
  }

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
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
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
                  key={service._id}
                  className="p-4 border rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {service.serviceType}
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
                        {formatDate(service.scheduledDate)}
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
                      <>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancelService(service._id)}
                          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </>
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
              min={new Date().toISOString().split("T")[0]}
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
