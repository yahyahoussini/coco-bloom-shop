import { create } from "zustand";
import type { CartItem } from "@/types/models";

interface CartState {
  items: CartItem[];
  itemsCount: number;
  subtotal: number;
  add: (item: CartItem) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
}

const calc = (items: CartItem[]) => {
  const itemsCount = items.reduce((n, it) => n + it.qty, 0);
  const subtotal = items.reduce((s, it) => s + it.unitPrice * it.qty, 0);
  return { itemsCount, subtotal };
};

export const useCart = create<CartState>((set, get) => ({
  items: [],
  itemsCount: 0,
  subtotal: 0,
  add: (item) => set(() => {
    const existing = get().items.find(i => i.productId === item.productId);
    const items = existing
      ? get().items.map(i => i.productId === item.productId ? { ...i, qty: i.qty + item.qty } : i)
      : [...get().items, item];
    return { items, ...calc(items) };
  }),
  remove: (productId) => set(() => {
    const items = get().items.filter(i => i.productId !== productId);
    return { items, ...calc(items) };
  }),
  setQty: (productId, qty) => set(() => {
    const items = get().items.map(i => i.productId === productId ? { ...i, qty } : i);
    return { items, ...calc(items) };
  }),
  clear: () => set(() => ({ items: [], itemsCount: 0, subtotal: 0 })),
}));
