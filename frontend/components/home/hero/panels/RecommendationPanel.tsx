"use client";

import React, { memo } from "react";
import Link from "next/link";
import { GlassSurface } from "@/components/ui/glass-surface";

interface RecommendationItem {
  id: number;
  name: string;
  price: number;
  image_path: string;
  brand?: string;
  category?: string;
  season?: string;
  color?: string;
  description?: string;
  material?: string;
  fit?: string;
  origin?: string;
}

interface RecommendationPanelProps {
  recommendation: RecommendationItem | null;
}

const ACTION_TEXT = "VIEW PIECE";

export const RecommendationPanel = memo(function RecommendationPanel({
  recommendation
}: RecommendationPanelProps) {
  if (!recommendation) return null;

  return (
    <GlassSurface variant="smooth" className="p-4 rounded-[3px] border border-white/5 bg-black/35 shadow-xl pointer-events-auto group/card">
      <div className="flex flex-col gap-4">
        {/* Editorial Floating Frame */}
        <div className="w-full aspect-[4/5] rounded-[1px] overflow-hidden bg-black/10 relative flex items-center justify-center p-4">
          <img
            src={recommendation.image_path}
            alt={recommendation.name}
            className="max-h-full max-w-full object-contain group-hover/card:scale-105 transition-transform duration-[1200ms] ease-out drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/products/2005.png";
            }}
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-1.5 px-0.5">
          <div className="flex justify-between items-baseline">
            <span className="text-[8px] font-mono tracking-[0.2em] text-[var(--accent-gold)] uppercase">
              {recommendation.brand || "AURAA ARCHIVE"}
            </span>
            <span className="text-[8px] font-mono text-[var(--text-secondary)] font-light">
              ${recommendation.price ? Number(recommendation.price).toFixed(2) : "540.00"}
            </span>
          </div>

          <h4 className="text-[11px] font-sans font-light text-[var(--text-primary)] tracking-[0.05em] uppercase leading-tight">
            {recommendation.name}
          </h4>

          <div className="pt-2">
            <Link href={`/product/${recommendation.id}`}>
              <span className="inline-flex items-center text-[8px] font-mono tracking-[0.25em] text-[var(--text-primary)] uppercase hover:text-[var(--accent-gold)] transition-colors cursor-pointer border-b border-white/25 pb-0.5">
                {ACTION_TEXT}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </GlassSurface>
  );
});
