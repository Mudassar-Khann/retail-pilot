"use client";

import { motion, AnimatePresence } from "framer-motion";
import { OutfitSelection } from "./OutfitState";

interface VirtualModelProps {
  selection: OutfitSelection;
  activeSlot: string | null;
}

const COLOR_MAP: Record<string, string> = {
  "Black": "#18181b",
  "Matte Black": "#0f0f11",
  "White": "#fafafa",
  "Navy": "#172554",
  "Camel": "#b45309",
  "Cream": "#fafaf9",
  "Oatmeal": "#e7e5e4",
  "Charcoal": "#27272a",
  "Indigo": "#1e1b4b",
  "Olive": "#3f4238",
  "Olive Drab": "#2d3027",
  "Beige": "#e4e4e7",
  "Silver": "#cbd5e1",
  "Light Blue": "#bae6fd",
  "Sage Green": "#d1fae5",
  "Tan": "#78350f",
  "Grey": "#71717a",
  "Grey/White": "#a1a1aa",
  "Ecru": "#f5f5f4"
};

export default function VirtualModel({ selection, activeSlot }: VirtualModelProps) {
  const getHexColor = (colorName?: string) => {
    if (!colorName) return "#e4e4e7";
    return COLOR_MAP[colorName] || "#e4e4e7";
  };

  // Luxury spring transition
  const layerTransition = {
    type: "spring" as const,
    stiffness: 250,
    damping: 24,
    mass: 1.0
  };

  return (
    <div className="relative w-full max-w-[340px] aspect-[2/3] border border-neutral-200/80 bg-neutral-50/40 overflow-hidden flex flex-col justify-between p-6 rounded-md shadow-sm">
      {/* Subtle vertical alignment guide line */}
      <div className="absolute inset-y-0 left-1/2 w-[0.5px] bg-neutral-200/50 pointer-events-none" />

      {/* Gallery Figure Label */}
      <div className="flex justify-between items-center w-full text-[9px] font-semibold tracking-[0.18em] text-neutral-400 uppercase z-10">
        <span>FIGURE 01 / MODEL</span>
        <span className="flex items-center gap-1.5 font-light">
          {activeSlot ? `RECONFIGURING: ${activeSlot}` : "STABLE FIT"}
        </span>
      </div>

      {/* Model Canvas */}
      <div className="relative w-full flex-1 flex justify-center items-center py-4">
        <svg
          viewBox="0 0 320 480"
          className="w-full h-full max-h-[380px] drop-shadow-[0_4px_16px_rgba(0,0,0,0.01)]"
          style={{ overflow: "visible" }}
        >
          {/* BASE MANNEQUIN BODY */}
          <g className="text-neutral-300" stroke="currentColor" strokeWidth="1" fill="none">
            {/* Elegant backdrop guide circle */}
            <circle cx="160" cy="240" r="140" className="stroke-neutral-100" strokeWidth="0.5" />

            {/* Head */}
            <ellipse cx="160" cy="50" rx="16" ry="22" className="fill-neutral-50 stroke-neutral-200" />
            {/* Neck */}
            <path d="M155 71 L155 86 L165 86 L165 71 Z" className="fill-neutral-50 stroke-neutral-200" />
            {/* Torso outline */}
            <path d="M125 94 L195 94 L176 180 L144 180 Z" className="fill-neutral-50 stroke-neutral-200" />
            {/* Shoulders joint */}
            <circle cx="123" cy="95" r="3" className="fill-neutral-50 stroke-neutral-200" />
            <circle cx="197" cy="95" r="3" className="fill-neutral-50 stroke-neutral-200" />
            {/* Arms */}
            <path d="M121 98 L110 180 L104 240" className="stroke-neutral-200" />
            <path d="M199 98 L210 180 L216 240" className="stroke-neutral-200" />
            {/* Hips & Legs */}
            <path d="M144 180 L138 300 L132 420" className="stroke-neutral-200" />
            <path d="M176 180 L182 300 L188 420" className="stroke-neutral-200" />
          </g>

          {/* LAYER 1: BOTTOM (Pants/Jeans) */}
          <AnimatePresence mode="popLayout">
            {selection.bottom && (
              <motion.g
                key={`bottom-${selection.bottom.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={layerTransition}
              >
                <path
                  d="M141 180 L179 180 L191 300 L193 418 L177 418 L160 250 L143 418 L127 418 L129 300 Z"
                  fill={getHexColor(selection.bottom.color)}
                  stroke="#333"
                  strokeWidth="1.2"
                />
                {selection.bottom.category === "Cargo Pants" && (
                  <>
                    <rect x="123" y="250" width="8" height="12" rx="1" fill={getHexColor(selection.bottom.color)} stroke="#444" strokeWidth="0.8" />
                    <rect x="189" y="250" width="8" height="12" rx="1" fill={getHexColor(selection.bottom.color)} stroke="#444" strokeWidth="0.8" />
                  </>
                )}
                {selection.bottom.category === "Jeans" && (
                  <path d="M160 185 L160 248" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
                )}
              </motion.g>
            )}
          </AnimatePresence>

          {/* LAYER 2: TOP (T-Shirt/Shirt) */}
          <AnimatePresence mode="popLayout">
            {selection.top && (
              <motion.g
                key={`top-${selection.top.id}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={layerTransition}
              >
                {selection.top.category.includes("Shirt") ? (
                  <path
                    d="M142 76 L178 76 L195 94 L212 170 L204 172 L193 114 L177 195 L143 195 L127 114 L116 172 L108 170 L125 94 Z"
                    fill={getHexColor(selection.top.color)}
                    stroke="#222"
                    strokeWidth="1.2"
                  />
                ) : (
                  <path
                    d="M142 78 L178 78 L195 94 L204 135 L196 138 L192 110 L177 195 L143 195 L128 110 L124 138 L116 135 L125 94 Z"
                    fill={getHexColor(selection.top.color)}
                    stroke="#222"
                    strokeWidth="1.2"
                  />
                )}
                {(selection.top.category === "Shirts" || selection.top.name.includes("Polo")) && (
                  <path d="M142 78 L160 88 L178 78 L160 96 Z" fill="#fff" fillOpacity={0.08} stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
                )}
              </motion.g>
            )}
          </AnimatePresence>

          {/* LAYER 3: OUTERWEAR (Jacket/Coat/Hoodie) */}
          <AnimatePresence mode="popLayout">
            {selection.outerwear && (
              <motion.g
                key={`outer-${selection.outerwear.id}`}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={layerTransition}
              >
                <path
                  d="M140 76 Q160 92 180 76 L200 92 L215 180 L206 182 L196 112 L180 205 L140 205 L124 112 L114 182 L105 180 L120 92 Z"
                  fill={getHexColor(selection.outerwear.color)}
                  stroke="#111"
                  strokeWidth="1.2"
                />
                {selection.outerwear.name.includes("Puffer") && (
                  <path
                    d="M126 130 L194 130 M128 150 L192 150 M130 170 L190 170"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1.2"
                  />
                )}
                {selection.outerwear.name.includes("Coat") && (
                  <path
                    d="M140 205 L140 310 L180 310 L180 205 Z"
                    fill={getHexColor(selection.outerwear.color)}
                    stroke="#111"
                    strokeWidth="1.2"
                  />
                )}
              </motion.g>
            )}
          </AnimatePresence>

          {/* LAYER 4: SHOES */}
          <AnimatePresence mode="popLayout">
            {selection.shoes && (
              <motion.g
                key={`shoes-${selection.shoes.id}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={layerTransition}
              >
                <path
                  d="M124 418 L134 418 L137 435 L120 435 Q115 425 124 418"
                  fill={getHexColor(selection.shoes.color)}
                  stroke="#222"
                  strokeWidth="1.2"
                />
                <path
                  d="M186 418 L196 418 Q205 425 200 435 L183 435 L186 418"
                  fill={getHexColor(selection.shoes.color)}
                  stroke="#222"
                  strokeWidth="1.2"
                />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* Model Details Footer */}
      <div className="flex justify-between items-end border-t border-neutral-200/80 pt-4 text-neutral-500 z-10">
        <div className="space-y-0.5">
          <p className="text-[8px] text-neutral-400 uppercase tracking-widest font-mono">Composition Fit</p>
          <p className="text-xs font-serif font-light text-neutral-800 tracking-wide">
            {selection.top?.style_tags[0] || selection.bottom?.style_tags[0] || "Neutral"} Style
          </p>
        </div>
        <div className="text-right space-y-0.5">
          <p className="text-[8px] text-neutral-400 uppercase tracking-widest font-mono">Silhouette</p>
          <p className="text-[10px] font-mono text-neutral-700 tracking-wider uppercase font-semibold">Active</p>
        </div>
      </div>
    </div>
  );
}
