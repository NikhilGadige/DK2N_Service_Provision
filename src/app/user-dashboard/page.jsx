'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-10">User Dashboard</h1>

      <div className="flex flex-col gap-6 w-full max-w-sm">
        <button
          onClick={() => router.push('/user-dashboard/services')}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-xl transition duration-200"
        >
          🔧 Use Services
        </button>

        
      </div>
    </div>
  );
}
