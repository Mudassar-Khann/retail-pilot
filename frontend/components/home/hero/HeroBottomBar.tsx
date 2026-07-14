"use client";

import React, { memo, useEffect, useState } from "react";
import Link from "next/link";
import { MotionPrimitive } from "@/design-system/motion/engine";

export const HeroBottomBar = memo(function HeroBottomBar() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchThumbs = async () => {
      console.log("HeroBottomBar: fetchThumbs started");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);

      try {
        const res = await fetch("http://localhost:8000/api/products", { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error("API Offline");
        const data = await res.json();
        if (data.products && data.products.length >= 5) {
          console.log("HeroBottomBar: fetched products from backend:", data.products.length);
          setProducts(data.products.slice(0, 5));
        } else {
          throw new Error("Not enough products");
        }
      } catch (e) {
        clearTimeout(timeoutId);
        const err = e as any;
        console.log("HeroBottomBar: fetch failed, using fallback products", err.name === "AbortError" ? "timeout" : err.message || err);
        setProducts([
          { id: 2005, image_path: "/products/2005.png" },
          { id: 2001, image_path: "/products/2001.png" },
          { id: 2002, image_path: "/products/2002.png" },
          { id: 2003, image_path: "/products/2003.png" },
          { id: 2004, image_path: "/products/2004.png" }
        ]);
      }
    };
    fetchThumbs();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 pt-4 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">

      {/* Left label */}
      <MotionPrimitive intent="scan" className="flex flex-col items-center md:items-start text-center md:text-left gap-1 pointer-events-auto">
        <span className="text-[7px] font-mono text-[var(--accent-gold)] tracking-[0.25em] uppercase font-bold">New Collection</span>
        <span className="text-sm font-display font-light text-white tracking-widest uppercase">Orbital Edit</span>
        <span className="text-[7.5px] font-mono text-white/30 tracking-wider">SPRING / SUMMER 2025</span>
      </MotionPrimitive>

      {/* Center carousel */}
      <MotionPrimitive intent="inspect" className="flex items-center gap-3 py-1 pointer-events-auto">
        {products.map((item, idx) => (
          <Link href={`/product/${item.id || item.product_id}`} key={item.id || item.product_id}>
            <div className="w-12 h-14 rounded-md border border-white/5 bg-white/5 hover:border-[var(--accent-gold)]/40 overflow-hidden relative group/thumb transition-all duration-300 hover:scale-[1.06] shadow-md cursor-pointer">
              <img
                src={item.image_path || item.thumbnail}
                alt={`Product thumbnail ${idx + 1}`}
                className="w-full h-full object-cover filter brightness-90 group-hover/thumb:brightness-100 transition-all duration-500"
                onError={(e) => {
                  e.currentTarget.src = "/assets/models/male_base.png";
                }}
              />
              <div className="absolute inset-0 bg-black/10 group-hover/thumb:bg-transparent transition-colors" />
            </div>
          </Link>
        ))}
      </MotionPrimitive>

      {/* Right details */}
      <MotionPrimitive intent="settle" className="flex items-center gap-8 justify-between w-full md:w-auto pointer-events-auto">
        <Link href="#categories" className="flex items-center gap-3 group/disc">
          <div className="relative w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover/disc:border-[var(--accent-gold)]/30 transition-all duration-300">
            <span className="w-1 h-1 rounded-full bg-[var(--accent-gold)]" />
            <div className="absolute inset-1 border border-dashed border-[var(--accent-gold)]/30 rounded-full animate-[spin_120s_linear_infinite]" />
          </div>
          <div className="font-mono text-left">
            <p className="text-[7.5px] font-bold text-white tracking-[0.2em] uppercase">Discover More</p>
            <p className="text-[6px] text-white/30 tracking-wider">EXPLORE ALL COATS</p>
          </div>
        </Link>

        <div className="hidden lg:block border-l border-white/5 pl-8 text-left space-y-0.5">
          <p className="font-display font-light text-[10px] text-white tracking-[0.4em] uppercase">AURAA</p>
          <p className="text-[6.5px] font-mono text-white/40 max-w-[130px] leading-normal uppercase">
            Where data meets design. Where AI understands you.
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 select-none">
          <span className="font-mono text-[7px] text-white/30 tracking-[0.25em] uppercase">Scroll To Explore</span>
          <div className="w-24 h-[1.5px] bg-white/5 rounded-full overflow-hidden relative">
            <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-[var(--accent-gold)]/40" />
          </div>
        </div>
      </MotionPrimitive>

    </div>
  );
});
