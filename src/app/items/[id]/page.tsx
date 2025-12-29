"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import type { Item } from "@/components/ItemCard";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { useToast } from "@/lib/ToastContext";

export default function ItemDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [days, setDays] = useState(1);
  const { user } = useAuth();
  const { addItem } = useCart();
  const { showToast } = useToast();

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
          <div className="mb-8">
            <div className="h-4 bg-gray-200 rounded w-32 animate-shimmer" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <div className="aspect-video rounded-2xl bg-gray-200 animate-shimmer" />
              <div className="mt-6 flex gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 w-28 rounded-xl bg-gray-200 animate-shimmer" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded-lg w-3/4 animate-shimmer" />
              <div className="h-6 bg-gray-200 rounded-lg w-1/2 animate-shimmer" />
              <div className="h-32 bg-gray-200 rounded-lg animate-shimmer" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md text-center space-y-6 animate-fade-in-up">
          <div className="text-6xl">❌</div>
          <h1 className="text-3xl font-bold text-gray-900">
            {error ?? "Item not found"}
          </h1>
          <p className="text-gray-600 leading-relaxed">
            The item you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/items"
            className="inline-block px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1"
          >
            Back to Marketplace
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb */}
        <div className="mb-10 animate-fade-in-left">
          <Link href="/items" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-200 inline-flex items-center gap-2">
            <span>←</span>
            <span>Back to Marketplace</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 animate-fade-in-up">
          {/* Left Column - Premium Gallery */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="relative aspect-video overflow-hidden rounded-3xl border border-gray-200/50 bg-gray-900 shadow-xl group">
              {item.imageUrls?.[activeIndex] ? (
                <Image
                  src={item.imageUrls[activeIndex]}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 66vw"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
              )}

              {/* Image Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Availability Badge */}
              <div className="absolute top-6 left-6 z-10">
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm transition-all ${
                    item.isAvailable
                      ? "bg-emerald-500/90 text-white shadow-lg"
                      : "bg-gray-600/80 text-gray-200"
                  }`}
                >
                  {item.isAvailable ? "✓ Available Now" : "Unavailable"}
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {item.imageUrls && item.imageUrls.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-3">
                {item.imageUrls.map((url, i) => (
                  <button
                    key={url + i}
                    onClick={() => setActiveIndex(i)}
                    className={`flex-shrink-0 h-24 w-32 rounded-2xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                      i === activeIndex
                        ? "border-gray-900 ring-2 ring-gray-900 shadow-md"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`${item.title}-${i}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100px, 140px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Description Card */}
            <div className="p-8 rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm">
              <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">
                About This Item
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>

          {/* Right Column - Premium CTA */}
          <div className="space-y-6">
            {/* Title & Category */}
            <div className="space-y-4">
              <span className="inline-block px-3 py-1.5 bg-gray-900/10 text-gray-700 text-xs font-bold rounded-lg backdrop-blur-sm">
                {item.category}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                {item.title}
              </h1>
            </div>

            {/* Owner Trust Card */}
            <div className="p-6 rounded-2xl border border-gray-200/50 bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm space-y-4">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                Renting From
              </p>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {item.ownerPhoto ? (
                    <Image
                      src={item.ownerPhoto}
                      alt={item.ownerName}
                      width={56}
                      height={56}
                      className="rounded-full object-cover ring-2 ring-white shadow-md"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 ring-2 ring-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900">{item.ownerName}</p>
                  <p className="text-sm text-gray-600">✓ Verified Lender</p>
                </div>
              </div>
            </div>

            {/* Premium Pricing Box */}
            <div className="rounded-2xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm p-8 space-y-6 shadow-lg">
              {/* Price Per Day */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Price per day</p>
                <p className="text-5xl font-bold text-gray-900">
                  ₹{item.pricePerDay}
                </p>
              </div>

              {/* Duration Input - Premium */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <label htmlFor="days" className="block text-sm font-bold text-gray-900">
                  Rental Duration
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white hover:border-gray-400 transition-colors">
                  <button
                    type="button"
                    onClick={() => setDays(Math.max(1, days - 1))}
                    className="flex-shrink-0 w-14 h-14 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors font-bold text-xl"
                  >
                    −
                  </button>
                  <input
                    id="days"
                    type="number"
                    min={1}
                    value={days}
                    onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))}
                    className="flex-1 px-4 py-4 text-center text-2xl font-bold text-gray-900 border-0 focus:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setDays(days + 1)}
                    className="flex-shrink-0 w-14 h-14 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors font-bold text-xl"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  {days} day{days !== 1 ? "s" : ""} total
                </p>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{(item.pricePerDay * days).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Service fee</span>
                  <span className="font-semibold text-gray-900">₹0</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="space-y-2 pt-3 border-t-2 border-gray-300">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-4xl font-bold text-gray-900">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Rent Button - Premium CTA */}
              <button
                disabled={!item.isAvailable || (user && item.ownerId === user.uid)}
                className={`w-full py-4 font-bold rounded-xl transition-all transform active:scale-95 text-lg shadow-lg hover:shadow-xl ${
                  item.isAvailable
                    ? "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={() => router.push(`/checkout?itemId=${item.id}&days=${days}`)}
              >
                {!item.isAvailable ? "Not Available" : (user && item.ownerId === user.uid) ? "You can't rent your own listing" : "Proceed to Checkout"}
              </button>

              {/* Add to Cart button */}
              <button
                type="button"
                onClick={() => {
                  if (user && item.ownerId === user.uid) {
                    showToast("You cannot add your own listing to the cart", "error");
                    return;
                  }
                  addItem(item, days);
                  showToast("Added to cart", "success");
                }}
                className="w-full mt-3 py-3 font-semibold rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
              >
                Add to Cart
              </button>

              {/* Info Text */}
              <p className="text-xs text-gray-600 text-center">
                You'll pay the full amount upfront. No hidden charges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
