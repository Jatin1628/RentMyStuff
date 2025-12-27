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
    <div className="group rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/items/${item.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
          {item.imageUrls?.[index] && (
            <Image
              src={item.imageUrls[index]}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
            />
          )}
          {hasMultiple && (
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  prev();
                }}
                className="rounded-full bg-black/50 text-white px-2 py-1"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  next();
                }}
                className="rounded-full bg-black/50 text-white px-2 py-1"
              >
                ›
              </button>
            </div>
          )}
          <span
            className={`absolute left-2 top-2 rounded-full px-2 py-1 text-xs ${
              item.isAvailable ? "bg-green-600 text-white" : "bg-gray-400 text-white"
            }`}
          >
            {item.isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
      </Link>

      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold">{item.title}</h3>
          <span className="text-sm font-semibold">₹{item.pricePerDay}/day</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">{item.category}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          {item.ownerPhoto ? (
            <Image
              src={item.ownerPhoto}
              alt={item.ownerName}
              width={24}
              height={24}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-200" />
          )}
          <span className="text-sm text-gray-700">{item.ownerName}</span>
        </div>
      </div>
    </div>
  );
}

