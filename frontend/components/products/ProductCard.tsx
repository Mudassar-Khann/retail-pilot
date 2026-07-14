import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Eye, Heart, ArrowUpRight } from "lucide-react";
import { useNavigationStore } from "@/store/navigationStore";
import { useProductStore } from "@/store/productStore";
import { GlassSurface } from "@/components/ui/glass-surface";
import { Surface } from "@/components/ui/surface";
import { cn } from "@/lib/utils";

export interface UnifiedProduct {
  id?: number;
  product_id?: number;
  name: string;
  brand?: string;
  category?: string;
  price: number;
  thumbnail?: string;
  image_path?: string;
  availability?: string;
  short_metadata?: string;
  reason?: string;
  match_label?: string;
  description?: string;
  style_tags?: string[];
  color?: string;
  size_options?: string[];
  gender?: string;
  season?: string;
  material?: string;
  fit?: string;
  origin?: string;
}

interface ProductCardProps {
  product: UnifiedProduct;
  variant?: "recommendation" | "gallery" | "hero" | "wishlist" | "compact" | "comparison";
}

export function ProductCard({ product, variant = "gallery" }: ProductCardProps) {
  const { setPath } = useNavigationStore();
  const { toggleSaved, savedProducts } = useProductStore();
  const [isHovered, setIsHovered] = useState(false);

  const pId = product.id || product.product_id;
  const pImage = product.thumbnail || product.image_path;
  const isSaved = savedProducts.includes(pId as number);

  // Compact variant for sidebars or tight grid
  if (variant === "compact") {
    return (
      <Surface layer="1" className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--bg-elevated)] transition-colors border border-[var(--border-soft)]">
        <div className="w-16 h-16 rounded-md overflow-hidden bg-black/5 flex-shrink-0">
          {pImage && <img src={pImage} alt={product.name} className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/product/${pId}`} onClick={() => setPath(`/product/${pId}`)} className="block truncate text-sm font-medium hover:text-[var(--accent-gold)]">
            {product.name}
          </Link>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-1">${product.price.toFixed(2)}</p>
        </div>
      </Surface>
    );
  }

  // Recommendation variant (Stylist specific)
  if (variant === "recommendation") {
    return (
      <GlassSurface variant="smooth" className="relative flex flex-col overflow-hidden rounded-[2rem] group transition-all duration-700 hover:shadow-[0_20px_40px_rgba(197,168,128,0.15)]">
        <div className="relative aspect-[4/5] bg-black/5 flex items-center justify-center overflow-hidden">
          {pImage && <img src={pImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
          {product.match_label && (
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-[var(--accent-gold)]/90 backdrop-blur-md text-white technical-label border-none px-2.5 py-1">
                {product.match_label}
              </Badge>
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col gap-3 flex-1">
          <div>
            <p className="technical-label mb-1">{product.short_metadata || product.category || "Apparel"}</p>
            <Link href={`/product/${pId}`} onClick={() => setPath(`/product/${pId}`)} className="block group-hover:text-[var(--accent-gold)] transition-colors">
              <h3 className="text-sm font-medium truncate">{product.name}</h3>
            </Link>
            <p className="font-mono text-xs text-[var(--text-secondary)] mt-1.5">${product.price.toFixed(2)}</p>
          </div>
          {product.reason && (
            <div className="mt-auto">
              <div className="w-4 h-[1px] bg-[var(--accent-gold)] mb-2" />
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic line-clamp-2">
                "{product.reason}"
              </p>
            </div>
          )}
        </div>
      </GlassSurface>
    );
  }

  // Default / Gallery variant
  return (
    <Surface layer="1" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="relative flex flex-col rounded-2xl overflow-hidden group transition-all duration-500 border border-[var(--border-soft)] hover:border-[var(--accent-gold)]/30 bg-black/20">
      <div className="p-3">
        <div className="relative aspect-[3/4] bg-neutral-950/40 rounded-xl overflow-hidden border border-white/5">
          {pImage ? (
            <img src={pImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <span className="technical-label opacity-40">NO IMAGE</span>
            </div>
          )}

          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => toggleSaved(pId as number)} className="w-8 h-8 rounded-full bg-[var(--bg-overlay)] backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform">
              <Heart size={14} className={isSaved ? "fill-rose-500 text-rose-500" : "text-white"} />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-1">
        <p className="technical-label">{product.brand || "RetailPilot"}</p>
        <Link href={`/product/${pId}`} onClick={() => setPath(`/product/${pId}`)} className="block">
          <h3 className="text-sm font-medium line-clamp-1 group-hover:text-[var(--accent-gold)] transition-colors">{product.name}</h3>
        </Link>
        <p className="font-mono text-xs text-[var(--text-secondary)]">${product.price.toFixed(2)}</p>
      </div>
    </Surface>
  );
}
