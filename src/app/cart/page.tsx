"use client";

import { useCart } from "@/lib/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/lib/ToastContext";
import { useAuth } from "@/lib/AuthContext";

export default function CartPage() {
  const { items, updateDays, removeItem, clear } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();

  const grandTotal = items.reduce((s, i) => s + i.item.pricePerDay * i.days, 0);

  if (items.length === 0) {
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <div className="p-8 rounded-xl border bg-white text-center">Your cart is empty.</div>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="space-y-4">
        {items.map(({ item, days }) => (
          <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border bg-white">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
              {item.imageUrls?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrls[0]} alt={item.title} className="w-full h-full object-cover" />
              ) : null}
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-gray-600">₹{item.pricePerDay}/day</p>
              <div className="mt-2 flex items-center gap-2">
                <button onClick={() => updateDays(item.id, Math.max(1, days - 1))} className="px-3 py-1 rounded bg-gray-100">−</button>
                <div className="px-3 py-1 border rounded">{days} day{days>1?"s":""}</div>
                <button onClick={() => updateDays(item.id, days + 1)} className="px-3 py-1 rounded bg-gray-100">+</button>
                <button onClick={() => { removeItem(item.id); showToast("Removed from cart", "success"); }} className="ml-4 text-red-600">🗑</button>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold">₹{item.pricePerDay * days}</div>
              <div className="mt-2">
                <Link href={`/checkout?itemId=${item.id}&days=${days}`} className="inline-block px-3 py-2 bg-gray-900 text-white rounded">Checkout</Link>
              </div>
            </div>
          </div>
        ))}

        <div className="p-4 rounded-xl border bg-white flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Grand total</div>
            <div className="text-2xl font-bold">₹{grandTotal}</div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { clear(); showToast("Cart cleared", "success"); }} className="px-4 py-2 border rounded">Clear</button>
            <Link href="/items" className="px-4 py-2 bg-gray-900 text-white rounded">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
