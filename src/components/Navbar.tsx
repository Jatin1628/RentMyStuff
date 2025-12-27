"use client";

import Link from "next/link";
import { auth } from "@/lib/firebase";
import { logout } from "@/lib/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Navbar() {
  const [user] = useAuthState(auth);

  return (
    <nav className="flex justify-between items-center p-4 border-b bg-white">
      {/* LOGO */}
      <Link href="/" className="font-bold text-xl">
        RentMyStuff
      </Link>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        <Link href="/items" className="hover:underline">
          Browse
        </Link>

        {/* SHOW ADD ITEM ONLY IF LOGGED IN */}
        {user && (
          <Link
            href="/dashboard/add-item"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Add Item
          </Link>
        )}

        {/* AUTH SECTION */}
        {!user ? (
          /* -------- LOGGED OUT -------- */
          <Link
            href="/login"
            className="border px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Login
          </Link>
        ) : (
          /* -------- LOGGED IN -------- */
          <div className="relative group">
            <button className="flex items-center justify-center h-9 w-9 rounded-full overflow-hidden border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.photoURL ?? ""}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </button>

            {/* DROPDOWN */}
            <div
              className="
                absolute right-0 top-full mt-1
                min-w-40 rounded-lg border bg-white shadow-lg

                opacity-0 scale-95 translate-y-1
                pointer-events-none

                transition-all duration-200 ease-out
                group-hover:opacity-100
                group-hover:scale-100
                group-hover:translate-y-0
                group-hover:pointer-events-auto
                delay-100
              "
            >
              <Link
                href="/rentals"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                My Rentals
              </Link>
              <Link
                href="/uploads"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                My Uploads
              </Link>
              <Link
                href="/profile"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                My Profile
              </Link>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
