"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { OutfitSelection } from "./OutfitState";
import { GarmentOverlayArt } from "./garmentArt";
import AestheticScore, { StyleScoreResult } from "./AestheticScore";

interface VirtualModelProps {
  selection: OutfitSelection;
  activeSlot: string | null;
  gender: 'male' | 'female';
  onGenderChange: (gender: 'male' | 'female') => void;
  onStyleScoreChange?: (score: StyleScoreResult) => void;
}

interface StyleScoreRequestPayload {
  top_id: number | null;
  bottom_id: number | null;
  outerwear_id: number | null;
  shoes_id: number | null;
  gender: "male" | "female";
}

const INCOMPLETE_SCORE: StyleScoreResult = {
  compatibility_score: 0,
  alignment_rating: "Incomplete Ensemble",
  critique: "Drape an additional coordinates layer to evaluate alignment.",
};

export default function VirtualModel({ selection, activeSlot, gender, onGenderChange, onStyleScoreChange }: VirtualModelProps) {
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [telemetryText, setTelemetryText] = useState("MESH_OK");
  const [styleScore, setStyleScore] = useState<StyleScoreResult>(INCOMPLETE_SCORE);
  const [isScoring, setIsScoring] = useState(false);

  // Garment drape calibration effect on change
  useEffect(() => {
    setIsCalibrating(true);
    setTelemetryText("CALIBRATING_DRAPE...");
    const t1 = setTimeout(() => {
      setTelemetryText("DRAPE_CALIBRATION_OK");
    }, 500);
    const t2 = setTimeout(() => {
      setIsCalibrating(false);
      setTelemetryText("MESH_OK");
    }, 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [selection.top, selection.outerwear, selection.bottom, selection.shoes, gender]);

  // Style scoring now evaluates full 4-slot ensemble
  useEffect(() => {
    const controller = new AbortController();
    const payload: StyleScoreRequestPayload = {
      top_id: selection.top?.id ?? null,
      bottom_id: selection.bottom?.id ?? null,
      outerwear_id: selection.outerwear?.id ?? null,
      shoes_id: selection.shoes?.id ?? null,
      gender,
    };

    const timer = window.setTimeout(async () => {
      setIsScoring(true);
      try {
        const response = await fetch("http://localhost:8000/api/style/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Style scoring failed with ${response.status}`);
        }

        const data: StyleScoreResult = await response.json();
        if (!controller.signal.aborted) {
          setStyleScore(data);
          if (onStyleScoreChange) onStyleScoreChange(data);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.warn("Style compatibility scoring unavailable. Using incomplete state.", error);
          setStyleScore(INCOMPLETE_SCORE);
          if (onStyleScoreChange) onStyleScoreChange(INCOMPLETE_SCORE);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsScoring(false);
        }
      }
    }, 400);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [selection.bottom?.id, selection.top?.id, selection.outerwear?.id, selection.shoes?.id, gender]);

  // Elegant fabric drape transition with custom bezier curve
  const layerTransition = {
    duration: 0.65,
    ease: [0.16, 1, 0.3, 1] as const
  };

  return (
    <div className="relative w-full max-w-[340px] aspect-[9/16] border border-[var(--border-soft)] bg-[var(--background)] overflow-hidden flex flex-col justify-between p-5 rounded-lg shadow-2xl" style={{ containIntrinsicSize: '340px 604px', contentVisibility: 'auto' }}>
      {/* LAYER 0: Neon Accent Background (asymmetric neon_accent.png) */}
      <img 
        src="/assets/backgrounds/neon_accent.png" 
        alt="" 
        className="absolute top-0 right-[-20%] h-full w-auto opacity-20 pointer-events-none mix-blend-screen z-0"
      />

      {/* LAYER 1: Base Mannequin Body (male_base.png or female_base.png) */}
      <img 
        src={gender === 'male' ? '/assets/models/male_base.png' : '/assets/models/female_base.png'} 
        alt={`${gender} model`} 
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-80"
      />

      {/* Gallery Header Label */}
      <div className="flex justify-between items-center w-full text-[9px] font-semibold tracking-[0.18em] text-[var(--text-muted)] uppercase z-10">
        <span>MODEL: VIRTUAL_TRYON</span>
        <span className="flex items-center gap-1.5 font-light">
          {isCalibrating ? "CALIBRATING..." : "STABLE"}
        </span>
      </div>

      {/* LAYER 2: Garment Overlays Container */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* BOTTOMS */}
        <AnimatePresence mode="popLayout">
          {selection.bottom && (
            <motion.div
              key={`bottom-${selection.bottom.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={layerTransition}
              className="absolute inset-0 z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] will-change-transform pointer-events-none"
            >
              <GarmentOverlayArt product={selection.bottom} slot="bottom" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOPS */}
        <AnimatePresence mode="popLayout">
          {selection.top && (
            <motion.div
              key={`top-${selection.top.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={layerTransition}
              className="absolute inset-0 z-20 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] will-change-transform pointer-events-none"
            >
              <GarmentOverlayArt product={selection.top} slot="top" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* OUTERWEAR */}
        <AnimatePresence mode="popLayout">
          {selection.outerwear && (
            <motion.div
              key={`outer-${selection.outerwear.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={layerTransition}
              className="absolute inset-0 z-25 drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] will-change-transform pointer-events-none"
            >
              <GarmentOverlayArt product={selection.outerwear} slot="outerwear" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* SHOES */}
        <AnimatePresence mode="popLayout">
          {selection.shoes && (
            <motion.div
              key={`shoes-${selection.shoes.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={layerTransition}
              className="absolute inset-0 z-15 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] will-change-transform pointer-events-none"
            >
              <GarmentOverlayArt product={selection.shoes} slot="shoes" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* LAYER 3: Overlay Diagnostics (mesh_flow.png) & Refractive Glass Caustics */}
      <AnimatePresence>
        {isCalibrating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[var(--background)]/40 z-30 flex flex-col justify-between p-6 pointer-events-none glass-fluted-heavy overflow-hidden"
          >
            {/* Shimmering Golden Caustics layer */}
            <div className="absolute inset-0 caustics-layer z-10 opacity-75" />

            <img 
              src="/assets/backgrounds/mesh_flow.png" 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover opacity-15 animate-pulse z-0"
            />
            <div className="flex justify-between items-center w-full text-[8px] font-mono tracking-widest text-[var(--text-secondary)] uppercase z-40 relative">
              <span className="bg-[var(--background)]/85 px-1.5 py-0.5 rounded-[1px] border border-[var(--border-soft)]/40">DRAPE_RENDER_CORE</span>
              <span className="text-lime-400 bg-[var(--background)]/85 px-1.5 py-0.5 rounded-[1px] border border-[var(--border-soft)]/40">{telemetryText}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-x-4 bottom-14 z-40">
        <AestheticScore score={styleScore} isLoading={isScoring} />
      </div>

      {/* Model Gender controls at the bottom */}
      <div className="flex justify-center gap-3 z-40 border-t border-[var(--accent-gold)]/18 pt-4">
        <button 
          onClick={() => onGenderChange('male')}
          className={`px-3.5 py-1.5 text-[8px] font-mono tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer ${
            gender === 'male' 
              ? 'bg-[var(--accent-gold)] text-[var(--background)] font-bold border border-[var(--accent-gold-hover)]' 
              : 'bg-[var(--bg-secondary)]/90 text-[var(--text-secondary)] border border-[var(--accent-gold)]/18 hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)]/40'
          }`}
        >
          [ MODEL: MALE ]
        </button>
        <button 
          onClick={() => onGenderChange('female')}
          className={`px-3.5 py-1.5 text-[8px] font-mono tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer ${
            gender === 'female' 
              ? 'bg-[var(--accent-gold)] text-[var(--background)] font-bold border border-[var(--accent-gold-hover)]' 
              : 'bg-[var(--bg-secondary)]/90 text-[var(--text-secondary)] border border-[var(--accent-gold)]/18 hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)]/40'
          }`}
        >
          [ MODEL: FEMALE ]
        </button>
      </div>
    </div>
  );
}
