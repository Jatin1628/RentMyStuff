"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ItemCard, { Item } from "@/components/ItemCard";
import Link from "next/link";

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
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-12">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6 animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                      <div className="aspect-video bg-gray-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* My Rentals Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Items I'm Renting</h2>
              <p className="text-gray-600 mt-1">
                {myRentals.length} {myRentals.length === 1 ? "item" : "items"}
              </p>
            </div>
            <Link
              href="/rentals"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              View All →
            </Link>
          </div>
          {myRentals.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-gray-200 bg-gray-50">
              <p className="text-gray-600">You haven't rented any items yet.</p>
              <Link
                href="/items"
                className="inline-block mt-4 px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {myRentals.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* My Uploads Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Items I'm Listing</h2>
              <p className="text-gray-600 mt-1">
                {myUploads.length} {myUploads.length === 1 ? "item" : "items"}
              </p>
            </div>
            <Link
              href="/uploads"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              View All →
            </Link>
          </div>
          {myUploads.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-gray-200 bg-gray-50">
              <p className="text-gray-600">No uploads yet. Create your first listing.</p>
              <Link
                href="/dashboard/add-item"
                className="inline-block mt-4 px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Create Listing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {myUploads.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* All Items Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Available Items</h2>
              <p className="text-gray-600 mt-1">
                {allItems.length} {allItems.length === 1 ? "item" : "items"}
              </p>
            </div>
            <Link
              href="/items"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              View All →
            </Link>
          </div>
          {allItems.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-gray-200 bg-gray-50">
              <p className="text-gray-600">No items available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
