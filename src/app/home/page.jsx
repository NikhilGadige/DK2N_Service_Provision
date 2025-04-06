'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to service provider</h1>
        <p className="text-lg text-gray-600 mb-10">
          A platform where you can hire trusted local service providers — from electricians and carpenters to tutors and designers.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/auth/login-user">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all">
              Login as Customer
            </button>
          </Link>

          <Link href="/auth/login-provider">
            <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all">
              Login as Service Provider
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}