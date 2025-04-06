"use client";

import { useRouter } from "next/navigation";

export default function ProviderDashboard() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Welcome, Provider!</h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        This is your dashboard. You can manage your inventory and analyze your data here.
      </p>
    
      <div className="flex gap-6">
        <button
          onClick={() => router.push("/providers/analysis")}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md transition"
        >
          Analysis
        </button>
        <button
          onClick={() => router.push("/providers/inventory")}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md transition"
        >
          Manage Inventory
        </button>
      </div>
    </div>
  );
}
