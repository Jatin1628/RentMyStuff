"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ItemCard, { Item } from "@/components/ItemCard";

export default function MyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [myUploads, setMyUploads] = useState<Item[]>([]);
  const [myRentals, setMyRentals] = useState<Item[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
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
        // My uploads
        const uploadsSnap = await getDocs(query(collection(db, "items"), where("ownerId", "==", user.uid)));
        const uploads: Item[] = uploadsSnap.docs.map((d) => {
          const x = d.data() as Record<string, unknown>;
          return {
            id: d.id,
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
          };
        });
        setMyUploads(uploads);

        // My rentals -> orders where I am renterId, then fetch items by id
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
          const itemSnap = await getDoc(ref);
          if (itemSnap.exists()) {
            const x = itemSnap.data() as Record<string, unknown>;
            rentalItems.push({
              id: itemSnap.id,
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
        setMyRentals(rentalItems);

        // All items
        const itemsSnap = await getDocs(query(collection(db, "items"), orderBy("createdAt", "desc")));
        const items: Item[] = itemsSnap.docs.map((d) => {
          const x = d.data() as Record<string, unknown>;
          return {
            id: d.id,
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
          };
        });
        setAllItems(items);
      } catch {
        setError("Failed to load data");
      } finally {
        setBusy(false);
      }
    };
    load();
  }, [user, loading, router]);

  if (loading || busy) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Stuff</h1>
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
      <h1 className="text-2xl font-bold mb-6">My Stuff</h1>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Rented by me</h2>
          <span className="text-sm text-gray-600">{myRentals.length} items</span>
        </div>
        {myRentals.length === 0 ? (
          <p className="text-gray-600">You haven’t rented any items yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myRentals.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Uploaded by me</h2>
          <span className="text-sm text-gray-600">{myUploads.length} items</span>
        </div>
        {myUploads.length === 0 ? (
          <p className="text-gray-600">No uploads yet. Create your first listing.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myUploads.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">All items</h2>
          <span className="text-sm text-gray-600">{allItems.length} items</span>
        </div>
        {allItems.length === 0 ? (
          <p className="text-gray-600">No items available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
