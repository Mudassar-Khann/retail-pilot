"use client";

import { X, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { ClothingItem } from "@/components/character";
import { Button } from "@/components/ui/button";
import { ProductSilhouette } from "@/components/character/garmentArt";

interface ProductDetailDrawerProps {
  product: ClothingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDrape: (product: ClothingItem) => void;
}

export default function ProductDetailDrawer({ product, isOpen, onClose, onDrape }: ProductDetailDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !product) return null;

  // Custom lookups for materials and compositions
  const getComposition = (prod: ClothingItem) => {
    const desc = prod.description?.toLowerCase() || "";
    if (desc.includes("cotton") || prod.category.includes("Tee")) return "100% Organic Pima Cotton";
    if (desc.includes("linen")) return "100% French Flax Linen";
    if (desc.includes("nylon") || desc.includes("water-repellent")) return "Seam-sealed 3-layer technical membrane";
    if (desc.includes("wool") || desc.includes("gabardine")) return "100% Super-120s Virgin Wool";
    return "Premium blended structural fiber";
  };

  const getFitDescription = (prod: ClothingItem) => {
    const name = prod.name.toLowerCase();
    if (name.includes("oversized") || name.includes("loose") || name.includes("boxy")) {
      return "Sartorial relaxed slouch silhouette with dropped shoulder framing and high-drape structure.";
    }
    return "Precision tailored slim profile engineered for quiet luxury minimalist layering.";
  };

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-500 ${isOpen ? "visible" : "invisible pointer-events-none"}`}>
      {/* Backdrop blur overlay */}
      <div 
        onClick={onClose}
        className={`absolute inset-0 bg-neutral-950/40 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`} 
      />

      {/* Slide-out side-sheet drawer (from right) */}
      <div 
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-neutral-950 border-l border-neutral-900 shadow-2xl p-8 flex flex-col justify-between transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Top Header */}
        <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
          <span className="text-[9px] font-mono tracking-[0.18em] text-neutral-500 uppercase">
            PRODUCT_DETAIL_MANIFEST
          </span>
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
            aria-label="Close details"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content - Editorial Layout */}
        <div className="flex-1 overflow-y-auto py-8 space-y-8">
          {/* Visual Silhouette Fallback Box */}
          <div className="relative aspect-[4/5] bg-neutral-900/40 border border-neutral-900 rounded-sm flex items-center justify-center overflow-hidden">
            {/* Image 8 style gold overlay or glass distortion filter */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-lime-500/5 z-0" />
            <ProductSilhouette product={product} className="w-48 h-48 opacity-45 relative z-10" />
            
            <div className="absolute bottom-4 left-4 flex gap-1.5 z-10">
              {product.style_tags.map(tag => (
                <span key={tag} className="text-[7px] font-mono uppercase bg-neutral-950 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded-[1px]">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Product Header */}
          <div className="space-y-2">
            <span className="text-[8px] font-mono text-lime-400 uppercase tracking-widest">
              {product.brand}
            </span>
            <h3 className="font-serif text-2xl font-light text-white tracking-wide leading-tight">
              {product.name}
            </h3>
            <p className="text-sm font-semibold text-neutral-200">
              ${product.price.toFixed(2)}
            </p>
          </div>

          {/* Description */}
          <p className="text-xs font-light text-neutral-400 leading-relaxed font-sans">
            {product.description}
          </p>

          {/* Specifications Magazine Layout */}
          <div className="space-y-4 pt-4 border-t border-neutral-900">
            <div>
              <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest">FABRIC COMPOSITION</span>
              <p className="text-xs font-medium text-neutral-300 mt-1">
                {getComposition(product)}
              </p>
            </div>
            <div>
              <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest">FIT PROFILE</span>
              <p className="text-xs font-light text-neutral-400 mt-1 leading-relaxed">
                {getFitDescription(product)}
              </p>
            </div>
            <div>
              <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest">AVAILABLE COLOR</span>
              <p className="text-xs font-medium text-neutral-300 mt-1">
                {product.color}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-neutral-900 pt-6">
          <Button 
            onClick={() => {
              onDrape(product);
              onClose();
            }}
            className="w-full bg-lime-500 hover:bg-lime-400 text-neutral-950 font-bold tracking-widest text-[9px] uppercase py-5 rounded-[2px] cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(132,204,22,0.15)]"
          >
            <RefreshCw size={11} className="animate-spin-slow" />
            [ DRAPE THIS ITEM ]
          </Button>
        </div>
      </div>
    </div>
  );
}
