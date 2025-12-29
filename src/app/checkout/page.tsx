"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/lib/ToastContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import type { Item } from "@/components/ItemCard";

export default function CheckoutPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { user, loading } = useAuth();

  const itemId = params.get("itemId") ?? "";
  const daysParam = params.get("days") ?? "1";
  const days = useMemo(() => Math.max(1, Number(daysParam)), [daysParam]);

  const [item, setItem] = useState<Item | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!itemId) return;
    const load = async () => {
      const ref = doc(db, "items", itemId);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setError("Item not found");
        return;
      }
      const data = snap.data() as Record<string, unknown>;
      setItem({
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
      });
    };
    load();
  }, [itemId]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  const { showToast } = useToast();

  const total = item ? item.pricePerDay * days : 0;

  const startCheckout = async () => {
    if (!user || !item) return;
    if (user.uid === item.ownerId) {
      showToast("You cannot checkout your own listing", "error");
      return;
    }
    try {
      setBusy(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          days,
          renterId: user.uid,
          renterEmail: user.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start checkout");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setBusy(false);
    }
  };

  if (loading || !user || !item) {
    return (
      <main className="p-6">
        <div className="animate-pulse">
          <div className="aspect-[4/3] rounded-lg bg-gray-200" />
          <div className="mt-4 h-6 w-1/2 bg-gray-200 rounded" />
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Confirm Rental</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border">
            {item.imageUrls?.[0] && (
              <Image
                src={item.imageUrls[0]}
                alt={item.title}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div>
            <h2 className="font-semibold">{item.title}</h2>
            <p className="text-gray-700">{item.description}</p>
            <p className="mt-2 text-sm text-gray-600">Owner: {item.ownerName}</p>
          </div>
        </div>

        <div className="rounded-xl border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span>Price per day</span>
            <span className="font-semibold">₹{item.pricePerDay}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Duration</span>
            <span className="font-semibold">{days} day(s)</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total</span>
            <span className="font-semibold">₹{total}</span>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            disabled={busy || !item.isAvailable}
            onClick={startCheckout}
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 disabled:opacity-60"
          >
            {busy ? "Redirecting..." : "Proceed to Stripe"}
          </button>
        </div>
      </div>
    </main>
  );
}
