import { X, MapPin, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PropertyDetailsModal({ property, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const images = property.images || [];
  const hasImages = images.length > 0;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="relative w-full h-full max-w-7xl mx-auto p-4 md:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-8 md:right-8 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full z-10 transition"
        >
          <X size={24} />
        </button>

        <div className="h-full flex flex-col md:flex-row gap-6">
          {/* LEFT: Image Gallery */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-full">
              {hasImages ? (
                <>
                  {/* Main Image */}
                  <img
                    src={getImageUrl(images[currentImageIndex])}
                    alt={property.title}
                    className="w-full h-[50vh] md:h-[70vh] object-contain rounded-lg"
                  />

                  {/* Image Navigation */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition"
                      >
                        <ChevronRight size={24} />
                      </button>

                      {/* Image Counter */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}

                  {/* Thumbnail Strip */}
                  {images.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                      {images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                            currentImageIndex === index
                              ? 'border-white'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={getImageUrl(img)}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-[50vh] md:h-[70vh] bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No images available</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Property Details */}
          <div className="w-full md:w-96 bg-white rounded-lg p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Category Badge */}
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {property.category === 'apartment' ? 'Apartment' : 
                 property.category === 'hostel' ? 'Hostel' : 'Short Stay'}
              </span>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900">{property.title}</h2>

              {/* Location */}
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin size={20} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{property.city}, {property.country}</p>
                  <p className="text-sm">{property.address}</p>
                </div>
              </div>

              {/* Price */}
              {property.rentType === 'daily' && property.pricePerNight && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ${property.pricePerNight}
                    </span>
                    <span className="text-gray-600">per night</span>
                  </div>
                </div>
              )}

              {property.rentType === 'monthly' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-gray-600" />
                    <span className="font-medium text-gray-900">Monthly Rental</span>
                  </div>
                </div>
              )}

              {/* Description */}
              {property.description && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{property.description}</p>
                </div>
              )}

              {/* Amenities (if you have them) */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability Status */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${property.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {property.isAvailable ? 'Available' : 'Not Available'}
                </span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  navigate(`/dashboard/properties/${property._id}/units`);
                  onClose();
                }}
                className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition"
              >
                Manage Units
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
