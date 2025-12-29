"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Item } from "@/components/ItemCard";

type CartItem = { item: Item; days: number };

type CartContextType = {
  items: CartItem[];
  addItem: (item: Item, days?: number) => void;
  removeItem: (itemId: string) => void;
  updateDays: (itemId: string, days: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateDays: () => {},
  clear: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("rms_cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("rms_cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (item: Item, days = 1) => {
    setItems((prev) => {
      const exists = prev.find((p) => p.item.id === item.id);
      if (exists) return prev.map((p) => p.item.id === item.id ? { ...p, days: Math.max(1, p.days + days) } : p);
      return [...prev, { item, days: Math.max(1, days) }];
    });
  };

  const removeItem = (itemId: string) => setItems((p) => p.filter((x) => x.item.id !== itemId));

  const updateDays = (itemId: string, days: number) => setItems((p) => p.map((x) => x.item.id === itemId ? { ...x, days: Math.max(1, days) } : x));

  const clear = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateDays, clear }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export type { CartItem };

export default CartProvider;
