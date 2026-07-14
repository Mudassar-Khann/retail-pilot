import React from "react";
import { cn } from "@/lib/utils";

interface LightingProps {
  type?: "ambient" | "spotlight" | "volumetric";
  color?: "gold" | "cyan" | "neon" | "white";
  intensity?: "low" | "medium" | "high";
  className?: string;
}

export function SceneLighting({ type = "ambient", color = "gold", intensity = "medium", className }: LightingProps) {
  // Map our physical properties to CSS filters and gradients
  const colorMap = {
    gold: "rgba(197, 168, 128, var(--alpha))",
    cyan: "rgba(14, 165, 233, var(--alpha))",
    neon: "rgba(16, 185, 129, var(--alpha))",
    white: "rgba(255, 255, 255, var(--alpha))",
  };

  const alphaMap = {
    low: "0.1",
    medium: "0.25",
    high: "0.4"
  };

  const cssColor = colorMap[color].replace("var(--alpha)", alphaMap[intensity]);

  if (type === "ambient") {
    return (
      <div
        className={cn("absolute inset-0 pointer-events-none mix-blend-screen", className)}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${cssColor} 0%, transparent 60%)`,
          filter: "blur(80px)"
        }}
      />
    );
  }

  if (type === "volumetric") {
    return (
      <div
        className={cn("absolute inset-0 pointer-events-none mix-blend-color-dodge animate-ambient", className)}
        style={{
          background: `radial-gradient(ellipse at center top, ${cssColor} 0%, transparent 70%)`,
          filter: "blur(120px)"
        }}
      />
    );
  }

  return null;
}
