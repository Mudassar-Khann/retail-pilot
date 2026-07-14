import React from "react";
import { cn } from "@/lib/utils";

interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  layer?: "void" | "0" | "1" | "elevated" | "overlay";
  children: React.ReactNode;
}

export function Surface({ layer = "0", className, children, ...props }: SurfaceProps) {
  const layerClasses = {
    "void": "bg-[var(--bg-void)] text-[var(--text-primary)]",
    "0": "bg-[var(--bg-surface-0)] text-[var(--text-primary)]",
    "1": "bg-[var(--bg-surface-1)] text-[var(--text-primary)]",
    "elevated": "bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-lg",
    "overlay": "bg-[var(--bg-overlay)] text-[var(--text-primary)] backdrop-blur-md",
  };

  return (
    <div className={cn(layerClasses[layer], className)} {...props}>
      {children}
    </div>
  );
}
