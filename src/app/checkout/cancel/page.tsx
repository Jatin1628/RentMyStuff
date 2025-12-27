"use client";

import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
      <p className="text-gray-700">You can return to the item and try again.</p>
      <Link href="/items" className="mt-4 inline-block bg-black text-white px-4 py-2 rounded">
        Back to Marketplace
      </Link>
    </main>
  );
}

