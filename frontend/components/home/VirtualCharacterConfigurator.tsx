"use client";

import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Eye } from "lucide-react";
import {
  VirtualModel,
  OutfitSelection,
  ClothingItem,
  MOCK_TOPS,
  MOCK_OUTERWEAR,
  MOCK_BOTTOMS,
  MOCK_SHOES
} from "@/components/character";
import StylistChat from "./StylistChat";
import ProductDetailDrawer from "../catalog/ProductDetailDrawer";
import { ProductSilhouette, getProductSlot } from "@/components/character/garmentArt";
import LookSaver, { SavedLook } from "../character/LookSaver";
import CheckoutModal from "../catalog/CheckoutModal";
import AestheticPortals from "../catalog/AestheticPortals";

export type AestheticType = 'all' | 'luxury' | 'streetwear' | 'techwear';

interface ApiProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  color: string;
  description?: string;
  image_path?: string | null;
  overlay_top_percent?: number;
  overlay_left_percent?: number;
  overlay_width_percent?: number;
  collection_name?: string;
  gender?: string;
  season?: string;
  stock_quantity?: number;
  size_options?: string | string[];
  style_tags?: string | string[];
}

interface ProductsResponse {
  products: ApiProduct[];
}

interface InteractiveProductCardProps {
  product: ClothingItem;
  isSelected: boolean;
  onToggleProduct: (product: ClothingItem) => void;
  onViewDetails: (product: ClothingItem) => void;
}

function InteractiveProductCard({
  product,
  isSelected,
  onToggleProduct,
  onViewDetails,
}: InteractiveProductCardProps) {
  const [transformStyle, setTransformStyle] = useState<string>("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Limit rotation to 5deg
    const rotateX = (-mouseY / (height / 2)) * 5;
    const rotateY = (mouseX / (width / 2)) * 5;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  const getShadowColor = (tags: string[] = []) => {
    const tagStr = tags.join(" ").toLowerCase();
    if (tagStr.includes("old money") || tagStr.includes("quiet luxury")) return "rgba(197, 168, 128, 0.22)";
    if (tagStr.includes("techwear")) return "rgba(217, 119, 6, 0.15)";
    if (tagStr.includes("streetwear")) return "rgba(139, 30, 45, 0.15)";
    return "rgba(197, 168, 128, 0.12)";
  };

  const shadowColor = getShadowColor(product.style_tags);

  return (
    <div
      data-testid={`product-card-${product.id}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`group relative p-5 border rounded-md flex flex-col justify-between min-h-56 bg-[var(--bg-card)]/40 will-change-transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isSelected
          ? "border-lime-500 ring-1 ring-lime-400/20 bg-lime-500/5"
          : "border-[var(--border-soft)]/80 hover:border-[var(--accent-gold)]/40"
      }`}
      style={{
        transform: transformStyle,
        boxShadow: isHovered ? `0 16px 40px ${shadowColor}` : "var(--shadow-card)",
      }}
    >
      {/* Top corner indicators */}
      <div className="flex justify-between items-start pointer-events-none select-none">
        <span className="text-[8px] font-mono tracking-widest text-[var(--text-muted)] uppercase">
          {product.brand}
        </span>
        {isSelected && (
          <span className="px-1.5 py-0.5 text-[7px] font-mono bg-lime-500/20 border border-lime-500/30 text-lime-400 font-bold uppercase rounded-[1px] tracking-wider animate-pulse">
            Draped
          </span>
        )}
      </div>

      {/* Inline Vector Silhouette Fallback */}
      <div
        onClick={() => onToggleProduct(product)}
        className="flex-1 flex items-center justify-center py-2 cursor-pointer"
      >
        <ProductSilhouette
          product={product}
          className="w-20 h-20 opacity-20 group-hover:opacity-35 transition-all duration-300"
        />
      </div>

      <div className="space-y-1 mt-1 mb-2 pointer-events-none">
        <h3 className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-gold-hover)] transition-colors">
          {product.name}
        </h3>
        <p className="text-[9px] font-light text-[var(--text-muted)] line-clamp-1">
          {product.description}
        </p>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center border-t border-[var(--border-soft)] pt-3 z-20">
        {/* Details Trigger Link */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(product);
          }}
          className="inline-flex items-center gap-1 text-[8px] font-mono text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors tracking-widest uppercase cursor-pointer"
        >
          <Eye size={10} />
          Details
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleProduct(product)}
            data-testid={`wear-product-${product.id}`}
            className="px-2 py-0.5 text-[7px] font-mono border border-[var(--border-soft)] rounded-[2px] uppercase text-[var(--text-secondary)] hover:border-[var(--accent-gold)]/60 hover:text-[var(--accent-gold)] cursor-pointer"
          >
            Wear
          </button>
          <span className="text-xs font-bold text-[var(--accent-gold)]">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function VirtualCharacterConfigurator({ defaultStyle }: { defaultStyle?: string | null }) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);
  const [products, setProducts] = useState<ClothingItem[]>([]);
  const [selection, setSelection] = useState<OutfitSelection>({
    top: MOCK_TOPS[0], // Classic Heavyweight Cotton Tee
    outerwear: MOCK_OUTERWEAR[1], // Oversized Vintage Wash Hoodie
    bottom: MOCK_BOTTOMS[1], // Loose Fit Distressed Jeans
    shoes: MOCK_SHOES[1] // Minimalist White Leather Sneaker
  });

  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  // Collections Switcher Active State
  const [activeCollection, setActiveCollection] = useState<string>("ALL");

  // Immersive Product Details Drawer State
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<ClothingItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aestheticRating, setAestheticRating] = useState<string>("Incomplete Ensemble");
  const [activeAesthetic, setActiveAesthetic] = useState<AestheticType>("all");

  // Sync with homepage editorial style selections
  useEffect(() => {
    if (!defaultStyle) return;

    const styleLower = defaultStyle.toLowerCase();
    if (styleLower.includes("old money") || styleLower.includes("minimalist")) {
      setActiveCollection("QUIET LUXURY Essentials");
      setActiveAesthetic("luxury");
    } else if (styleLower.includes("streetwear") || styleLower.includes("korean")) {
      setActiveCollection("SARTORIAL SLOUCH");
      setActiveAesthetic("streetwear");
    } else if (styleLower.includes("techwear")) {
      setActiveCollection("TECHNICAL APPAREL");
      setActiveAesthetic("techwear");
    }
  }, [defaultStyle]);

  const handleSelectAesthetic = (aesthetic: AestheticType) => {
    if (aesthetic === activeAesthetic) {
      setActiveAesthetic("all");
      return;
    }

    setActiveAesthetic(aesthetic);

    // Curated Auto-Drape flagship items of the collection
    let flagshipTopId: number | null = null;
    let flagshipBottomId: number | null = null;
    let flagshipOuterwearId: number | null = null;

    if (aesthetic === "luxury") {
      flagshipTopId = 2001;
      flagshipBottomId = 2004;
    } else if (aesthetic === "streetwear") {
      flagshipTopId = 2002;
      flagshipBottomId = 2004;
    } else if (aesthetic === "techwear") {
      flagshipTopId = 2003;
      flagshipOuterwearId = 2005;
    }

    const needsDrape =
      (flagshipTopId && selection.top?.id !== flagshipTopId) ||
      (flagshipBottomId && selection.bottom?.id !== flagshipBottomId) ||
      (flagshipOuterwearId && selection.outerwear?.id !== flagshipOuterwearId);

    if (needsDrape) {
      const topProd = flagshipTopId ? products.find(p => p.id === flagshipTopId) : null;
      const bottomProd = flagshipBottomId ? products.find(p => p.id === flagshipBottomId) : null;
      const outerwearProd = flagshipOuterwearId ? products.find(p => p.id === flagshipOuterwearId) : null;

      setSelection(prev => ({
        top: topProd || prev.top,
        bottom: bottomProd || prev.bottom,
        outerwear: outerwearProd || (aesthetic === "techwear" ? prev.outerwear : null),
        shoes: prev.shoes
      }));

      // Resolve gender if flagship top or bottom is women's, fallback to male since these flagship items are Men/Unisex
      const resolvedGender = (topProd?.gender === "Women" || bottomProd?.gender === "Women") ? "female" : "male";
      setGender(resolvedGender);
    }
  };

  // Fetch real database catalog products
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("http://localhost:8000/api/products");
        const data: ProductsResponse = await res.json();
        if (data.products && data.products.length > 0) {
          const normalized: ClothingItem[] = data.products.map((p: ApiProduct) => {
            const styleTagsArray = typeof p.style_tags === "string"
              ? p.style_tags.split(",")
              : Array.isArray(p.style_tags)
                ? p.style_tags
                : [];

            const sizeOptionsArray = typeof p.size_options === "string"
              ? p.size_options.split(",")
              : Array.isArray(p.size_options)
                ? p.size_options
                : [];

            return {
              id: Number(p.id),
              name: p.name,
              brand: p.brand,
              category: p.category,
              price: Number(p.price),
              color: p.color,
              description: p.description,
              image_path: p.image_path || undefined,
              overlay_top_percent: p.overlay_top_percent,
              overlay_left_percent: p.overlay_left_percent,
              overlay_width_percent: p.overlay_width_percent,
              collection_name: p.collection_name,
              gender: p.gender,
              style_tags: styleTagsArray,
              size_options: sizeOptionsArray
            };
          });
          setProducts(normalized);
          return;
        }
      } catch (err) {
        console.warn("Backend offline or failed to fetch products. Using mock fallback.", err);
      }

      // Fallback to local mock data
      setProducts([
        ...MOCK_TOPS,
        ...MOCK_OUTERWEAR,
        ...MOCK_BOTTOMS,
        ...MOCK_SHOES
      ]);
    }
    loadProducts();
  }, []);

  // Toggle selection callback
  const handleToggleProduct = (product: ClothingItem) => {
    const slot = getProductSlot(product.category);
    if (!slot) return;

    setSelection(prev => {
      const isSelected = prev[slot]?.id === product.id;
      return {
        ...prev,
        [slot]: isSelected ? null : product
      };
    });
    setActiveSlot(slot);
  };

  // Custom drape callback for the AI Stylist
  const handleDrapeOutfit = (topItem: ClothingItem | null, bottomItem: ClothingItem | null) => {
    setSelection(prev => ({
      ...prev,
      top: topItem || prev.top,
      bottom: bottomItem || prev.bottom
    }));
  };

  const handleExternalDrape = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) {
      console.warn(`External drape request for product ID ${productId} ignored (not found in catalog).`);
      return;
    }

    const slot = getProductSlot(product.category);
    if (!slot) {
      console.warn(`External drape request ignored: Unknown category '${product.category}' for product ID ${productId}.`);
      return;
    }

    setSelection(prev => ({
      ...prev,
      [slot]: product
    }));

    if (product.gender === "Women") {
      setGender("female");
    } else if (product.gender === "Men") {
      setGender("male");
    }
  };

  // Custom Load Saved Look Callback
  const handleLoadSavedLook = (look: SavedLook) => {
    const topItem = products.find(p => p.id === look.top_id) || null;
    const bottomItem = products.find(p => p.id === look.bottom_id) || null;
    const outerwearItem = products.find(p => p.id === look.outerwear_id) || null;
    const shoesItem = products.find(p => p.id === look.shoes_id) || null;

    setSelection({
      top: topItem,
      bottom: bottomItem,
      outerwear: outerwearItem,
      shoes: shoesItem
    });

    const resolvedGender = topItem?.gender === "Women" || bottomItem?.gender === "Women"
      ? "female"
      : topItem?.gender === "Men" || bottomItem?.gender === "Men"
        ? "male"
        : gender;

    setGender(resolvedGender);
    setActiveSlot(null);
  };

  // Total price calculation
  const selectedItems = Object.values(selection) as Array<ClothingItem | null>;
  const totalPrice = selectedItems.reduce((sum, item) => {
    return sum + (item ? item.price : 0);
  }, 0);

  // Collections Categories Switcher list
  const collections = ["ALL", "TECHNICAL APPAREL", "QUIET LUXURY Essentials", "SARTORIAL SLOUCH"];

  // Filtering products by Curated Collection & Active Aesthetic
  const filteredProducts = products.filter(p => {
    // 1. First filter by activeAesthetic if not 'all'
    if (activeAesthetic !== "all") {
      const tags = (p.style_tags || []).map(t => t.toLowerCase());
      const colName = (p.collection_name || "").toLowerCase();

      if (activeAesthetic === "luxury") {
        const isLux = p.id === 2001 || p.id === 2004 ||
                      colName.includes("luxury") ||
                      tags.includes("quiet luxury") ||
                      tags.includes("old money");
        if (!isLux) return false;
      } else if (activeAesthetic === "streetwear") {
        const isStreet = p.id === 2002 || p.id === 2004 ||
                        colName.includes("streetwear") ||
                        tags.includes("streetwear");
        if (!isStreet) return false;
      } else if (activeAesthetic === "techwear") {
        const isTech = p.id === 2003 || p.id === 2005 ||
                      colName.includes("techwear") ||
                      tags.includes("techwear");
        if (!isTech) return false;
      }
    }

    // 2. Then filter by category collection selector
    if (activeCollection === "ALL") return true;

    const pCol = p.collection_name?.toUpperCase() || "";
    const activeCol = activeCollection.toUpperCase();

    if (activeCol.includes("TECHWEAR") || activeCol.includes("TECHNICAL")) return pCol.includes("TECHWEAR") || pCol.includes("TECHNICAL");
    if (activeCol.includes("QUIET LUXURY")) return pCol.includes("QUIET LUXURY");
    if (activeCol.includes("SLOUCH")) return pCol.includes("SLOUCH");

    return true;
  });

  const getCollectionBannerStyle = () => {
    if (activeCollection === "TECHNICAL APPAREL") {
      return "from-amber-600/30 via-[var(--background)] to-[var(--background)] border-amber-500/20 text-amber-200";
    }
    if (activeCollection.includes("QUIET LUXURY")) {
      return "from-yellow-600/20 via-[var(--background)] to-[var(--background)] border-yellow-500/10 text-yellow-100";
    }
    if (activeCollection === "SARTORIAL SLOUCH") {
      return "from-lime-600/20 via-[var(--background)] to-[var(--background)] border-lime-500/15 text-lime-200";
    }
    return "from-[var(--bg-secondary)] to-[var(--background)] border-[var(--border-soft)] text-[var(--text-secondary)]";
  };

  const getGlowColors = (type: AestheticType) => {
    if (type === "luxury") return { bg1: "rgba(197, 168, 128, 0.12)", bg2: "rgba(217, 119, 6, 0.06)", filter1: "blur(120px)", filter2: "blur(140px)" };
    if (type === "streetwear") return { bg1: "rgba(220, 38, 38, 0.1)", bg2: "rgba(153, 27, 27, 0.05)", filter1: "blur(110px)", filter2: "blur(130px)" };
    if (type === "techwear") return { bg1: "rgba(6, 182, 212, 0.1)", bg2: "rgba(5, 150, 105, 0.05)", filter1: "blur(100px)", filter2: "blur(120px)" };
    return { bg1: "rgba(197, 168, 128, 0.12)", bg2: "rgba(217, 119, 6, 0.06)", filter1: "blur(120px)", filter2: "blur(140px)" };
  };
  const glowColors = getGlowColors(activeAesthetic);

  return (
    <section id="character" className="py-20 bg-[var(--background)] border-b border-[var(--border-soft)] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.18em] text-[var(--text-muted)] uppercase">
              <Sparkles size={10} className="text-[var(--text-muted)]" />
              Dynamic Try-On Engine
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-[var(--text-primary)] leading-tight">
              Virtual Model Showcase
            </h2>
          </div>
          <p className="text-xs font-light text-[var(--text-secondary)] max-w-xs md:text-right leading-relaxed font-sans">
            Browse collections, click to wear clothes, or ask the AI Stylist to design and drape custom outfits onto the mannequin.
          </p>
        </div>

        {/* Collections Switcher Navigation Bar (Wide tracking wide monospaced) */}
        <div className="flex flex-wrap gap-2 border-b border-[var(--border-soft)] pb-4">
          {collections.map(col => (
            <button
              key={col}
              onClick={() => setActiveCollection(col)}
              className={`px-4 py-2.5 text-[9px] font-mono tracking-[0.18em] uppercase transition-all duration-300 rounded-[2px] cursor-pointer ${
                activeCollection === col
                  ? "bg-[var(--bg-secondary)] text-[var(--accent-gold)] font-bold border border-[var(--accent-gold)]/30"
                  : "bg-[var(--background)] text-[var(--text-muted)] border border-[var(--border-soft)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              [ {col} ]
            </button>
          ))}
        </div>

        {/* 60/40 Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Left Column (60% width) - Editorial Product Catalog */}
          <div className="lg:col-span-7 space-y-8">

            {/* Aesthetic moodboard portals */}
            <AestheticPortals
              activeAesthetic={activeAesthetic}
              onSelectAesthetic={handleSelectAesthetic}
            />

            {/* Curated Collection Theme Banner */}
            <div className={`p-6 border bg-gradient-to-r ${getCollectionBannerStyle()} rounded-md transition-all duration-500 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
              <div className="space-y-1.5">
                <span className="text-[7px] font-mono tracking-[0.25em] uppercase opacity-75">Curated Editorial</span>
                <h4 className="text-xs font-bold font-mono tracking-widest uppercase">
                  {activeCollection === "ALL" ? "THE FULL RETAIL CATALOG" : activeCollection}
                </h4>
              </div>
              <span className="text-[8px] font-mono tracking-wider opacity-80 uppercase bg-[var(--background)]/40 px-3 py-1 border border-[var(--foreground)]/5 rounded-sm">
                {filteredProducts.length} items shown
              </span>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredProducts.map(p => {
                const slot = getProductSlot(p.category);
                const isSelected = slot && selection[slot]?.id === p.id;

                return (
                  <InteractiveProductCard
                    key={p.id}
                    product={p}
                    isSelected={!!isSelected}
                    onToggleProduct={handleToggleProduct}
                    onViewDetails={(prod) => {
                      setSelectedDetailProduct(prod);
                      setIsDrawerOpen(true);
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Right Column (40% width) - Sticky Mannequin Viewer */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6 relative">
            {/* Background Layering: Ambient blurs */}
            <div
              className="absolute -inset-10 pointer-events-none z-0 rounded-full"
              data-no-theme-transition
              style={{
                backgroundImage: "radial-gradient(circle, currentColor 0%, transparent 80%)",
                color: glowColors.bg1,
                filter: glowColors.filter1,
                opacity: "var(--glow-opacity)",
                transition: "color 1.5s ease-in-out, filter 1.5s ease-in-out"
              }}
            />
            <div
              className="absolute -top-20 -right-20 w-96 h-96 pointer-events-none z-0 rounded-full animate-ambient"
              data-no-theme-transition
              style={{
                backgroundImage: "radial-gradient(circle, currentColor 0%, transparent 70%)",
                color: glowColors.bg2,
                filter: glowColors.filter2,
                opacity: "var(--glow-opacity)",
                transition: "color 1.5s ease-in-out, filter 1.5s ease-in-out"
              }}
            />

            <div className="border border-[var(--border-soft)]/80 hover:border-[var(--accent-gold)]/40 p-6 glass-fluted rounded-md relative z-10" style={{ boxShadow: "var(--shadow-card-hover)" }}>
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--border-soft)]" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[var(--border-soft)]" />

              <div className="flex flex-col items-center gap-6">
                 {/* 1. Mannequin Layer */}
                <VirtualModel
                  selection={selection}
                  activeSlot={activeSlot}
                  gender={gender}
                  onGenderChange={setGender}
                  onStyleScoreChange={(score) => setAestheticRating(score.alignment_rating)}
                />

                {/* Checkout Wardrobe Action Button */}
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  disabled={totalPrice === 0}
                  className="w-full py-2.5 bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] text-[var(--foreground)] disabled:opacity-50 text-[9px] font-mono tracking-[0.2em] uppercase rounded-sm cursor-pointer transition-all duration-300 border border-[var(--border-soft)] hover:border-[var(--accent-gold)]/40 shadow-sm"
                >
                  [ CHECKOUT WARDROBE ]
                </button>

                {/* 2. Style telemetry details */}
                <div className="w-full grid grid-cols-3 gap-4 bg-[var(--background)]/60 border border-[var(--border-soft)]/80 p-3.5 rounded-sm shadow-none">
                  <div>
                    <p className="text-[7px] text-[var(--text-muted)] uppercase tracking-widest font-mono">Outfit Price</p>
                    <p className="text-xs font-bold text-[var(--text-primary)] mt-0.5">
                      ${totalPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[7px] text-[var(--text-muted)] uppercase tracking-widest font-mono">Collection</p>
                    <p className="text-[9px] font-semibold text-[var(--accent-gold)] mt-1 uppercase tracking-wide truncate">
                      {activeCollection === "ALL" ? "Editorial Mix" : activeCollection}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[7px] text-[var(--text-muted)] uppercase tracking-widest font-mono">Fitted Slots</p>
                    <p className="text-[9px] text-[var(--text-secondary)] mt-1 font-mono">
                      {selectedItems.filter(Boolean).length}/4
                    </p>
                  </div>
                </div>

                {/* 3. Look Saver Widget */}
                <LookSaver
                  selection={selection}
                  allProducts={products}
                  totalPrice={totalPrice}
                  aestheticRating={aestheticRating}
                  onLoadLook={handleLoadSavedLook}
                />

                {/* 4. AI Stylist Chat pane */}
                <div className="w-full">
                  <StylistChat
                    onDrapeOutfit={handleDrapeOutfit}
                    onExternalDrape={handleExternalDrape}
                    activeOrderId={activeOrderId}
                    products={products}
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Product Detail Sliding Side-Sheet Drawer */}
      <ProductDetailDrawer
        product={selectedDetailProduct}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedDetailProduct(null);
        }}
        onDrape={handleToggleProduct}
      />

      {/* Checkout Drawer Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selection={selection}
        onPurchaseSuccess={(orderId) => {
          setActiveOrderId(orderId);
        }}
      />
    </section>
  );
}
