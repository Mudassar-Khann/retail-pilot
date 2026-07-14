import React from "react";
import { cn } from "@/lib/utils";

interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "heavy" | "solid";
  children: React.ReactNode;
}

export function GlassSurface({ variant = "light", className, children, ...props }: GlassSurfaceProps) {
  const baseStyles = "backdrop-blur-md border border-[var(--border-soft)] shadow-xl";

  const variantStyles = {
    light: "bg-[var(--background)]/40",
    heavy: "bg-[var(--bg-void)]/80 border-white/10",
    solid: "bg-[var(--bg-secondary)] border-transparent"
  };

  return (
    <div className={cn(baseStyles, variantStyles[variant], className)} {...props}>
      {children}
    </div>
  );
}
