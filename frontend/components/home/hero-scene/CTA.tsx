"use client";

import React, { memo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MotionPrimitive, MotionChoreography } from "@/design-system/motion/engine";
import { Button } from "@/components/ui/button";

export const CTA = memo(function CTA() {
  return (
    <MotionChoreography baseDelay={0.3} staggerOffset={0.1}>
      <MotionPrimitive intent="inspect" priority="high" className="flex flex-wrap gap-4 pt-6">
        <Link href="#search">
          <Button as="div" size="md" className="group rounded-[2px] bg-white text-black font-sans font-medium tracking-[0.2em] text-[10px] sm:text-[11px] uppercase hover:bg-neutral-200 transition-colors px-6 py-3 cursor-pointer">
            Discover Styles
            <ArrowRight size={12} strokeWidth={2} className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </Link>
        <Link href="#products">
          <Button as="div" variant="outline" size="md" className="group rounded-[2px] bg-transparent border border-white/25 text-white font-sans font-medium tracking-[0.2em] text-[10px] sm:text-[11px] uppercase hover:bg-white/5 hover:border-white/55 px-6 py-3 transition-colors cursor-pointer">
            Curated Selection
          </Button>
        </Link>
      </MotionPrimitive>
    </MotionChoreography>
  );
});
