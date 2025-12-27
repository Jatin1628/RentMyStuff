"use client";

import { auth, db } from "@/lib/firebase";
import { logout } from "@/lib/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import type { Item } from "@/components/ItemCard";

type Order = {
  id: string;
  itemId: string;
  renterId: string;
  ownerId: string;
  amount: number;
  duration: number;
  status: string;
};

export default function DashboardPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const [tab, setTab] = useState<"listings" | "rentals" | "earnings">("listings");
  const [listings, setListings] = useState<Item[]>([]);
  const [rentals, setRentals] = useState<Order[]>([]);
  const [earnings, setEarnings] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const itemsSnap = await getDocs(query(collection(db, "items"), where("ownerId", "==", user.uid)));
      setListings(
        itemsSnap.docs.map((d) => {
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
        })
      );
      const rentalsSnap = await getDocs(query(collection(db, "orders"), where("renterId", "==", user.uid)));
      setRentals(
        rentalsSnap.docs.map((d) => {
          const o = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            itemId: o.itemId as string,
            renterId: o.renterId as string,
            ownerId: o.ownerId as string,
            amount: Number(o.amount ?? 0),
            duration: Number(o.duration ?? 0),
            status: String(o.status ?? ""),
          };
        })
      );
      const earningsSnap = await getDocs(query(collection(db, "orders"), where("ownerId", "==", user.uid)));
      setEarnings(
        earningsSnap.docs.map((d) => {
          const o = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            itemId: o.itemId as string,
            renterId: o.renterId as string,
            ownerId: o.ownerId as string,
            amount: Number(o.amount ?? 0),
            duration: Number(o.duration ?? 0),
            status: String(o.status ?? ""),
          };
        })
      );
    };
    load();
  }, [user]);

  const totalEarnings = useMemo(() => {
    return earnings.reduce((sum, o) => sum + Number(o.amount || 0), 0);
  }, [earnings]);

  const toggleAvailability = async (id: string, current: boolean) => {
    await updateDoc(doc(db, "items", id), { isAvailable: !current });
    setListings((prev) => prev.map((i) => (i.id === id ? { ...i, isAvailable: !current } : i)));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded w-1/3" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
          <div className="flex items-center gap-4">
            {user.photoURL && (
              <Image
                src={user.photoURL}
                alt="Profile"
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
            )}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Welcome, {user.displayName}
              </h1>
              <p className="text-gray-600 mt-1">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="px-6 py-2 text-red-600 border border-red-200 hover:bg-red-50 rounded-lg font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 mb-8 border-b border-gray-200">
          <button
            onClick={() => setTab("listings")}
            className={`pb-4 px-4 font-medium transition-all relative ${
              tab === "listings"
                ? "text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            My Listings ({listings.length})
            {tab === "listings" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
          <button
            onClick={() => setTab("rentals")}
            className={`pb-4 px-4 font-medium transition-all relative ${
              tab === "rentals"
                ? "text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            My Rentals ({rentals.length})
            {tab === "rentals" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
          <button
            onClick={() => setTab("earnings")}
            className={`pb-4 px-4 font-medium transition-all relative ${
              tab === "earnings"
                ? "text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Earnings
            {tab === "earnings" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
          <Link
            href="/dashboard/add-item"
            className="ml-auto px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            + New Listing
          </Link>
        </div>

        {/* Listings Tab */}
        {tab === "listings" && (
          <section className="space-y-6">
            {listings.length === 0 ? (
              <div className="text-center space-y-6 py-12">
                <div className="text-6xl">📦</div>
                <h2 className="text-2xl font-bold text-gray-900">No listings yet</h2>
                <p className="text-gray-600">Start earning by listing items you'd like to rent out.</p>
                <Link
                  href="/dashboard/add-item"
                  className="inline-block px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Create Your First Listing
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {listings.map((item) => (
                  <div
                    key={item.id}
                    className="group rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="grid grid-cols-3 gap-4 p-4">
                      {/* Image */}
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

                      {/* Details */}
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
                              className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-center ${
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
          </section>
        )}

        {/* Rentals Tab */}
        {tab === "rentals" && (
          <section className="space-y-6">
            {rentals.length === 0 ? (
              <div className="text-center space-y-6 py-12">
                <div className="text-6xl">🎁</div>
                <h2 className="text-2xl font-bold text-gray-900">No rentals yet</h2>
                <p className="text-gray-600">Explore the marketplace and rent items!</p>
                <Link
                  href="/items"
                  className="inline-block px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Browse Marketplace
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rentals.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          Order {order.id.slice(0, 6).toUpperCase()}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-2 border-t border-gray-100 pt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Duration</span>
                          <span className="font-medium text-gray-900">
                            {order.duration} {order.duration === 1 ? "day" : "days"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Amount</span>
                          <span className="font-medium text-gray-900">
                            ₹{order.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Earnings Tab */}
        {tab === "earnings" && (
          <section className="space-y-6">
            {/* Total Earnings Card */}
            <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-white p-8">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Total Earnings
              </p>
              <p className="text-5xl font-bold text-gray-900 mt-2">
                ₹{totalEarnings.toLocaleString()}
              </p>
              <p className="text-gray-600 mt-2">
                From {earnings.length} {earnings.length === 1 ? "rental" : "rentals"}
              </p>
            </div>

            {/* Earnings List */}
            {earnings.length === 0 ? (
              <div className="text-center space-y-6 py-12">
                <div className="text-6xl">💰</div>
                <h2 className="text-2xl font-bold text-gray-900">No earnings yet</h2>
                <p className="text-gray-600">List items to start earning money!</p>
                <Link
                  href="/dashboard/add-item"
                  className="inline-block px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Create Your First Listing
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {earnings.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          Order {order.id.slice(0, 6).toUpperCase()}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-2 border-t border-gray-100 pt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Duration</span>
                          <span className="font-medium text-gray-900">
                            {order.duration} {order.duration === 1 ? "day" : "days"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 font-medium">Earned</span>
                          <span className="font-bold text-emerald-700 text-lg">
                            ₹{order.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
