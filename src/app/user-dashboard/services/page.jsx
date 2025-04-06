'use client';

import { useEffect, useState } from 'react';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);

  const userId = 1; // Replace this with actual logged-in user's ID if available

  // Fetch services
  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/listservice');
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  // Fetch providers when a service is selected
  useEffect(() => {
    async function fetchProviders(serviceName) {
      setLoadingProviders(true);
      try {
        const res = await fetch(`/api/listprovider/${serviceName}`);
        const data = await res.json();
        setProviders(data);
      } catch (err) {
        console.error('Error fetching providers:', err);
        setProviders([]);
      } finally {
        setLoadingProviders(false);
      }
    }

    if (selectedService) {
      fetchProviders(selectedService.name);
    }
  }, [selectedService]);

  const handleChoose = (service) => {
    setSelectedService(service);
  };

  const handleBooking = async (providerId, providerName) => {
    try {
      const res = await fetch('/api/book-slot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, provider_id: providerId }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Slot successfully booked with ${providerName}`);
      } else {
        alert(`Booking failed: ${data.error}`);
      }
    } catch (err) {
      console.error('Error booking slot:', err);
      alert('Something went wrong while booking the slot.');
    }
  };

  if (loading) return <p className="p-4">Loading services...</p>;

  if (services.length === 0) {
    return <p className="p-4">No services available.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Available Services</h1>
      <ul className="space-y-4 mb-6">
        {services.map((service) => (
          <li
            key={service.id}
            className="flex items-center justify-between border-b pb-2"
          >
            <span className="text-md">{service.name}</span>
            <button
              onClick={() => handleChoose(service)}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Choose
            </button>
          </li>
        ))}
      </ul>

      {selectedService && (
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-4">
            Providers for: <span className="font-semibold">{selectedService.name}</span>
          </h2>

          {loadingProviders ? (
            <p>Loading providers...</p>
          ) : providers.length === 0 ? (
            <p>No providers available for this service.</p>
          ) : (
            <div className="space-y-4">
              {providers.map((provider) => (
                <div key={provider.id} className="p-4 border rounded bg-white shadow">
                  <h3 className="text-md font-bold">{provider.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{provider.bio || 'No bio available'}</p>
                  <p className="text-sm">📞 {provider.phone}</p>
                  <p className="text-sm">📍 {provider.address}</p>
                  <p className="text-sm">Experience: {provider.experience}</p>
                  <button
                    onClick={() => handleBooking(provider.id, provider.name)}
                    className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Book Slot
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
