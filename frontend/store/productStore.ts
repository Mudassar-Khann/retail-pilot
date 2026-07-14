import { create } from "zustand";

interface ProductState {
  viewedProducts: number[];
  savedProducts: number[];
  status: "idle" | "loading" | "error" | "offline";
  addToViewed: (id: number) => void;
  toggleSaved: (id: number) => void;
  setStatus: (status: "idle" | "loading" | "error" | "offline") => void;
}

export const useProductStore = create<ProductState>((set) => ({
  viewedProducts: [],
  savedProducts: [],
  status: "idle",
  addToViewed: (id) => set((state) => ({
    viewedProducts: state.viewedProducts.includes(id)
      ? state.viewedProducts
      : [...state.viewedProducts, id]
  })),
  toggleSaved: (id) => set((state) => ({
    savedProducts: state.savedProducts.includes(id)
      ? state.savedProducts.filter(p => p !== id)
      : [...state.savedProducts, id]
  })),
  setStatus: (status) => set({ status })
}));
