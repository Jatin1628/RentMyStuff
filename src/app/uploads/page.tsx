"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ItemCard, { Item } from "@/components/ItemCard";
import Link from "next/link";

export default function UploadsPage() {
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
        setError("Failed to load uploads");
      } finally {
        setBusy(false);
      }
    };
    load();
  }, [user, loading, router]);

  if (loading || busy) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Uploads</h1>
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Uploads</h1>
        <Link href="/dashboard/add-item" className="bg-black text-white px-4 py-2 rounded">
          Add Item
        </Link>
      </div>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {items.length === 0 ? (
        <p className="text-gray-600">No uploads yet. Create your first listing.</p>
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

