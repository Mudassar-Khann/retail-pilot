export interface ClothingItem {
  id: number;
  name: string;
  brand: string;
  category: string; // T-Shirts, Shirts, Hoodies, Jackets, Jeans, Cargo Pants, Chinos, Shoes, Accessories
  price: number;
  color: string;
  size_options: string[];
  style_tags: string[];
  image_path?: string;
}

export interface OutfitSelection {
  top: ClothingItem | null;
  outerwear: ClothingItem | null;
  bottom: ClothingItem | null;
  shoes: ClothingItem | null;
}
