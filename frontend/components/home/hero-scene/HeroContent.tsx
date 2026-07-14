"use client";

import React, { memo } from "react";
import { Sparkles } from "lucide-react";
import { MotionPrimitive, MotionChoreography } from "@/design-system/motion/engine";

export const HeroContent = memo(function HeroContent() {
  return (
    <div className="space-y-6">
      <MotionChoreography baseDelay={0.15} staggerOffset={0.12}>
        <MotionPrimitive intent="scan" priority="low">
          <div className="inline-flex items-center gap-2">
            <Sparkles size={10} className="text-[var(--accent-gold)]" />
            <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-[var(--text-secondary)]">
              Aesthetic Wardrobe Hub
            </span>
          </div>
        </MotionPrimitive>

        <MotionPrimitive intent="assemble" priority="high" className="pt-2">
          <h1 className="font-display font-light text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[var(--text-primary)] leading-[1.1]">
            Define your aesthetic. <br />
            <span className="font-normal italic text-[var(--accent-gold)]">Dress intelligent.</span>
          </h1>
        </MotionPrimitive>

        <MotionPrimitive intent="settle" priority="medium">
          <p className="text-xs font-sans font-light text-[var(--text-secondary)] leading-[1.8] max-w-[24rem] tracking-wide mt-4">
            RetailPilot merges clean fashion design with conversational intelligence. Describe your style, explore curated lookbooks, and visualize outfits on a virtual mannequin.
          </p>
        </MotionPrimitive>
      </MotionChoreography>
    </div>
  );
});
