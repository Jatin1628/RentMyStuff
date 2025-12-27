"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import type { Item } from "@/components/ItemCard";

export default function ItemDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [days, setDays] = useState(1);

  useEffect(() => {
    const load = async () => {
      if (!params?.id) return;
      try {
        const ref = doc(db, "items", params.id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setError("Item not found");
          return;
        }
        const data = snap.data() as Record<string, unknown>;
        const parsed: Item = {
          id: snap.id,
          title: data.title as string,
          description: data.description as string,
          pricePerDay: data.pricePerDay as number,
          category: data.category as string,
          imageUrls: (data.imageUrls as string[]) ?? [],
          ownerId: data.ownerId as string,
          ownerName: data.ownerName as string,
          ownerPhoto: (data.ownerPhoto as string) ?? null,
          isAvailable: data.isAvailable as boolean,
          createdAt: data.createdAt,
        };
        setItem(parsed);
      } catch {
        setError("Failed to load item");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params?.id]);

  const total = item ? Math.max(1, days) * item.pricePerDay : 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 animate-pulse">
              <div className="aspect-video rounded-xl bg-gray-200" />
              <div className="mt-4 flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 w-24 rounded-lg bg-gray-200" />
                ))}
              </div>
            </div>
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-32 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-4">
            <div className="text-6xl">❌</div>
            <h1 className="text-3xl font-bold text-gray-900">
              {error ?? "Item not found"}
            </h1>
            <p className="text-gray-600">
              The item you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/items"
              className="inline-block px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Back to Marketplace
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/items" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            ← Back to Marketplace
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
              {item.imageUrls?.[activeIndex] ? (
                <Image
                  src={item.imageUrls[activeIndex]}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 66vw"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
              )}

              {/* Availability Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    item.isAvailable
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {item.isAvailable ? "✓ Available Now" : "Unavailable"}
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {item.imageUrls && item.imageUrls.length > 1 && (
              <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
                {item.imageUrls.map((url, i) => (
                  <button
                    key={url + i}
                    onClick={() => setActiveIndex(i)}
                    className={`flex-shrink-0 h-20 w-24 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeIndex
                        ? "border-gray-900 ring-2 ring-gray-900"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`${item.title}-${i}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100px, 120px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details & CTA */}
          <div className="space-y-6">
            {/* Title & Category */}
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-md">
                {item.category}
              </span>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {item.title}
              </h1>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {item.description}
            </p>

            {/* Owner Section */}
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                Owner
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {item.ownerPhoto ? (
                    <Image
                      src={item.ownerPhoto}
                      alt={item.ownerName}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{item.ownerName}</p>
                  <p className="text-sm text-gray-600">Trusted Lender</p>
                </div>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
              {/* Price Per Day */}
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Price per day</p>
                <p className="text-4xl font-bold text-gray-900">
                  ₹{item.pricePerDay}
                </p>
              </div>

              {/* Duration Input */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <label htmlFor="days" className="block text-sm font-medium text-gray-900">
                  How many days?
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setDays(Math.max(1, days - 1))}
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    −
                  </button>
                  <input
                    id="days"
                    type="number"
                    min={1}
                    value={days}
                    onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))}
                    className="flex-1 px-4 py-3 text-center text-lg font-semibold text-gray-900 border-0 focus:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setDays(days + 1)}
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="space-y-1 pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{(item.pricePerDay * days).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Service fee</span>
                  <span className="font-semibold text-gray-900">₹0</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="space-y-1 pt-3 border-t-2 border-gray-300">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Rent Button */}
              <button
                disabled={!item.isAvailable}
                className={`w-full py-4 font-semibold rounded-lg transition-all transform active:scale-98 text-lg ${
                  item.isAvailable
                    ? "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700"
                    : "bg-gray-200 text-gray-600 cursor-not-allowed"
                }`}
                onClick={() => router.push(`/checkout?itemId=${item.id}&days=${days}`)}
              >
                {item.isAvailable ? "Proceed to Checkout" : "Not Available"}
              </button>

              {/* Info Text */}
              <p className="text-xs text-gray-600 text-center pt-2">
                You'll pay the full amount upfront. No hidden charges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
