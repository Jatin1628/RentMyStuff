"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ItemCard, { Item } from "@/components/ItemCard";
import Link from "next/link";

type RentalOrder = {
  id: string;
  itemId: string;
  renterId: string;
  ownerId: string;
  amount: number;
  duration: number;
  status: string;
  item?: Item;
};

export default function RentalsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [rentals, setRentals] = useState<RentalOrder[]>([]);
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
        const rentalOrders: RentalOrder[] = [];

        for (const orderDoc of rentalsSnap.docs) {
          const o = orderDoc.data() as Record<string, unknown>;
          const itemId = o.itemId as string;

          try {
            const itemRef = doc(db, "items", itemId);
            const itemSnap = await getDoc(itemRef);

            if (itemSnap.exists()) {
              const x = itemSnap.data() as Record<string, unknown>;
              const item: Item = {
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
              };

              rentalOrders.push({
                id: orderDoc.id,
                itemId,
                renterId: o.renterId as string,
                ownerId: o.ownerId as string,
                amount: Number(o.amount ?? 0),
                duration: Number(o.duration ?? 0),
                status: String(o.status ?? "pending"),
                item,
              });
            }
          } catch {
            // Skip if item doesn't exist
          }
        }

        setRentals(rentalOrders);
      } catch {
        setError("Failed to load rentals");
      } finally {
        setBusy(false);
      }
    };
    load();
  }, [user, loading, router]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return { bg: "bg-emerald-100", text: "text-emerald-700", icon: "✓" };
      case "active":
      case "ongoing":
        return { bg: "bg-blue-100", text: "text-blue-700", icon: "⏱" };
      case "cancelled":
        return { bg: "bg-red-100", text: "text-red-700", icon: "✕" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", icon: "○" };
    }
  };

  if (loading || busy) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12 space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">My Rentals</h1>
            <p className="text-lg text-gray-600">Track items you've rented</p>
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
        <div className="mb-12 space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">My Rentals</h1>
          <p className="text-lg text-gray-600">
            {rentals.length} {rentals.length === 1 ? "rental" : "rentals"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-200/50 bg-red-50/50 backdrop-blur-sm p-5 text-red-700 font-medium">
            {error}
          </div>
        )}

        {/* Empty State */}
        {rentals.length === 0 ? (
          <div className="text-center space-y-8 py-20 animate-fade-in-up">
            <div className="text-6xl animate-float">🎁</div>
            <h2 className="text-3xl font-bold text-gray-900">No rentals yet</h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
              Explore the marketplace and rent items that interest you!
            </p>
            <Link
              href="/items"
              className="inline-block px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 shadow-lg hover:shadow-xl"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {rentals.map((rental, idx) => {
              const statusColor = getStatusColor(rental.status);
              return (
                <Link key={rental.id} href={`/items/${rental.itemId}`}>
                  <div
                    className="group h-full rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 transform hover:-translate-y-2 hover:border-gray-300"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s backwards`,
                    }}
                  >
                    <div className="grid grid-cols-3 gap-5 p-5">
                      {/* Left - Image Preview */}
                      <div className="col-span-1">
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group-hover:shadow-md transition-all duration-300">
                          {rental.item?.imageUrls?.[0] && (
                            <img
                              src={rental.item.imageUrls[0]}
                              alt={rental.item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400"
                            />
                          )}
                          <div className="absolute top-3 left-3 z-10">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md transition-all transform group-hover:scale-110 shadow-md ${statusColor.bg} ${statusColor.text}`}
                              style={{
                                filter: `drop-shadow(0 0 8px ${
                                  statusColor.bg.includes('emerald') ? 'rgba(16, 185, 129, 0.3)' :
                                  statusColor.bg.includes('blue') ? 'rgba(59, 130, 246, 0.3)' :
                                  statusColor.bg.includes('red') ? 'rgba(239, 68, 68, 0.3)' :
                                  'rgba(107, 114, 128, 0.3)'
                                })`,
                              }}
                            >
                              {statusColor.icon} {rental.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right - Details */}
                      <div className="col-span-2 flex flex-col justify-between space-y-3">
                        <div>
                          <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-gray-950 transition-colors">
                            {rental.item?.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-2 font-medium">
                            {rental.item?.category}
                          </p>
                        </div>

                        <div className="space-y-3 pt-2 border-t border-gray-200">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 font-medium">Duration</span>
                            <span className="font-bold text-gray-900">
                              {rental.duration} {rental.duration === 1 ? "day" : "days"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-medium">Total paid</span>
                            <span className="text-xl font-black text-gray-900">
                              ₹{rental.amount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
