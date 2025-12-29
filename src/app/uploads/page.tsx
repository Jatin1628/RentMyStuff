"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ItemCard, { Item } from "@/components/ItemCard";
import Link from "next/link";
import { useToast } from "@/lib/ToastContext";

export default function UploadsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const { showToast } = useToast();

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
      showToast("Failed to update item availability", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteListing = async (id: string) => {
    try {
      setUpdatingId(id);
      await deleteDoc(doc(db, "items", id));
      setItems((prev) => prev.filter((it) => it.id !== id));
      showToast("Listing deleted", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete listing", "error");
    } finally {
      setUpdatingId(null);
      setConfirmDeleteId(null);
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
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header - Premium */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">My Listings</h1>
            <p className="text-lg text-gray-600">
              {items.length} {items.length === 1 ? "item" : "items"} listed
            </p>
          </div>
          <div className="relative group inline-block">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
            <Link
              href="/dashboard/add-item"
              className="relative inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 shadow-md hover:shadow-lg"
            >
              + Add New Item
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-200/50 bg-red-50/50 backdrop-blur-sm p-5 text-red-700 font-medium">
            {error}
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="text-center space-y-8 py-20 animate-fade-in-up">
            <div className="text-6xl animate-float">📦</div>
            <h2 className="text-3xl font-bold text-gray-900">No listings yet</h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
              Start earning by listing items you'd like to rent out.
            </p>
            <Link
              href="/dashboard/add-item"
              className="inline-block px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 shadow-lg hover:shadow-xl"
            >
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="group rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 transform hover:-translate-y-2 hover:border-gray-300"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s backwards`,
                }}
              >
                <div className="grid grid-cols-3 gap-5 p-5">
                  {/* Left - Image Preview */}
                  <div className="col-span-1">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group-hover:shadow-md transition-all duration-300">
                      {item.imageUrls?.[0] && (
                        <img
                          src={item.imageUrls[0]}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400"
                        />
                      )}
                      <div className="absolute top-3 left-3 z-10">
                        <span
                          className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm transition-all transform group-hover:scale-110 ${
                            item.isAvailable
                              ? "bg-emerald-500/95 text-white shadow-lg shadow-emerald-500/40"
                              : "bg-gray-600/90 text-gray-100 shadow-lg shadow-gray-600/30"
                          }`}
                        >
                          {item.isAvailable ? "✓ Active" : "○ Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right - Details */}
                  <div className="col-span-2 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-gray-950 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 font-medium">
                        {item.category}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-gray-200">
                      <p className="text-2xl font-black text-gray-900">
                        ₹{item.pricePerDay}
                        <span className="text-xs font-bold text-gray-600 ml-1">/day</span>
                      </p>
                      <div className="flex gap-2">
                        <Link
                          href={`/items/${item.id}`}
                          className="flex-1 px-3 py-2.5 text-sm font-bold text-gray-700 bg-gray-100/80 hover:bg-gray-200 rounded-lg transition-all duration-200 text-center transform hover:scale-105 active:scale-95"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => toggleAvailability(item.id, item.isAvailable)}
                          disabled={updatingId === item.id}
                          className={`flex-1 px-3 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 text-center transform hover:scale-105 active:scale-95 disabled:opacity-60 ${
                            item.isAvailable
                              ? "bg-red-100/80 text-red-700 hover:bg-red-200"
                              : "bg-green-100/80 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {item.isAvailable ? "Deactivate" : "Activate"}
                        </button>
                          {confirmDeleteId === item.id ? (
                            <div className="flex-1 flex gap-2">
                              <button
                                onClick={() => deleteListing(item.id)}
                                disabled={updatingId === item.id}
                                className="flex-1 px-3 py-2.5 text-sm font-bold rounded-lg bg-red-600 text-white transition-all duration-200"
                              >
                                Confirm Delete
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="flex-1 px-3 py-2.5 text-sm font-medium rounded-lg bg-gray-100"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(item.id)}
                              disabled={updatingId === item.id}
                              className="flex-1 px-3 py-2.5 text-sm font-bold rounded-lg bg-white border border-red-200 text-red-700 hover:bg-red-50 transition-all duration-200"
                            >
                              Delete
                            </button>
                          )}
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
