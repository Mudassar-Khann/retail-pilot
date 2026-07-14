import React from "react";
import { cn } from "@/lib/utils";

interface SceneProps {
  className?: string;
  children: React.ReactNode;
}

interface LayerProps {
  className?: string;
  depth?: number;
  children?: React.ReactNode;
}

/**
 * SceneRenderer encapsulates the visual layering of a page.
 * It enforces the Composition Grammar: Scene -> Layers -> Content.
 */
export function Scene({ className, children }: SceneProps) {
  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden bg-[var(--bg-void)]", className)}>
      {children}
    </div>
  );
}

/**
 * SceneLayer places content at a specific depth (z-index) to compose the environment.
 * Backgrounds, particles, lighting, and the primary content all sit in layers.
 */
export function SceneLayer({ depth = 0, className, children }: LayerProps) {
  return (
    <div
      className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}
      style={{ zIndex: depth }}
    >
      {children}
    </div>
  );
}

/**
 * SceneContent is the primary interactive layer.
 */
export function SceneContent({ className, children }: LayerProps) {
  return (
    <div className={cn("relative w-full h-full z-10 pointer-events-auto", className)}>
      {children}
    </div>
  );
}
