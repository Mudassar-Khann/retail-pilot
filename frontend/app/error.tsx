"use client";

import { useEffect } from "react";
import { GlassSurface } from "@/components/ui/glass-surface";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[var(--bg-void)]">
      <GlassSurface variant="smooth" className="p-8 max-w-lg text-center flex flex-col gap-6">
        <div className="space-y-2">
          <h2 className="text-xl font-mono text-[var(--accent-gold)] tracking-[0.2em] uppercase">Service Interrupted</h2>
          <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed">
            Our virtual assistant encountered an unexpected error. Please refresh or try again.
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="border border-[var(--border-glass)] bg-white/5 hover:bg-white/10 text-white transition-colors duration-300 font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-md mx-auto block"
        >
          [ Reload Assistant ]
        </button>
      </GlassSurface>
    </div>
  );
}
