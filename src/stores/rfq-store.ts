"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RFQItem } from "@/types";

interface RFQStore {
  items: RFQItem[];
  isDrawerOpen: boolean;
  activeTab: "quick" | "list";
  addItem: (item: RFQItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearItems: () => void;
  openDrawer: (tab?: "quick" | "list") => void;
  closeDrawer: () => void;
  setActiveTab: (tab: "quick" | "list") => void;
  hasItem: (productId: string) => boolean;
}

export const useRFQStore = create<RFQStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      activeTab: "quick",

      addItem: (item) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        });
      },

      clearItems: () => set({ items: [] }),

      openDrawer: (tab) => set({ isDrawerOpen: true, activeTab: tab || get().activeTab }),

      closeDrawer: () => set({ isDrawerOpen: false }),

      setActiveTab: (tab) => set({ activeTab: tab }),

      hasItem: (productId) => get().items.some((i) => i.productId === productId),
    }),
    {
      name: "marassi-rfq",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
