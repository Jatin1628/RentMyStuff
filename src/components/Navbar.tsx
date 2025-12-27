"use client";

import Link from "next/link";
import { auth } from "@/lib/firebase";
import { logout } from "@/lib/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";

export default function Navbar() {
  const [user] = useAuthState(auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold text-gray-900 tracking-tight">RentMyStuff</span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden sm:flex items-center gap-8">
            <Link
              href="/items"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Browse
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Add Item - Only if logged in */}
            {user && (
              <Link
                href="/dashboard/add-item"
                className="hidden sm:inline-block text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                + List Item
              </Link>
            )}

            {/* Auth Section */}
            {!user ? (
              <Link
                href="/login"
                className="text-sm font-medium text-gray-900 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              >
                Sign In
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center h-10 w-10 rounded-full overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors duration-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.photoURL ?? ""}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden z-50">
                    <div className="py-1">
                      <Link
                        href="/rentals"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Rentals
                      </Link>
                      <Link
                        href="/uploads"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Listings
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <div className="border-t border-gray-100" />
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
