'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProviderSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    email: '',
    password: '',
    experience: '',
    phone: '',
    address: '',
    needs_inventory: false,
    profile_pic: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth-providers/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Signup failed');
        setLoading(false);
        return;
      }

      setSuccess('Signup successful! Redirecting...');
      setTimeout(() => router.push('/auth/login-provider'), 1500);
    } catch (err) {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-blue-100 px-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">Provider Registration</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} className="input" />
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} className="input" />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} className="input" />
          <input type="tel" name="phone" placeholder="Phone Number" required onChange={handleChange} className="input" />
          <input type="text" name="experience" placeholder="Experience (years)" required onChange={handleChange} className="input" />
          <input type="text" name="address" placeholder="Address" required onChange={handleChange} className="input" />
          <input type="text" name="profile_pic" placeholder="Profile Pic URL" onChange={handleChange} className="input col-span-2" />
          <textarea name="bio" placeholder="Short Bio" rows={2} onChange={handleChange} className="input col-span-2" />
          <label className="col-span-2 flex items-center gap-2">
            <input type="checkbox" name="needs_inventory" onChange={handleChange} />
            <span className="text-sm">I need inventory support</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`col-span-2 w-full py-2 text-white rounded-lg bg-pink-600 ${
              loading ? 'opacity-50' : 'hover:bg-pink-700'
            }`}
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{' '}
          <a href="/auth/login-provider/" className="text-pink-600 hover:underline">
            Login here
          </a>
        </p>
      </div>

      <style jsx>{`
        .input {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          border-radius: 0.5rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .input:focus {
          border-color: #ec4899;
        }
      `}</style>
    </div>
  );
}
