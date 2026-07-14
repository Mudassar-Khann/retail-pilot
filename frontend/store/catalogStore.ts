import { create } from "zustand";
import { UnifiedProduct } from "@/components/products/ProductCard";

interface CatalogState {
  products: UnifiedProduct[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  activeFilters: Record<string, string[]>;
  setSearchQuery: (query: string) => void;
  setFilter: (category: string, values: string[]) => void;
  clearFilters: () => void;
  fetchProducts: () => Promise<void>;
}

export const useCatalogStore = create<CatalogState>((set) => ({
  products: [],
  isLoading: false,
  error: null,
  searchQuery: "",
  activeFilters: {},
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilter: (category, values) => set((state) => ({
    activeFilters: { ...state.activeFilters, [category]: values }
  })),
  clearFilters: () => set({ activeFilters: {}, searchQuery: "" }),
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/products`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.products && Array.isArray(data.products)) {
        set({ products: data.products, isLoading: false });
      } else {
        set({ products: [], isLoading: false });
      }
    } catch (err: any) {
      console.warn("API unavailable:", err);
      set({ error: err.message, isLoading: false });
    }
  }
}));
