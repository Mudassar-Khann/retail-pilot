"use client";

import React, { memo } from "react";

export const Atmosphere = memo(function Atmosphere() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      {/* Subtle caustics or ambient glows can go here if needed.
          Currently relying on SceneLighting and ParticleEngine for dynamic atmosphere. */}
      <div className="absolute top-0 left-1/4 w-[50%] h-[30%] bg-[var(--accent-gold)]/5 blur-[120px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-0 right-1/4 w-[40%] h-[40%] bg-[var(--accent-cyan)]/5 blur-[100px] rounded-full mix-blend-screen" />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at center, transparent 30%, var(--bg-void) 100%)" }}
      />
      {/* Contrast Overlay */}
      <div className="absolute inset-0 bg-[var(--bg-overlay)] opacity-40 mix-blend-multiply dark:mix-blend-normal" />
    </div>
  );
});
