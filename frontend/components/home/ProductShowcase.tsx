"use client";

import React, { memo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MotionPrimitive, MotionChoreography } from "@/design-system/motion/engine";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  price: number;
  image_path: string;
  brand: string;
  collection: string;
  description: string;
  specs: { label: string; value: string }[];
}

const FEATURED_PRODUCT: Product = {
  id: 2006,
  name: "Heritage Embroidered Tunic",
  price: 350.00,
  image_path: "/products/2006.png",
  brand: "Quiet Luxury Essentials",
  collection: "FW26 HERITAGE COLLECTION",
  description: "A meticulously crafted tunic featuring signature neckline embroidery and a premium relaxed linen drape. Designed as an effortless staple for modern wardrobing.",
  specs: [
    { label: "Material", value: "100% Extrafine Linen" },
    { label: "Fit", value: "Relaxed Silhouette" },
    { label: "Origin", value: "Made in Portugal" }
  ]
};

const SUPPORTING_PRODUCTS = [
  {
    id: 2005,
    name: "Patched Heritage Bomber",
    price: 490.00,
    image_path: "/products/2005.png",
    brand: "Sartorial Slouch"
  },
  {
    id: 2001,
    name: "Tapestry Hunter Shawl Knit",
    price: 580.00,
    image_path: "/products/2001.png",
    brand: "Ralph Lauren Vintage"
  },
  {
    id: 2002,
    name: "Seamed Eyelet Heavy Hoodie",
    price: 320.00,
    image_path: "/products/2002.png",
    brand: "Diznew"
  },
  {
    id: 2003,
    name: "Sunburst Ribbed Jumper",
    price: 280.00,
    image_path: "/products/2003.png",
    brand: "System Tech"
  },
  {
    id: 2004,
    name: "Paneled Corduroy Wide Trousers",
    price: 240.00,
    image_path: "/products/2004.png",
    brand: "Sartorial Slouch"
  },
  {
    id: 2008,
    name: "Floral Tapestry Corduroy Jacket",
    price: 460.00,
    image_path: "/products/2008.png",
    brand: "Pikol"
  },
  {
    id: 2009,
    name: "Pixel Tapestry Combat Sweatshirt",
    price: 290.00,
    image_path: "/products/2009.png",
    brand: "System Tech"
  }
];

export const ProductShowcase = memo(function ProductShowcase() {
  return (
    <section className="py-32 bg-[var(--bg-void)] relative overflow-hidden select-none">
      {/* Seamless transition ambient glow */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-transparent to-[var(--bg-void)] pointer-events-none" />

      {/* Editorial volumetric ambient lighting (representing gold dust / lighting atmosphere) */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--accent-gold)]/[0.03] blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-[var(--accent-gold)]/[0.02] blur-[120px] pointer-events-none animate-[pulse_8s_infinite]" />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--accent-gold)]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--text-primary)]/5 blur-[120px] pointer-events-none" />

      {/* Editorial atmospheric particles (low-opacity gold dust) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15%" cy="20%" r="1" fill="#C5A880" className="animate-[pulse_4s_infinite_1s]" />
          <circle cx="85%" cy="30%" r="1.5" fill="#C5A880" className="animate-[pulse_6s_infinite_3s]" />
          <circle cx="45%" cy="70%" r="1.2" fill="#C5A880" className="animate-[pulse_5s_infinite_2s]" />
          <circle cx="25%" cy="60%" r="0.8" fill="#C5A880" className="animate-[pulse_3s_infinite]" />
          <circle cx="75%" cy="80%" r="1" fill="#C5A880" className="animate-[pulse_7s_infinite_4s]" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-16 space-y-32 relative z-10">

        {/* 1. Featured Product Section (2-Column Editorial Spread) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">

          {/* Left Column: Image (Floating, Transparent, 7 Cols) */}
          <div className="lg:col-span-7 flex justify-center items-center relative aspect-[4/5] bg-[var(--bg-secondary)]/50 rounded-sm p-4">
            <img
              src={FEATURED_PRODUCT.image_path}
              alt={FEATURED_PRODUCT.name}
              className="max-h-[580px] object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.65)] hover:scale-[1.02] transition-transform duration-[1200ms] ease-out z-10"
            />
          </div>

          {/* Right Column: Copy & Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-8 z-10">
            <MotionChoreography baseDelay={0.2} staggerOffset={0.15}>
              <MotionPrimitive intent="scan" priority="low" className="space-y-2">
                <span className="text-[9px] font-mono tracking-[0.25em] text-[var(--accent-gold)] uppercase block">
                  {FEATURED_PRODUCT.brand} // {FEATURED_PRODUCT.collection}
                </span>
                <h3 className="font-display font-light text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[var(--text-primary)] leading-[1.1] uppercase">
                  {FEATURED_PRODUCT.name}
                </h3>
              </MotionPrimitive>

              <MotionPrimitive intent="settle" priority="medium" className="pt-2">
                <p className="text-xs font-sans font-light text-[var(--text-secondary)] leading-[1.8] max-w-md tracking-wide">
                  {FEATURED_PRODUCT.description}
                </p>
              </MotionPrimitive>

              {/* Specification table */}
              <MotionPrimitive intent="inspect" priority="medium" className="pt-4 max-w-md">
                {FEATURED_PRODUCT.specs.map((spec, idx) => (
                  <div key={idx} className="flex justify-between items-baseline py-2.5 font-mono text-[9px] tracking-widest text-[var(--text-secondary)] border-b border-[var(--border-soft)]/40">
                    <span className="font-light uppercase">{spec.label}</span>
                    <span className="text-[var(--text-primary)] font-light uppercase">{spec.value}</span>
                  </div>
                ))}
              </MotionPrimitive>

              {/* Action button */}
              <MotionPrimitive intent="inspect" priority="high" className="pt-6">
                <Link href={`/product/${FEATURED_PRODUCT.id}`}>
                  <Button as="div" size="md" className="group rounded-[2px] bg-[var(--text-primary)] text-[var(--bg-void)] font-sans font-medium tracking-[0.2em] text-[10px] uppercase hover:opacity-90 transition-all px-6 py-3 cursor-pointer inline-flex items-center">
                    Discover Garment
                    <ArrowRight size={12} strokeWidth={2} className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </MotionPrimitive>
            </MotionChoreography>
          </div>
        </div>

        {/* 2. Supporting Products (Curated Coordinates Row) */}
        <div className="space-y-12 pt-16 border-t border-[var(--border-soft)]/60">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[9px] font-mono tracking-[0.25em] text-[var(--text-muted)] uppercase block">
                Curation Coordinates
              </span>
              <h4 className="font-display font-light text-2xl tracking-wide text-[var(--text-primary)] uppercase">
                The Editorial Collection
              </h4>
            </div>
            <p className="text-[10px] font-mono text-[var(--text-secondary)] tracking-widest uppercase">
              Curated Silhouette Coordinates
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-x-8 gap-y-12">
            {SUPPORTING_PRODUCTS.map((prod) => (
              <Link key={prod.id} href={`/product/${prod.id}`}>
                <div className="group flex flex-col gap-4 bg-transparent border-0 cursor-pointer transition-all duration-500 ease-out hover:-translate-y-1.5">
                  {/* Floating product image container */}
                  <div className="aspect-[3/4] flex items-center justify-center relative bg-transparent overflow-visible">
                    <img
                      src={prod.image_path}
                      alt={prod.name}
                      className="max-h-[160px] object-contain scale-[0.96] group-hover:scale-[1.01] transition-all duration-500 ease-out drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)] group-hover:drop-shadow-[0_16px_28px_rgba(0,0,0,0.55)]"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-col gap-1 px-1">
                    <span className="text-[7px] font-mono tracking-[0.25em] text-[var(--accent-gold)] uppercase">
                      {prod.brand}
                    </span>
                    <h5 className="text-[9px] font-sans font-light text-[var(--text-primary)] tracking-wide uppercase line-clamp-1 group-hover:text-[var(--accent-gold)] transition-colors">
                      {prod.name}
                    </h5>
                    <span className="text-[8px] font-mono text-[var(--text-secondary)] font-light mt-0.5">
                      ${prod.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
});
