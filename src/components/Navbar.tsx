"use client";

import Link from "next/link";
import { auth } from "@/lib/firebase";
import { logout } from "@/lib/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";
import { useCart } from "@/lib/CartContext";

export default function Navbar() {
  const [user] = useAuthState(auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { items: cartItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-lg font-bold text-gray-900 tracking-tight transition-opacity duration-200 group-hover:opacity-80">
              RentMyStuff
            </span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden sm:flex items-center gap-8">
            <Link
              href="/items"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-200 relative group"
            >
              Browse
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Add Item - Only if logged in */}
            {user && (
              <div className="hidden sm:block relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                <Link
                  href="/dashboard/add-item"
                  className="relative inline-flex items-center text-sm font-bold bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-all duration-200 transform hover:-translate-y-1 active:scale-95 shadow-md hover:shadow-lg"
                >
                  + List Item
                </Link>
              </div>
            )}

            {/* Auth Section */}
            {!user ? (
              <Link
                href="/login"
                className="text-sm font-semibold text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                Sign In
              </Link>
            ) : (
              <div className="relative">
                {/* Cart Icon */}
                <Link href="/cart" className="hidden sm:inline-flex items-center mr-3">
                  <div className="relative">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-700">
                      <path d="M6 6h15l-1.5 9h-12z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="9" cy="20" r="1" />
                      <circle cx="18" cy="20" r="1" />
                    </svg>
                    {cartItems.length > 0 && (
                      <span className="absolute -right-2 -top-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">{cartItems.length}</span>
                    )}
                  </div>
                </Link>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-gray-400 transition-all duration-200 hover:shadow-md"
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
                  <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden z-50 animate-fade-in-down">
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Account
                        </p>
                      </div>
                      <Link
                        href="/rentals"
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 font-medium"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Rentals
                      </Link>
                      <Link
                        href="/uploads"
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 font-medium"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Listings
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 font-medium"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <div className="border-t border-gray-100 my-2" />
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 font-medium"
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
