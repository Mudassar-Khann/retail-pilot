"use client";

import React, { useEffect, useState } from "react";
import { m } from "framer-motion";
import { Physics } from "../motion/physics";
import { cn } from "@/lib/utils";

/**
 * Global Cursor Engine.
 * Intercepts mouse movements to provide contextual feedback (hover, inspect).
 */
export function CursorEngine() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // If hovering interactive elements, expand cursor
      if (target.closest("button, a, [role='button'], .interactive")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Primary Dot */}
      <m.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: "tween", duration: 0 }}
      />

      {/* Outer Ring / Glow */}
      <m.div
        className={cn(
          "fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998] border border-white/50 mix-blend-difference flex items-center justify-center",
          isHovering ? "bg-white/10 backdrop-blur-sm" : "bg-transparent"
        )}
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={Physics.Natural}
      />
    </>
  );
}
