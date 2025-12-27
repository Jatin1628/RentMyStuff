"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export type Item = {
  id: string;
  title: string;
  description: string;
  pricePerDay: number;
  category: string;
  imageUrls: string[];
  ownerId: string;
  ownerName: string;
  ownerPhoto?: string | null;
  isAvailable: boolean;
  createdAt?: unknown;
};

export default function ItemCard({ item }: { item: Item }) {
  const [index, setIndex] = useState(0);
  const hasMultiple = item.imageUrls && item.imageUrls.length > 1;

  const next = () => {
    if (!hasMultiple) return;
    setIndex((prev) => (prev + 1) % item.imageUrls.length);
  };

  const prev = () => {
    if (!hasMultiple) return;
    setIndex((prev) => (prev - 1 + item.imageUrls.length) % item.imageUrls.length);
  };

  return (
    <Link href={`/items/${item.id}`}>
      <div className="group h-full rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          {item.imageUrls?.[index] ? (
            <Image
              src={item.imageUrls[index]}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            {/* Availability Badge */}
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                item.isAvailable
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {item.isAvailable ? "Available" : "Unavailable"}
            </span>

            {/* Image Counter */}
            {hasMultiple && (
              <span className="bg-black/50 text-white text-xs font-medium px-2 py-1 rounded-full">
                {index + 1}/{item.imageUrls.length}
              </span>
            )}
          </div>

          {/* Image Navigation Arrows */}
          {hasMultiple && (
            <div className="absolute inset-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  prev();
                }}
                className="flex items-center justify-center h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  next();
                }}
                className="flex items-center justify-center h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="p-4 space-y-3">
          {/* Category */}
          <div className="flex items-center justify-between">
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-md">
              {item.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors">
            {item.title}
          </h3>

          {/* Price */}
          <div className="text-2xl font-bold text-gray-900">
            ₹{item.pricePerDay}
            <span className="text-xs font-normal text-gray-500 ml-1">/day</span>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100" />

          {/* Owner */}
          <div className="flex items-center gap-2 pt-1">
            <div className="flex-shrink-0">
              {item.ownerPhoto ? (
                <Image
                  src={item.ownerPhoto}
                  alt={item.ownerName}
                  width={32}
                  height={32}
                  className="rounded-full object-cover ring-2 ring-white"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 ring-2 ring-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.ownerName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
