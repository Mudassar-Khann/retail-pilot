import ProductCard, { ProductType } from "@/components/products/ProductCard";

export default function FeaturedProducts() {
  const mockProducts: ProductType[] = [
    {
      id: 1,
      name: "Classic Heavyweight Cotton Tee",
      description: "Boxy-fit, heavy 240gsm cotton t-shirt with a vintage wash. Prefect streetwear staple.",
      brand: "AetherStreet",
      category: "T-Shirts",
      style_tags: ["Streetwear", "Casual"],
      color: "Black",
      size_options: ["S", "M", "L", "XL"],
      price: 35.0,
      gender: "Unisex",
      season: "Summer"
    },
    {
      id: 2,
      name: "Pima Cotton Minimalist Tee",
      description: "Ultra-soft luxury Pima cotton t-shirt with a slim silhouette and clean stitched hems.",
      brand: "Loom & Craft",
      category: "T-Shirts",
      style_tags: ["Minimalist", "Casual"],
      color: "White",
      size_options: ["S", "M", "L", "XL"],
      price: 45.0,
      gender: "Men",
      season: "All-Season"
    },
    {
      id: 5,
      name: "Oxford Cotton Button-Down Shirt",
      description: "Premium long-staple Oxford fabric with a classic button-down collar. A cornerstone of preppy style.",
      brand: "Belgravia Tailors",
      category: "Shirts",
      style_tags: ["Old Money", "Minimalist"],
      color: "Light Blue",
      size_options: ["S", "M", "L", "XL"],
      price: 95.0,
      gender: "Men",
      season: "All-Season"
    },
    {
      id: 13,
      name: "Modular Gore-Tex Shell Jacket",
      description: "3-layer Gore-Tex active shell with fully taped seams, underarm vents, and modular attachments.",
      brand: "Systema Tech",
      category: "Jackets",
      style_tags: ["Techwear", "Minimalist"],
      color: "Matte Black",
      size_options: ["S", "M", "L", "XL"],
      price: 380.0,
      gender: "Unisex",
      season: "Fall, Winter"
    },
    {
      id: 17,
      name: "Loose Fit Distressed Jeans",
      description: "Wide-leg loose-fit jeans with hand-ripped distressed knees and a stone-washed finish.",
      brand: "AetherStreet",
      category: "Jeans",
      style_tags: ["Streetwear", "Casual"],
      color: "Light Blue",
      size_options: ["28", "30", "32", "34"],
      price: 85.0,
      gender: "Unisex",
      season: "Spring, Summer"
    },
    {
      id: 22,
      name: "Pleated Tailored Trousers",
      description: "Tailored trousers featuring double front pleats, adjustable side tabs, and a high-rise fit. Perfect for an elegant Ivy league look.",
      brand: "Belgravia Tailors",
      category: "Chinos",
      style_tags: ["Old Money", "Minimalist"],
      color: "Charcoal",
      size_options: ["30", "32", "34", "36"],
      price: 140.0,
      gender: "Men",
      season: "Fall, Winter"
    },
    {
      id: 24,
      name: "Minimalist White Leather Sneaker",
      description: "Clean-profile white sneakers crafted from full-grain Nappa leather with a margom rubber sole.",
      brand: "Loom & Craft",
      category: "Shoes",
      style_tags: ["Minimalist", "Casual"],
      color: "White",
      size_options: ["7", "8", "9", "10", "11", "12"],
      price: 180.0,
      gender: "Unisex",
      season: "All-Season"
    },
    {
      id: 31,
      name: "Ribbed Knit Wool Beanie",
      description: "Thick ribbed fisherman beanie crafted from a soft extrafine wool blend. A cozy Korean aesthetic accessory.",
      brand: "K-Wave Studio",
      category: "Accessories",
      style_tags: ["Korean Fashion", "Casual"],
      color: "Cream",
      size_options: ["One-Size"],
      price: 28.0,
      gender: "Unisex",
      season: "Winter"
    }
  ];

  return (
    <section id="products" className="py-24 bg-white border-b border-neutral-100/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <p className="text-[9px] font-semibold tracking-[0.18em] text-neutral-400 uppercase">
              Curated Essentials
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-neutral-900">
              Curated Selection
            </h2>
          </div>
          <p className="text-xs font-light text-neutral-500 max-w-xs md:text-right leading-relaxed">
            A small selection of items reflecting the core aesthetic principles of our catalog.
          </p>
        </div>

        {/* Products Grid with gap-8 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
