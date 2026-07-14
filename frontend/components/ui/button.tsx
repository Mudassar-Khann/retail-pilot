import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  as?: React.ElementType;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", as: Component = "button", ...props }, ref) => {
    return (
      <Component
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          {
            // Default: Solid black button (Apple/Aesop style)
            "bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98]":
              variant === "default",
            // Secondary: Light grey button
            "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:scale-[0.98]":
              variant === "secondary",
            // Outline: Thin border button
            "border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-50 active:scale-[0.98]":
              variant === "outline",
            // Ghost: Text button with hover effect
            "hover:bg-neutral-100 text-neutral-900": variant === "ghost",
            // Link: Underlined text button
            "text-neutral-950 underline-offset-4 hover:underline bg-transparent p-0":
              variant === "link",
          },
          {
            "h-9 px-4 text-xs tracking-wider uppercase": size === "sm",
            "h-11 px-6 text-sm tracking-wide": size === "md",
            "h-13 px-8 text-base tracking-wide": size === "lg",
          },
          className
        )}
        ref={ref as any}
        {...props as any}
      />
    );
  }
);
Button.displayName = "Button";
