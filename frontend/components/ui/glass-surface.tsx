import React from "react";
import { cn } from "@/lib/utils";

interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "fluted" | "heavy" | "smooth";
  children: React.ReactNode;
}

export function GlassSurface({ variant = "smooth", className, children, ...props }: GlassSurfaceProps) {
  const variantClasses = {
    "fluted": "glass-fluted",
    "heavy": "glass-fluted-heavy",
    "smooth": "bg-[var(--bg-glass)] backdrop-blur-xl border border-[var(--border-glass)]",
  };

  return (
    <div className={cn(variantClasses[variant], className)} {...props}>
      {children}
    </div>
  );
}
