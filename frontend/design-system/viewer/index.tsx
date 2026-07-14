"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { MotionPrimitive } from "../motion/engine";

export type ViewerMode = "2d" | "360" | "3d" | "ar";

interface ProductViewerProps {
  src: string;
  alt: string;
  mode?: ViewerMode;
  className?: string;
}

/**
 * ProductViewer Abstraction.
 * Currently falls back to 2D image rendering, but provides the exact architectural
 * boundaries needed to hot-swap WebGL/Three.js or AR capabilities later.
 */
export function ProductViewer({ src, alt, mode = "2d", className }: ProductViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Future integration points:
  if (mode === "3d") {
    return (
      <div className={cn("flex items-center justify-center bg-black/10 font-mono text-xs text-[var(--text-secondary)]", className)}>
        [WebGL 3D Context Placeholder]
      </div>
    );
  }

  if (mode === "ar") {
    return (
      <div className={cn("flex items-center justify-center bg-black/10 font-mono text-xs text-[var(--text-secondary)]", className)}>
        [WebXR AR Context Placeholder]
      </div>
    );
  }

  // 2D & 360 Fallback (standard image with Motion hooks)
  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <MotionPrimitive
        intent="illuminate"
        className="w-full h-full"
      >
        <img
          src={src}
          alt={alt}
          className={cn("w-full h-full object-cover transition-all duration-1000", isLoaded ? "opacity-100" : "opacity-0 scale-95 blur-sm")}
          onLoad={() => setIsLoaded(true)}
        />
      </MotionPrimitive>
    </div>
  );
}
