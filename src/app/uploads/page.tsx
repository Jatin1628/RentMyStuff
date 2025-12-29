"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ItemCard, { Item } from "@/components/ItemCard";
import Link from "next/link";

export default function UploadsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (loading) return;
      if (!user) {
        router.push("/login");
        return;
      }
      try {
        setBusy(true);
        const snap = await getDocs(query(collection(db, "items"), where("ownerId", "==", user.uid)));
        const data: Item[] = snap.docs.map((d) => {
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
        setItems(data);
      } catch {
        setError("Failed to load listings");
      } finally {
        setBusy(false);
      }
    };
    load();
  }, [user, loading, router]);

  const toggleAvailability = async (id: string, current: boolean) => {
    try {
      setUpdatingId(id);
      await updateDoc(doc(db, "items", id), { isAvailable: !current });
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isAvailable: !current } : item
        )
      );
    } catch {
      alert("Failed to update item availability");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading || busy) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12 space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">My Listings</h1>
            <p className="text-lg text-gray-600">Manage your rental items</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-200/50 overflow-hidden bg-white animate-pulse shadow-sm">
                <div className="grid grid-cols-3 gap-4 p-5">
                  <div className="col-span-1 aspect-square rounded-lg bg-gray-200" />
                  <div className="col-span-2 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="pt-2 border-t border-gray-100 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full" />
                      <div className="h-8 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">My Listings</h1>
            <p className="mt-2 text-gray-600">
              {items.length} {items.length === 1 ? "item" : "items"} listed
            </p>
          </div>
          <Link
            href="/dashboard/add-item"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            + Add New Item
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="text-center space-y-6 py-12">
            <div className="text-6xl">📦</div>
            <h2 className="text-2xl font-bold text-gray-900">No listings yet</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Start earning by listing items you'd like to rent out.
            </p>
            <Link
              href="/dashboard/add-item"
              className="inline-block px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="grid grid-cols-3 gap-4 p-4">
                  {/* Left - Image Preview */}
                  <div className="col-span-1">
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      {item.imageUrls?.[0] && (
                        <img
                          src={item.imageUrls[0]}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute top-2 left-2">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            item.isAvailable
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {item.isAvailable ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right - Details */}
                  <div className="col-span-2 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.category}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-lg font-bold text-gray-900">
                        ₹{item.pricePerDay}
                        <span className="text-xs font-normal text-gray-500 ml-1">/day</span>
                      </p>
                      <div className="flex gap-2">
                        <Link
                          href={`/items/${item.id}`}
                          className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => toggleAvailability(item.id, item.isAvailable)}
                          disabled={updatingId === item.id}
                          className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-center disabled:opacity-50 ${
                            item.isAvailable
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {item.isAvailable ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
