"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ItemCard, { Item } from "@/components/ItemCard";

export default function RentalsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (loading) return;
      if (!user) {
        router.push("/login");
        return;
      }
      try {
        setBusy(true);
        const rentalsSnap = await getDocs(query(collection(db, "orders"), where("renterId", "==", user.uid)));
        const itemIds = Array.from(
          new Set(
            rentalsSnap.docs.map((d) => {
              const o = d.data() as Record<string, unknown>;
              return o.itemId as string;
            })
          )
        );
        const rentalItems: Item[] = [];
        for (const id of itemIds) {
          const ref = doc(db, "items", id);
          const s = await getDoc(ref);
          if (s.exists()) {
            const x = s.data() as Record<string, unknown>;
            rentalItems.push({
              id: s.id,
              title: x.title as string,
              description: x.description as string,
              pricePerDay: x.pricePerDay as number,
              category: x.category as string,
              imageUrls: (x.imageUrls as string[]) ?? [],
              ownerId: x.ownerId as string,
              ownerName: x.ownerName as string,
              ownerPhoto: (x.ownerPhoto as string) ?? null,
              isAvailable: x.isAvailable as boolean,
              createdAt: x.createdAt,
            });
          }
        }
        setItems(rentalItems);
      } catch {
        setError("Failed to load rentals");
      } finally {
        setBusy(false);
      }
    };
    load();
  }, [user, loading, router]);

  if (loading || busy) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Rentals</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-3">
              <div className="animate-pulse">
                <div className="aspect-[4/3] rounded-lg bg-gray-200" />
                <div className="mt-3 h-4 w-3/4 bg-gray-200 rounded" />
                <div className="mt-2 h-4 w-1/3 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Rentals</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {items.length === 0 ? (
        <p className="text-gray-600">You haven’t rented any items yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}

