"use client";

import { useState } from "react";
import { AestheticType } from "../home/VirtualCharacterConfigurator";

interface PortalCard {
  id: AestheticType;
  title: string;
  subtitle: string;
  glowColor: string; // active border halo style
  gradient: string;  // background design
}

interface AestheticPortalsProps {
  activeAesthetic: AestheticType;
  onSelectAesthetic: (aesthetic: AestheticType) => void;
}

const PORTALS: PortalCard[] = [
  {
    id: "luxury",
    title: "SILENT LUXURY",
    subtitle: "QUIET ELEGANCE & CASHMERE",
    glowColor: "shadow-[0_0_20px_rgba(197,168,128,0.25)] border-[#C5A880]/60",
    gradient: "from-amber-950/20 via-[var(--bg-secondary)]/60 to-amber-900/20"
  },
  {
    id: "streetwear",
    title: "STREETWEAR DRIFT",
    subtitle: "MISTY VOLCANIC SILHOUETTES",
    glowColor: "shadow-[0_0_20px_rgba(220,38,38,0.2)] border-red-500/60",
    gradient: "from-red-950/20 via-[var(--bg-secondary)]/60 to-stone-900/30"
  },
  {
    id: "techwear",
    title: "TECHNICAL APPAREL",
    subtitle: "REFRACTIVE WEATHERPROOF SHIELDS",
    glowColor: "shadow-[0_0_20px_rgba(6,182,212,0.2)] border-cyan-500/60",
    gradient: "from-cyan-950/20 via-[var(--bg-secondary)]/60 to-emerald-950/20"
  }
];

export default function AestheticPortals({ activeAesthetic, onSelectAesthetic }: AestheticPortalsProps) {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-mono tracking-[0.25em] text-[var(--accent-gold)] uppercase">
          STYLE CURATIONS
        </span>
        {activeAesthetic !== "all" && (
          <button
            onClick={() => onSelectAesthetic(activeAesthetic)}
            className="text-[8px] font-mono text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors uppercase tracking-widest cursor-pointer"
          >
            [ Reset Filter ]
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PORTALS.map((portal) => {
          const isActive = activeAesthetic === portal.id;

          return (
            <div
              key={portal.id}
              onClick={() => onSelectAesthetic(portal.id)}
              className={`group relative h-24 rounded-md overflow-hidden border cursor-pointer transition-all duration-500 flex flex-col justify-end p-4 bg-gradient-to-br ${portal.gradient} ${
                isActive
                  ? portal.glowColor
                  : "border-[var(--border-soft)]/80 hover:border-[var(--text-muted)]/80 shadow-sm"
              }`}
            >
              {/* Refractive background lines */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:10px_100%] pointer-events-none select-none" />

              {/* Zooming dark-tinted overlay on hover */}
              <div
                className="absolute inset-0 bg-[var(--background)]/60 group-hover:bg-[var(--background)]/50 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 group-hover:scale-105 pointer-events-none"
              />

              <div className="relative z-10 space-y-0.5 pointer-events-none select-none">
                <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#F4EFE6] uppercase">
                  [ {portal.title} ]
                </p>
                <p className="text-[7px] font-mono tracking-wider text-[var(--text-secondary)]">
                  {portal.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
