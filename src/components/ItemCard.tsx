"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";

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
  const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg) translateZ(0px)");
  const [glowOpacity, setGlowOpacity] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const hasMultiple = item.imageUrls && item.imageUrls.length > 1;

  const next = () => {
    if (!hasMultiple) return;
    setIndex((prev) => (prev + 1) % item.imageUrls.length);
  };

  const prev = () => {
    if (!hasMultiple) return;
    setIndex((prev) => (prev - 1 + item.imageUrls.length) % item.imageUrls.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // More aggressive parallax: ±8 degrees instead of ±6
    const rotateX = Math.max(-8, Math.min(8, (y - centerY) / 12));
    const rotateY = Math.max(-8, Math.min(8, (centerX - x) / 12));

    setTransform(`perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(24px)`);
    setGlowOpacity(0.6);
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)");
    setGlowOpacity(0);
  };

  return (
    <Link href={`/items/${item.id}`}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group h-full cursor-pointer relative"
      >
        {/* Glow background - appears on hover */}
        <div
          className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/10 blur-2xl pointer-events-none transition-opacity duration-300"
          style={{ opacity: glowOpacity }}
        />

        <div
          className="relative h-full rounded-2xl border border-white/30 bg-white/8 backdrop-blur-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 will-change-transform"
          style={{
            transform: transform,
            transformStyle: "preserve-3d",
            boxShadow: glowOpacity > 0
              ? `0 0 40px rgba(59, 130, 246, ${0.3 * glowOpacity}), 0 20px 40px rgba(0, 0, 0, 0.2 + 0.1 * glowOpacity)`
              : undefined,
          }}
        >
          {/* Image Container - Premium */}
          <div className="relative aspect-video overflow-hidden bg-gray-950">
            {item.imageUrls?.[index] ? (
              <Image
                src={item.imageUrls[index]}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-125 transition-transform duration-700 will-change-transform"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={false}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950" />
            )}

            {/* Image Overlay Gradient - More pronounced on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-400" />

            {/* Vignette edge effect */}
            <div className="absolute inset-0 rounded-2xl shadow-inner" />

            {/* Badges - Premium styling */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
              {/* Availability Badge */}
              <span
                className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-lg transition-all transform group-hover:scale-110 ${
                  item.isAvailable
                    ? "bg-emerald-500/95 text-white shadow-lg shadow-emerald-500/40"
                    : "bg-gray-700/90 text-gray-200 shadow-lg shadow-gray-700/30"
                }`}
              >
                {item.isAvailable ? "✓ Available" : "Unavailable"}
              </span>

              {/* Image Counter */}
              {hasMultiple && (
                <span className="bg-black/70 backdrop-blur-lg text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  {index + 1}/{item.imageUrls.length}
                </span>
              )}
            </div>

            {/* Image Navigation Arrows - Premium */}
            {hasMultiple && (
              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    prev();
                  }}
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-white/25 backdrop-blur-md text-white hover:bg-white/50 hover:shadow-xl transition-all duration-200 transform hover:scale-125 active:scale-95"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    next();
                  }}
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-white/25 backdrop-blur-md text-white hover:bg-white/50 hover:shadow-xl transition-all duration-200 transform hover:scale-125 active:scale-95"
                >
                  ›
                </button>
              </div>
            )}
          </div>

          {/* Content Container - Glassmorphic */}
          <div className="p-5 space-y-3.5 bg-gradient-to-b from-white/85 via-white/70 to-white/60 backdrop-blur-xl">
            {/* Category Badge */}
            <div className="flex items-center justify-between">
              <span className="inline-block px-3 py-1.5 bg-gray-950/8 text-gray-700 text-xs font-bold rounded-lg backdrop-blur-sm hover:bg-gray-950/12 transition-colors">
                {item.category}
              </span>
            </div>

            {/* Title - Premium typography */}
            <h3 className="text-base font-black text-gray-900 line-clamp-2 group-hover:text-gray-950 transition-colors duration-200 leading-tight">
              {item.title}
            </h3>

            {/* Price - Prominent and premium */}
            <div className="pt-1">
              <div className="text-3xl font-black text-gray-900 tracking-tight">
                ₹{item.pricePerDay}
              </div>
              <span className="text-xs font-bold text-gray-600 ml-0.5">/day</span>
            </div>

            {/* Divider - Subtle */}
            <div className="h-px bg-gradient-to-r from-gray-300/30 via-gray-300/60 to-gray-300/30" />

            {/* Owner - Premium card feel */}
            <div className="flex items-center gap-3 pt-1.5 hover:bg-white/50 px-2 py-2 rounded-lg transition-colors duration-200">
              <div className="flex-shrink-0">
                {item.ownerPhoto ? (
                  <Image
                    src={item.ownerPhoto}
                    alt={item.ownerName}
                    width={32}
                    height={32}
                    className="rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 ring-2 ring-white shadow-sm" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {item.ownerName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
