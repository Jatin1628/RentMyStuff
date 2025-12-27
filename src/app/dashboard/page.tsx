"use client";

import { auth, db } from "@/lib/firebase";
import { logout } from "@/lib/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import Link from "next/link";
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

  if (loading) return <p className="p-4">Loading...</p>;
  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <main className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user.displayName}</h1>
          <p className="mt-1 text-gray-700">{user.email}</p>
        </div>
        <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">
          Logout
        </button>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          className={`px-3 py-2 rounded ${tab === "listings" ? "bg-black text-white" : "border"}`}
          onClick={() => setTab("listings")}
        >
          My Listings
        </button>
        <button
          className={`px-3 py-2 rounded ${tab === "rentals" ? "bg-black text-white" : "border"}`}
          onClick={() => setTab("rentals")}
        >
          My Rentals
        </button>
        <button
          className={`px-3 py-2 rounded ${tab === "earnings" ? "bg-black text-white" : "border"}`}
          onClick={() => setTab("earnings")}
        >
          My Earnings
        </button>
        <Link href="/dashboard/add-item" className="ml-auto bg-black text-white px-4 py-2 rounded">
          Add Item
        </Link>
      </div>

      {tab === "listings" && (
        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.length === 0 ? (
            <div className="rounded border p-6 text-gray-700">You have no listings yet.</div>
          ) : (
            listings.map((i) => (
              <div key={i.id} className="rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{i.title}</h3>
                  <span className={`text-xs rounded-full px-2 py-1 ${i.isAvailable ? "bg-green-600 text-white" : "bg-gray-400 text-white"}`}>
                    {i.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">₹{i.pricePerDay}/day • {i.category}</p>
                <div className="mt-3 flex gap-2">
                  <Link href={`/items/${i.id}`} className="px-3 py-2 border rounded">View</Link>
                  <button
                    onClick={() => toggleAvailability(i.id, i.isAvailable)}
                    className="px-3 py-2 bg-black text-white rounded"
                  >
                    {i.isAvailable ? "Mark Unavailable" : "Mark Available"}
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {tab === "rentals" && (
        <section className="mt-6">
          {rentals.length === 0 ? (
            <div className="rounded border p-6 text-gray-700">No rentals yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rentals.map((o) => (
                <div key={o.id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Order {o.id.slice(0, 6)}</h3>
                    <span className="text-xs rounded-full px-2 py-1 bg-green-600 text-white">{o.status}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">Item: {o.itemId}</p>
                  <p className="text-sm text-gray-700">Duration: {o.duration} day(s)</p>
                  <p className="text-sm text-gray-700">Amount: ₹{o.amount}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "earnings" && (
        <section className="mt-6">
          <div className="rounded-xl border p-4">
            <h3 className="font-semibold">Total Earnings</h3>
            <p className="text-2xl mt-2">₹{totalEarnings}</p>
          </div>
          {earnings.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {earnings.map((o) => (
                <div key={o.id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Order {o.id.slice(0, 6)}</span>
                    <span className="text-xs rounded-full px-2 py-1 bg-green-600 text-white">{o.status}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">Item: {o.itemId}</p>
                  <p className="text-sm text-gray-700">Amount: ₹{o.amount}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
