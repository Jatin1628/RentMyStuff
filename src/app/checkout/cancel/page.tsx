"use client";

import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Payment Cancelled</h1>
        <p className="text-gray-600">
          Your payment was cancelled. You can return to the item and try again whenever you're ready.
        </p>
        <div className="pt-4 space-y-3">
          <Link
            href="/items"
            className="block px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Marketplace
          </Link>
          <Link
            href="/"
            className="block px-6 py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
