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
      <main className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-24 w-24 rounded-full bg-gray-200" />
            <div className="h-8 w-1/2 bg-gray-200 rounded" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link href="/uploads" className="text-sm text-gray-600 hover:text-gray-900 transition-colors mb-8 block">
          ← Back
        </Link>

        {/* Profile Card */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm p-8 space-y-8">
          {/* User Info */}
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  width={96}
                  height={96}
                  className="rounded-full object-cover ring-4 ring-gray-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 ring-4 ring-gray-100" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.displayName}</h1>
              <p className="text-gray-600 mt-1">{user.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/uploads"
              className="group rounded-xl border border-gray-200 bg-gray-50 p-6 hover:border-gray-300 hover:bg-white transition-all duration-300"
            >
              <p className="text-sm text-gray-600 font-medium">My Listings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{uploadsCount}</p>
              <p className="text-sm text-gray-600 mt-2 group-hover:text-gray-900 transition-colors">
                View all →
              </p>
            </Link>
            <Link
              href="/rentals"
              className="group rounded-xl border border-gray-200 bg-gray-50 p-6 hover:border-gray-300 hover:bg-white transition-all duration-300"
            >
              <p className="text-sm text-gray-600 font-medium">My Rentals</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{rentalsCount}</p>
              <p className="text-sm text-gray-600 mt-2 group-hover:text-gray-900 transition-colors">
                View all →
              </p>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-200 pt-8 space-y-3">
            <p className="text-sm font-semibold text-gray-900">Quick Actions</p>
            <div className="flex gap-3">
              <Link
                href="/dashboard/add-item"
                className="flex-1 px-4 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors text-center"
              >
                Create Listing
              </Link>
              <Link
                href="/items"
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                Browse Items
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
