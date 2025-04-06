"use client"
import { useEffect, useState } from 'react';

export default function ProviderBookings() {
  const [bookings, setBookings] = useState([]);
  const providerId = 2; // Hardcoded for now

  const fetchBookings = async () => {
    const res = await fetch(`/api/bookings?provider_id=${providerId}`);
    const data = await res.json();
    setBookings(data);
  };

  const handleConfirm = async (id) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'confirmed' }),
    });

    if (res.ok) {
      alert('Booking confirmed!');
      fetchBookings();
    } else {
      const err = await res.json();
      alert(`Error: ${err.error}`);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Pending Bookings</h2>
      {bookings.length === 0 && <p>No bookings yet.</p>}
      {bookings.map((booking) => (
        <div key={booking.id} className="border p-4 rounded mb-3 shadow">
          <p><strong>User:</strong> {booking.user_id}</p>
          <p><strong>Service:</strong> {booking.service_id}</p>
          <p><strong>Date:</strong> {booking.booking_date}</p>
          <p><strong>Time:</strong> {booking.booking_time}</p>
          <p><strong>Status:</strong> {booking.status}</p>
          {booking.status === 'pending' && (
            <button
              onClick={() => handleConfirm(booking.id)}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
            >
              Confirm
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
