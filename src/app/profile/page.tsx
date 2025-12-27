"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [uploadsCount, setUploadsCount] = useState(0);
  const [rentalsCount, setRentalsCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (loading) return;
      if (!user) {
        router.push("/login");
        return;
      }
      const uploads = await getDocs(query(collection(db, "items"), where("ownerId", "==", user.uid)));
      setUploadsCount(uploads.size);
      const rentals = await getDocs(query(collection(db, "orders"), where("renterId", "==", user.uid)));
      setRentalsCount(rentals.size);
    };
    load();
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="p-6">
        <div className="animate-pulse">
          <div className="h-24 w-24 rounded-full bg-gray-200" />
          <div className="mt-4 h-6 w-1/2 bg-gray-200 rounded" />
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <div className="rounded-xl border p-6">
        <div className="flex items-center gap-4">
          {user.photoURL ? (
            <Image src={user.photoURL} alt={user.displayName || "User"} width={72} height={72} className="rounded-full object-cover" />
          ) : (
            <div className="h-18 w-18 rounded-full bg-gray-200" />
          )}
          <div>
            <h1 className="text-2xl font-bold">{user.displayName}</h1>
            <p className="text-gray-700">{user.email}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-600">Uploads</div>
            <div className="text-2xl font-semibold">{uploadsCount}</div>
            <Link href="/uploads" className="mt-2 inline-block text-sm underline">View uploads</Link>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-600">Rentals</div>
            <div className="text-2xl font-semibold">{rentalsCount}</div>
            <Link href="/rentals" className="mt-2 inline-block text-sm underline">View rentals</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

