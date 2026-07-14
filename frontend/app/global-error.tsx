"use client";

import { GlassSurface } from "@/components/ui/glass-surface";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <title>Error - RetailPilot</title>
      </head>
      <body>
        <div className="flex h-screen w-full items-center justify-center bg-black text-white">
          <GlassSurface variant="smooth" className="p-8 max-w-lg text-center flex flex-col gap-6 bg-black/50">
            <div className="space-y-2">
              <h2 className="text-xl font-mono text-[var(--accent-gold)] tracking-[0.2em] uppercase">Service Interrupted</h2>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                We encountered an unexpected error. Please refresh or try again.
              </p>
            </div>
            <button
              onClick={() => reset()}
              className="border border-white/20 hover:bg-white/10 text-white transition-colors duration-300 font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-md mx-auto block"
            >
              [ Reload Assistant ]
            </button>
          </GlassSurface>
        </div>
      </body>
    </html>
  );
}
