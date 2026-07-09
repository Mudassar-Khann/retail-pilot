import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-[10px] font-medium tracking-wider uppercase transition-colors duration-300",
        {
          "bg-neutral-900 text-white": variant === "default",
          "bg-neutral-100 text-neutral-800": variant === "secondary",
          "border border-neutral-200 text-neutral-600 bg-transparent":
            variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}
