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
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200/50 sticky top-16 z-10 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="animate-fade-in-left">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
                Browse Marketplace
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Discover items available for rent in your area
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all duration-200">
                Filter
              </button>
              <button className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all duration-200">
                Sort
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State - Premium Skeleton */}
      {loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 overflow-hidden bg-white"
              >
                <div className="aspect-video bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-200 rounded-lg w-2/3 animate-shimmer" />
                  <div className="h-4 bg-gray-200 rounded-lg w-full animate-shimmer" />
                  <div className="h-8 bg-gray-200 rounded-lg w-1/2 animate-shimmer" />
                  <div className="flex gap-2 pt-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 animate-shimmer" />
                    <div className="h-3 bg-gray-200 rounded-lg w-1/3 animate-shimmer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-2xl border border-red-200/50 bg-red-50/50 backdrop-blur-sm p-8 text-center space-y-4 animate-fade-in-up">
            <div className="text-5xl">⚠️</div>
            <h3 className="text-xl font-bold text-red-900">{error}</h3>
            <p className="text-red-800">
              We're having trouble loading items. Please try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-block px-6 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && items.length === 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8 animate-fade-in-up">
            <div className="text-6xl animate-float">📦</div>
            <h2 className="text-4xl font-bold text-gray-900">
              No items yet
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
              Be the first to list an item! Start earning by sharing what you have.
            </p>
            <Link
              href="/login"
              className="inline-block px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 shadow-lg hover:shadow-xl"
            >
              Start Listing
            </Link>
          </div>
        </div>
      )}

      {/* Items Grid */}
      {!loading && items.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 stagger-animation">
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
