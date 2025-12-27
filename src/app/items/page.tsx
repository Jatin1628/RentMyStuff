"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ItemCard, { Item } from "@/components/ItemCard";

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

  if (loading) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Browse Items</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-3">
              <div className="animate-pulse">
                <div className="aspect-[4/3] rounded-lg bg-gray-200" />
                <div className="mt-3 h-4 w-3/4 bg-gray-200 rounded" />
                <div className="mt-2 h-4 w-1/3 bg-gray-200 rounded" />
                <div className="mt-3 h-6 w-1/4 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Browse Items</h1>
        <div className="rounded-lg border p-6 bg-red-50 text-red-700">
          {error}
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-2">Browse Items</h1>
        <p className="text-gray-600">No items yet. Be the first to list one.</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Browse Items</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}
