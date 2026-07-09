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
  "White": "#f5f5f5",
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
    if (!colorName) return "#d4d4d8";
    return COLOR_MAP[colorName] || "#d4d4d8";
  };

  // Spring transition for smooth physical motion
  const layerTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 25
  };

  return (
    <div className="relative w-full max-w-[340px] aspect-[2/3] border border-neutral-100 bg-neutral-950/95 overflow-hidden flex flex-col justify-between p-6 shadow-2xl rounded-sm">
      {/* Background cyber grid effect (computational elegance reference) */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      <div className="absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />

      {/* Viewport UI header */}
      <div className="flex justify-between items-center w-full text-[9px] font-mono tracking-widest text-neutral-500 uppercase z-10">
        <span>RENDER: LAYERED_SVG</span>
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${activeSlot ? 'animate-ping' : ''}`} />
          AESTHETIC OK
        </span>
      </div>

      {/* Model Canvas */}
      <div className="relative w-full flex-1 flex justify-center items-center py-4">
        <svg
          viewBox="0 0 320 480"
          className="w-full h-full max-h-[380px] drop-shadow-[0_0_15px_rgba(255,255,255,0.03)]"
          style={{ overflow: "visible" }}
        >
          {/* BASE MANNEQUIN BODY */}
          <g className="text-neutral-800" stroke="currentColor" strokeWidth="1" fill="none">
            {/* Aura glow ring */}
            <circle cx="160" cy="240" r="160" className="stroke-white/[0.02]" strokeWidth="0.5" />

            {/* Head */}
            <ellipse cx="160" cy="50" rx="18" ry="24" className="fill-neutral-900/60 stroke-neutral-700/60" />
            {/* Neck */}
            <path d="M154 74 L154 88 L166 88 L166 74 Z" className="fill-neutral-950 stroke-neutral-800" />
            {/* Torso outline */}
            <path d="M125 94 L195 94 L176 180 L144 180 Z" className="fill-neutral-950 stroke-neutral-800" />
            {/* Shoulders joint */}
            <circle cx="123" cy="95" r="4" className="fill-neutral-900 stroke-neutral-800" />
            <circle cx="197" cy="95" r="4" className="fill-neutral-900 stroke-neutral-800" />
            {/* Arms */}
            <path d="M121 98 L110 180 L104 240" className="stroke-neutral-800/80" />
            <path d="M199 98 L210 180 L216 240" className="stroke-neutral-800/80" />
            {/* Hips & Legs */}
            <path d="M144 180 L138 300 L132 420" className="stroke-neutral-800/80" />
            <path d="M176 180 L182 300 L188 420" className="stroke-neutral-800/80" />
          </g>

          {/* LAYER 1: BOTTOM (Pants/Jeans) */}
          <AnimatePresence mode="popLayout">
            {selection.bottom && (
              <motion.g
                key={`bottom-${selection.bottom.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={layerTransition}
              >
                {/* Pants path wrapping waist to ankles */}
                <path
                  d="M141 180 L179 180 L191 300 L193 418 L177 418 L160 250 L143 418 L127 418 L129 300 Z"
                  fill={getHexColor(selection.bottom.color)}
                  stroke="#333"
                  strokeWidth="1.5"
                  style={{ mixBlendMode: "multiply" as any }}
                />
                {/* Cargo pockets detail */}
                {selection.bottom.category === "Cargo Pants" && (
                  <>
                    <rect x="123" y="250" width="8" height="12" rx="1" fill={getHexColor(selection.bottom.color)} stroke="#444" strokeWidth="1" />
                    <rect x="189" y="250" width="8" height="12" rx="1" fill={getHexColor(selection.bottom.color)} stroke="#444" strokeWidth="1" />
                  </>
                )}
                {/* Jeans seam lines */}
                {selection.bottom.category === "Jeans" && (
                  <path d="M160 185 L160 248 M140 200 L150 215 M180 200 L170 215" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                )}
              </motion.g>
            )}
          </AnimatePresence>

          {/* LAYER 2: TOP (T-Shirt/Shirt) */}
          <AnimatePresence mode="popLayout">
            {selection.top && (
              <motion.g
                key={`top-${selection.top.id}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={layerTransition}
              >
                {selection.top.category.includes("Shirt") ? (
                  // Long Sleeve Shirt / Button-down
                  <path
                    d="M142 76 L178 76 L195 94 L212 170 L204 172 L193 114 L177 195 L143 195 L127 114 L116 172 L108 170 L125 94 Z"
                    fill={getHexColor(selection.top.color)}
                    stroke="#222"
                    strokeWidth="1.5"
                  />
                ) : (
                  // Short Sleeve Tee / Polo
                  <path
                    d="M142 78 L178 78 L195 94 L204 135 L196 138 L192 110 L177 195 L143 195 L128 110 L124 138 L116 135 L125 94 Z"
                    fill={getHexColor(selection.top.color)}
                    stroke="#222"
                    strokeWidth="1.5"
                  />
                )}
                {/* Collar detail for shirt / polo */}
                {(selection.top.category === "Shirts" || selection.top.name.includes("Polo")) && (
                  <path d="M142 78 L160 88 L178 78 L160 96 Z" fill="#fff" fillOpacity={0.1} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
                )}
              </motion.g>
            )}
          </AnimatePresence>

          {/* LAYER 3: OUTERWEAR (Jacket/Coat/Hoodie) */}
          <AnimatePresence mode="popLayout">
            {selection.outerwear && (
              <motion.g
                key={`outer-${selection.outerwear.id}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={layerTransition}
              >
                {/* Slightly bulkier than top, open at chest */}
                <path
                  d="M140 76 Q160 92 180 76 L200 92 L215 180 L206 182 L196 112 L180 205 L140 205 L124 112 L114 182 L105 180 L120 92 Z"
                  fill={getHexColor(selection.outerwear.color)}
                  stroke="#111"
                  strokeWidth="1.5"
                />
                {/* Puffer lines overlay */}
                {selection.outerwear.name.includes("Puffer") && (
                  <path
                    d="M125 110 L195 110 M126 130 L194 130 M128 150 L192 150 M130 170 L190 170 M135 190 L185 190"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="1.5"
                  />
                )}
                {/* Wool coat length */}
                {selection.outerwear.name.includes("Coat") && (
                  <path
                    d="M140 205 L140 310 L180 310 L180 205 Z"
                    fill={getHexColor(selection.outerwear.color)}
                    stroke="#111"
                    strokeWidth="1.5"
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
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={layerTransition}
              >
                {/* Left Shoe */}
                <path
                  d="M124 418 L134 418 L137 435 L120 435 Q115 425 124 418"
                  fill={getHexColor(selection.shoes.color)}
                  stroke="#222"
                  strokeWidth="1.5"
                />
                {/* Right Shoe */}
                <path
                  d="M186 418 L196 418 Q205 425 200 435 L183 435 L186 418"
                  fill={getHexColor(selection.shoes.color)}
                  stroke="#222"
                  strokeWidth="1.5"
                />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* Model display metadata details footer */}
      <div className="flex justify-between items-end border-t border-white/5 pt-4 text-neutral-400 z-10">
        <div className="space-y-1">
          <p className="text-[8px] text-neutral-600 uppercase tracking-widest font-mono">Current Style Fit</p>
          <p className="text-xs font-serif font-light text-white tracking-wide">
            {selection.top?.style_tags[0] || selection.bottom?.style_tags[0] || "Neutral"}
          </p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[8px] text-neutral-600 uppercase tracking-widest font-mono">Mannequin</p>
          <p className="text-[10px] font-mono text-white tracking-wider uppercase font-semibold">Active</p>
        </div>
      </div>
    </div>
  );
}
