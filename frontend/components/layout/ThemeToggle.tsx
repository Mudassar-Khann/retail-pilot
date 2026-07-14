"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { MotionPrimitive, MotionPresence } from "@/design-system/motion/engine";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        className="relative w-9 h-9 rounded-full flex items-center justify-center
                   text-[var(--text-muted)] cursor-default"
        aria-label="Toggle theme"
      >
        <div className="w-4 h-4 rounded-full bg-[var(--border-soft)]" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-9 h-9 rounded-full flex items-center justify-center
                 text-[var(--text-secondary)] hover:text-[var(--accent-gold)]
                 transition-colors duration-300 cursor-pointer
                 hover:bg-[var(--bg-secondary)] focus:outline-none focus-visible:ring-2
                 focus-visible:ring-[var(--accent-gold)]/40"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <MotionPresence mode="wait" initial={false}>
        {isDark ? (
          <MotionPrimitive
            key="moon"
            intent="none"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <Moon className="w-[18px] h-[18px]" />
          </MotionPrimitive>
        ) : (
          <MotionPrimitive
            key="sun"
            intent="none"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <Sun className="w-[18px] h-[18px]" />
          </MotionPrimitive>
        )}
      </MotionPresence>
    </button>
  );
}
