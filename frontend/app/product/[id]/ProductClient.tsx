"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Heart } from "lucide-react";
import { useFeatureStore } from "@/store/featureStore";
import { Scene, SceneLayer, SceneContent } from "@/design-system/scene/renderer";
import { ProductViewer } from "@/design-system/viewer";
import { MotionPrimitive, MotionChoreography } from "@/design-system/motion/engine";
import { ProductCard } from "@/components/products/ProductCard";

// The unified client component that decides between Legacy and New rendering
export function ProductClient({ product, similar_products, availability, isOffline }: any) {
  const { flags } = useFeatureStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Resolve transparent assets for the new collection (IDs 2001-2009)
  const resolvedImagePath = (product.id >= 2001 && product.id <= 2009)
    ? `/products/${product.id}.png`
    : (product.image_path || "/products/2005.png");

  if (!flags.enableSceneRenderer) {
    // Legacy Render
    return (
      <div className="min-h-screen bg-[var(--background)] pb-24">
        {/* Legacy JSX simplified for brevity, assume similar to old page */}
        <div className="max-w-7xl mx-auto p-12">
          <Link href="/">Back</Link>
          <h1 className="text-4xl mt-8">{product.name}</h1>
          <img src={resolvedImagePath} alt={product.name} className="w-1/2 mt-8 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <Scene>
      {/* Background Layer */}
      <SceneLayer depth={0} className="bg-[var(--bg-void)]" />

      {/* Main Content Layer */}
      <SceneContent className="flex flex-col min-h-screen">
        {/* Header HUD */}
        <header className="fixed top-0 inset-x-0 h-24 flex justify-between items-center px-12 z-50 pointer-events-auto mix-blend-difference text-white">
          <Link href="/" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-full">
            <MotionPrimitive intent="assemble" delay={0.1} className="min-h-11 flex items-center gap-3 cursor-pointer group">
              <ArrowLeft size={16} className="transition-transform duration-300 ease-[var(--ease-fluid)] group-hover:-translate-x-0.5" aria-hidden="true" />
              <span className="text-[10px] tracking-[0.18em] uppercase">Back to collection</span>
            </MotionPrimitive>
          </Link>
          <MotionPrimitive intent="assemble" delay={0.2}>
            <span className="text-xl font-display tracking-[0.16em] uppercase">RetailPilot</span>
          </MotionPrimitive>
          <MotionPrimitive intent="assemble" delay={0.3}>
            <button className="min-h-11 px-2 text-[10px] tracking-[0.16em] uppercase flex items-center gap-2 hover:text-[var(--accent-gold)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-full" aria-label="Open shopping bag">
              <ShoppingBag size={14} aria-hidden="true" /> Bag
            </button>
          </MotionPrimitive>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 pt-24">

          {/* Left Column: Product Viewer Abstraction */}
          <div className="relative h-[60vh] lg:h-[80vh] w-full p-6 sm:p-10 lg:p-12">
            <MotionPrimitive intent="illuminate" delay={0.4} className="w-full h-full rounded-sm overflow-hidden bg-white/[0.025] shadow-[0_32px_90px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.06]">
              <ProductViewer src={resolvedImagePath} alt={product.name} mode="2d" />
            </MotionPrimitive>

            <div className="absolute bottom-10 left-10 sm:bottom-20 sm:left-20 z-10">
              <MotionPrimitive intent="scan" delay={0.8}>
                <span className="bg-black/45 backdrop-blur-md px-4 py-2 border border-white/10 text-[10px] tracking-[0.18em] uppercase text-white rounded-full">
                  {product.category} · {product.brand}
                </span>
              </MotionPrimitive>
            </div>
          </div>

          {/* Right Column: Interaction & Data HUD */}
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12 lg:pr-32 space-y-8">
            <MotionChoreography baseDelay={0.5} staggerOffset={0.1}>
              <MotionPrimitive intent="assemble" priority="high">
                <p className="mb-4 text-[10px] tracking-[0.22em] uppercase text-[var(--accent-gold)]">
                  {product.brand}
                </p>
                <h1 className="text-4xl lg:text-6xl font-display font-light text-white leading-tight tracking-normal">
                  {product.name}
                </h1>
              </MotionPrimitive>

              <MotionPrimitive intent="assemble" priority="medium">
                <p className="text-xl text-[var(--accent-gold)]">${Number(product.price).toFixed(2)}</p>
              </MotionPrimitive>

              <MotionPrimitive intent="settle" priority="medium">
                <p className="text-sm text-neutral-400 font-light leading-relaxed max-w-lg">
                  {product.description}
                </p>
                {isOffline && (
                  <p className="mt-4 max-w-md text-xs leading-6 text-[var(--text-muted)]">
                    Live availability is temporarily unavailable. You are viewing the curated collection record.
                  </p>
                )}
              </MotionPrimitive>

              <MotionPrimitive intent="assemble" priority="medium" className="space-y-6 pt-8 border-t border-white/10">
                <div className="space-y-4">
                  <span className="text-[10px] text-neutral-500 tracking-[0.18em] uppercase">Select size</span>
                  <div className="flex gap-4">
                    {(product.size_options ?? ["S", "M", "L"]).map((s: string) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-12 h-12 px-4 flex items-center justify-center text-xs border rounded-sm ${selectedSize === s ? "border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 text-white" : "border-white/20 text-neutral-400 hover:border-white/50"} transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
                        aria-pressed={selectedSize === s}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button disabled={availability !== "In Stock"} className="flex-1 min-h-14 bg-[var(--text-primary)] text-[var(--bg-void)] text-[10px] tracking-[0.18em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:bg-[var(--bg-secondary)] disabled:text-[var(--text-muted)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                    {availability === "In Stock" ? "Add to bag" : "Out of stock"}
                  </button>
                  <button className="w-14 h-14 border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black" aria-label="Save garment">
                    <Heart size={16} aria-hidden="true" />
                  </button>
                </div>
              </MotionPrimitive>
            </MotionChoreography>
          </div>
        </div>

        {similar_products?.length > 0 && (
          <section className="px-6 sm:px-10 lg:px-12 pb-24">
            <div className="mx-auto max-w-7xl border-t border-white/10 pt-12">
              <div className="mb-8 flex items-end justify-between gap-6">
                <div>
                  <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--accent-gold)]">Selected With</p>
                  <h2 className="mt-3 text-2xl font-display font-light text-white">Pieces in the same edit</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similar_products.slice(0, 4).map((item: any) => (
                  <ProductCard key={item.id ?? item.product_id} product={item} />
                ))}
              </div>
            </div>
          </section>
        )}
      </SceneContent>
    </Scene>
  );
}
