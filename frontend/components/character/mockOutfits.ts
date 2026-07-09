import { ClothingItem } from "./OutfitState";

export const MOCK_TOPS: ClothingItem[] = [
  {
    id: 1,
    name: "Classic Heavyweight Cotton Tee",
    brand: "AetherStreet",
    category: "T-Shirts",
    price: 35.0,
    color: "Black",
    size_options: ["S", "M", "L", "XL"],
    style_tags: ["Streetwear", "Casual"]
  },
  {
    id: 2,
    name: "Pima Cotton Minimalist Tee",
    brand: "Loom & Craft",
    category: "T-Shirts",
    price: 45.0,
    color: "White",
    size_options: ["S", "M", "L", "XL"],
    style_tags: ["Minimalist", "Casual"]
  },
  {
    id: 3,
    name: "Oversized Drop-Shoulder Tee",
    brand: "K-Wave Studio",
    category: "T-Shirts",
    price: 38.0,
    color: "Beige",
    size_options: ["M", "L", "XL"],
    style_tags: ["Korean Fashion", "Streetwear"]
  },
  {
    id: 4,
    name: "Pique Cotton Polo Shirt",
    brand: "Belgravia Tailors",
    category: "T-Shirts",
    price: 75.0,
    color: "Navy",
    size_options: ["S", "M", "L", "XL", "XXL"],
    style_tags: ["Old Money", "Casual"]
  },
  {
    id: 5,
    name: "Oxford Cotton Button-Down Shirt",
    brand: "Belgravia Tailors",
    category: "Shirts",
    price: 95.0,
    color: "Light Blue",
    size_options: ["S", "M", "L", "XL"],
    style_tags: ["Old Money", "Minimalist"]
  },
  {
    id: 6,
    name: "Linen Band-Collar Shirt",
    brand: "Loom & Craft",
    category: "Shirts",
    price: 80.0,
    color: "White",
    size_options: ["S", "M", "L", "XL"],
    style_tags: ["Minimalist", "Korean Fashion"]
  }
];

export const MOCK_OUTERWEAR: ClothingItem[] = [
  {
    id: 9,
    name: "Cyberpunk Shell Zip Hoodie",
    brand: "Systema Tech",
    category: "Hoodies",
    price: 160.0,
    color: "Black",
    size_options: ["S", "M", "L", "XL"],
    style_tags: ["Techwear", "Streetwear"]
  },
  {
    id: 10,
    name: "Oversized Vintage Wash Hoodie",
    brand: "AetherStreet",
    category: "Hoodies",
    price: 90.0,
    color: "Olive",
    size_options: ["S", "M", "L", "XL", "XXL"],
    style_tags: ["Streetwear", "Casual"]
  },
  {
    id: 12,
    name: "Merino Wool Double-Breasted Coat",
    brand: "Belgravia Tailors",
    category: "Jackets",
    price: 420.0,
    color: "Camel",
    size_options: ["M", "L", "XL"],
    style_tags: ["Old Money", "Minimalist"]
  },
  {
    id: 13,
    name: "Modular Gore-Tex Shell Jacket",
    brand: "Systema Tech",
    category: "Jackets",
    price: 380.0,
    color: "Matte Black",
    size_options: ["S", "M", "L", "XL"],
    style_tags: ["Techwear", "Minimalist"]
  },
  {
    id: 14,
    name: "Oversized Puffer Jacket",
    brand: "AetherStreet",
    category: "Jackets",
    price: 220.0,
    color: "Silver",
    size_options: ["S", "M", "L", "XL"],
    style_tags: ["Streetwear", "Korean Fashion"]
  },
  {
    id: 15,
    name: "Boucle Tweed Short Jacket",
    brand: "K-Wave Studio",
    category: "Jackets",
    price: 145.0,
    color: "Cream",
    size_options: ["S", "M", "L"],
    style_tags: ["Korean Fashion", "Minimalist"]
  }
];

export const MOCK_BOTTOMS: ClothingItem[] = [
  {
    id: 16,
    name: "Selvedge Raw Denim Jeans",
    brand: "Loom & Craft",
    category: "Jeans",
    price: 150.0,
    color: "Indigo",
    size_options: ["30", "32", "34", "36"],
    style_tags: ["Minimalist", "Casual"]
  },
  {
    id: 17,
    name: "Loose Fit Distressed Jeans",
    brand: "AetherStreet",
    category: "Jeans",
    price: 85.0,
    color: "Light Blue",
    size_options: ["28", "30", "32", "34"],
    style_tags: ["Streetwear", "Casual"]
  },
  {
    id: 18,
    name: "Wide-Leg Drape Jeans",
    brand: "K-Wave Studio",
    category: "Jeans",
    price: 75.0,
    color: "Ecru",
    size_options: ["26", "28", "30", "32"],
    style_tags: ["Korean Fashion", "Minimalist"]
  },
  {
    id: 19,
    name: "Multi-Pocket Tactical Cargos",
    brand: "Systema Tech",
    category: "Cargo Pants",
    price: 170.0,
    color: "Olive Drab",
    size_options: ["S", "M", "L", "XL"],
    style_tags: ["Techwear", "Streetwear"]
  },
  {
    id: 21,
    name: "Pima Cotton Slim Chinos",
    brand: "Loom & Craft",
    category: "Chinos",
    price: 88.0,
    color: "Navy",
    size_options: ["30", "32", "34", "36"],
    style_tags: ["Minimalist", "Casual"]
  },
  {
    id: 22,
    name: "Pleated Tailored Trousers",
    brand: "Belgravia Tailors",
    category: "Chinos",
    price: 140.0,
    color: "Charcoal",
    size_options: ["30", "32", "34", "36"],
    style_tags: ["Old Money", "Minimalist"]
  }
];

export const MOCK_SHOES: ClothingItem[] = [
  {
    id: 23,
    name: "Leather Chelsea Boots",
    brand: "Belgravia Tailors",
    category: "Shoes",
    price: 240.0,
    color: "Tan",
    size_options: ["8", "9", "10", "11", "12"],
    style_tags: ["Old Money", "Minimalist"]
  },
  {
    id: 24,
    name: "Minimalist White Leather Sneaker",
    brand: "Loom & Craft",
    category: "Shoes",
    price: 180.0,
    color: "White",
    size_options: ["7", "8", "9", "10", "11", "12"],
    style_tags: ["Minimalist", "Casual"]
  },
  {
    id: 25,
    name: "Platform Chunky Retro Sneakers",
    brand: "AetherStreet",
    category: "Shoes",
    price: 120.0,
    color: "Grey",
    size_options: ["8", "9", "10", "11"],
    style_tags: ["Streetwear", "Korean Fashion"]
  },
  {
    id: 26,
    name: "Waterproof Techwear Combat Boots",
    brand: "Systema Tech",
    category: "Shoes",
    price: 210.0,
    color: "Black",
    size_options: ["8", "9", "10", "11", "12"],
    style_tags: ["Techwear", "Streetwear"]
  }
];
