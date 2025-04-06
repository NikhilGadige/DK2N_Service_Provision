"use client"
import { useState } from 'react';

export default function BookSlot() {
  const [form, setForm] = useState({
    user_id: '',
    provider_id: '',
    service_id: '',
    price: '',
    duration: '',
    booking_date: '',
    booking_time: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBook = async () => {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      alert(`Booking Successful. Booking ID: ${data.bookingId}`);
    } else {
      alert(`Error: ${data.error}`);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md mt-10">
      <h2 className="text-xl font-bold mb-4">Book a Slot</h2>
      {['user_id', 'provider_id', 'service_id', 'price', 'duration'].map((field) => (
        <input
          key={field}
          className="block w-full border p-2 mb-3 rounded"
          type="text"
          name={field}
          placeholder={field}
          value={form[field]}
          onChange={handleChange}
        />
      ))}
      <input
        className="block w-full border p-2 mb-3 rounded"
        type="date"
        name="booking_date"
        value={form.booking_date}
        onChange={handleChange}
      />
      <input
        className="block w-full border p-2 mb-3 rounded"
        type="time"
        name="booking_time"
        value={form.booking_time}
        onChange={handleChange}
      />
      <button onClick={handleBook} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Book Slot
      </button>
    </div>
  );
}
