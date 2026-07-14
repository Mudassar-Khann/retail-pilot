"use client";

import React, { memo } from "react";
import { GlassSurface } from "@/components/ui/glass-surface";

interface SystemFeedPanelProps {
  recommendation: any;
}

interface ColourSwatchesProps {
  colours: string[];
}

const getColorHex = (colorName: string): string => {
  const map: Record<string, string> = {
    charcoal: "#1A1A1A",
    ecru: "#EBE6DD",
    sage: "#5A6255",
    champagne: "#C5A880",
    gold: "#C5A880",
    black: "#0A0A0A",
    white: "#F5F5F5",
    grey: "#7F7F7F",
    beige: "#D4C5B9",
    olive: "#3E423A",
    navy: "#1A2530",
    brown: "#4E3629"
  };
  return map[colorName.toLowerCase().trim()] || "#7F7F7F";
};

export const ColourSwatches = memo(function ColourSwatches({ colours }: ColourSwatchesProps) {
  if (!colours || colours.length === 0) return null;

  return (
    <div className="flex items-center gap-3 pt-1.5 pb-0.5">
      {colours.map((colour, idx) => {
        const hex = getColorHex(colour);
        return (
          <div key={idx} className="group relative flex items-center justify-center">
            <div
              className="w-4 h-4 rounded-full border border-white/10 shadow-inner cursor-pointer hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: hex }}
              title={colour}
            />
            <span className="absolute -bottom-5 text-[6px] font-mono tracking-widest text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 uppercase whitespace-nowrap">
              {colour}
            </span>
          </div>
        );
      })}
    </div>
  );
});

export const SystemFeedPanel = memo(function SystemFeedPanel({ recommendation }: SystemFeedPanelProps) {
  if (!recommendation) return null;

  const colorsString = recommendation.color;
  const colours = colorsString
    ? colorsString.split(",").map((c: string) => c.trim()).filter(Boolean)
    : [];

  if (colours.length === 0) return null;

  return (
    <GlassSurface variant="smooth" className="p-4 rounded-[3px] border border-white/5 bg-black/35 shadow-xl pointer-events-auto">
      <div className="flex flex-col gap-3">
        <span className="text-[8px] font-mono tracking-[0.25em] text-[var(--text-muted)] uppercase">
          Available Colours
        </span>

        <ColourSwatches colours={colours} />
      </div>
    </GlassSurface>
  );
});
