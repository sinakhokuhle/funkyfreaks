import React, { useState } from 'react';
import { X, MapPin, Search } from 'lucide-react';

interface DeliveryMapProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  onClose: () => void;
}

export default function DeliveryMap({ onLocationSelect, onClose }: DeliveryMapProps) {
  const [searchAddress, setSearchAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

  // Mock locations for demo
  const mockLocations = [
    { lat: -33.9249, lng: 18.4241, address: 'Cape Town City Centre, Cape Town' },
    { lat: -33.9352, lng: 18.4056, address: 'Sea Point, Cape Town' },
    { lat: -33.9258, lng: 18.4232, address: 'V&A Waterfront, Cape Town' },
    { lat: -33.9584, lng: 18.4729, address: 'Claremont, Cape Town' },
    { lat: -33.8903, lng: 18.4049, address: 'Camps Bay, Cape Town' },
  ];

  const handleSearch = () => {
    // Mock search - in real app, use Google Places API
    const mockResult = mockLocations[Math.floor(Math.random() * mockLocations.length)];
    setSelectedLocation(mockResult);
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full h-[80vh] flex flex-col animate-fadeIn">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">Select Delivery Location</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          {/* Search */}
          <div className="flex space-x-2 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter delivery address..."
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Search
            </button>
          </div>

          {/* Mock Map Area */}
          <div className="flex-1 bg-gray-800 rounded-lg relative overflow-hidden mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Interactive Map</p>
                <p className="text-gray-500 text-sm">Click on the map to select delivery location</p>
              </div>
            </div>

            {/* Mock map pins */}
            {mockLocations.map((location, index) => (
              <button
                key={index}
                onClick={() => setSelectedLocation(location)}
                className={`absolute w-6 h-6 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                  selectedLocation?.address === location.address
                    ? 'bg-purple-600 scale-125'
                    : 'bg-red-600 hover:scale-110'
                }`}
                style={{
                  left: `${20 + (index * 15)}%`,
                  top: `${30 + (index * 10)}%`,
                }}
                title={location.address}
              >
                <MapPin className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </button>
            ))}
          </div>

          {/* Selected Location */}
          {selectedLocation && (
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-white font-semibold">Selected Location</p>
                  <p className="text-gray-400 text-sm">{selectedLocation.address}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Locations */}
          <div className="mb-6">
            <h4 className="text-white font-semibold mb-3">Quick Select</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {mockLocations.slice(0, 4).map((location, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedLocation(location)}
                  className={`text-left p-3 rounded-lg border transition-colors ${
                    selectedLocation?.address === location.address
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <p className="text-white text-sm">{location.address}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirmLocation}
            disabled={!selectedLocation}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}