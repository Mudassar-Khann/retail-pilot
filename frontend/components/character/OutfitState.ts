export interface ClothingItem {
  id: number;
  name: string;
  brand: string;
  category: string; // T-Shirts, Shirts, Hoodies, Jackets, Jeans, Cargo Pants, Chinos, Shoes, Accessories
  description?: string;
  price: number;
  color: string;
  size_options: string[];
  style_tags: string[];
  image_path?: string;
  overlay_top_percent?: number;
  overlay_left_percent?: number;
  overlay_width_percent?: number;
  collection_name?: string;
  gender?: string;
}

export interface OutfitSelection {
  top: ClothingItem | null;
  outerwear: ClothingItem | null;
  bottom: ClothingItem | null;
  shoes: ClothingItem | null;
}
