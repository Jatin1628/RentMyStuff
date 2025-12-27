"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
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
      <main className="p-6">
        <div className="animate-pulse">
          <div className="aspect-[4/3] rounded-lg bg-gray-200" />
          <div className="mt-4 h-6 w-1/2 bg-gray-200 rounded" />
          <div className="mt-2 h-4 w-3/4 bg-gray-200 rounded" />
          <div className="mt-6 h-10 w-1/3 bg-gray-200 rounded" />
        </div>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="p-6">
        <div className="rounded-lg border p-6 bg-red-50 text-red-700">
          {error ?? "Item not found"}
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border">
            {item.imageUrls?.[activeIndex] && (
              <Image
                src={item.imageUrls[activeIndex]}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
              />
            )}
            <span
              className={`absolute left-2 top-2 rounded-full px-2 py-1 text-xs ${
                item.isAvailable ? "bg-green-600 text-white" : "bg-gray-400 text-white"
              }`}
            >
              {item.isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>

          {item.imageUrls?.length > 1 && (
            <div className="mt-3 flex gap-2">
              {item.imageUrls.map((url, i) => (
                <button
                  key={url + i}
                  onClick={() => setActiveIndex(i)}
                  className={`relative h-16 w-24 overflow-hidden rounded border ${
                    i === activeIndex ? "ring-2 ring-black" : ""
                  }`}
                >
                  <Image src={url} alt={`${item.title}-${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{item.title}</h1>
          <div className="flex items-center gap-2">
            {item.ownerPhoto ? (
              <Image
                src={item.ownerPhoto}
                alt={item.ownerName}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200" />
            )}
            <span className="text-gray-700">{item.ownerName}</span>
          </div>
          <p className="text-gray-800">{item.description}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Category:</span>
            <span className="text-sm font-medium">{item.category}</span>
          </div>

          <div className="rounded-xl border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Price per day</span>
              <span className="font-semibold">₹{item.pricePerDay}</span>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="days" className="text-gray-700">
                Duration (days)
              </label>
              <input
                id="days"
                type="number"
                min={1}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-24 border rounded px-2 py-1"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Total</span>
              <span className="font-semibold">₹{total}</span>
            </div>
            <button
              disabled={!item.isAvailable}
              className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 disabled:opacity-60"
              onClick={() => router.push(`/checkout?itemId=${item.id}&days=${days}`)}
            >
              Rent Now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

