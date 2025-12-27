"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ItemCard, { Item } from "@/components/ItemCard";
import Link from "next/link";

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const data: Item[] = snap.docs.map((d) => {
          const payload = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            title: payload.title as string,
            description: payload.description as string,
            pricePerDay: payload.pricePerDay as number,
            category: payload.category as string,
            imageUrls: (payload.imageUrls as string[]) ?? [],
            ownerId: payload.ownerId as string,
            ownerName: payload.ownerName as string,
            ownerPhoto: (payload.ownerPhoto as string) ?? null,
            isAvailable: payload.isAvailable as boolean,
            createdAt: payload.createdAt,
          };
        });
        setItems(data);
      } catch {
        setError("Failed to load items");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Browse Marketplace
              </h1>
              <p className="mt-2 text-gray-600">
                Discover items available for rent in your area
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Filter
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Sort
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 overflow-hidden animate-pulse"
              >
                <div className="aspect-video bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-8 bg-gray-200 rounded w-1/2" />
                  <div className="flex gap-2 pt-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center space-y-4">
            <div className="text-4xl">⚠️</div>
            <h3 className="text-lg font-semibold text-red-900">{error}</h3>
            <p className="text-red-700">
              We're having trouble loading items. Please try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && items.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-6">
            <div className="text-6xl">📦</div>
            <h2 className="text-3xl font-bold text-gray-900">
              No items yet
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Be the first to list an item! Start earning by sharing what you have.
            </p>
            <Link
              href="/login"
              className="inline-block px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start Listing
            </Link>
          </div>
        </div>
      )}

      {/* Items Grid */}
      {!loading && items.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
