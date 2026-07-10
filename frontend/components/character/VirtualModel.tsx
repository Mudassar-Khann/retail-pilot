"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
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

// Generative Wave-like Particle Flow Field Mesh (inspired by first reference image)
function ParticleMeshCanvas({ isSpeedup }: { isSpeedup: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Adjust for high-DPI displays
        const rect = entry.contentRect;
        width = canvas.width = rect.width;
        height = canvas.height = rect.height;
      }
    });
    resizeObserver.observe(canvas);

    // Generate particle field nodes
    const particleCount = 38;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseY: number;
      angle: number;
      speed: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const baseY = Math.random() * height;
      particles.push({
        x,
        y: baseY,
        vx: (Math.random() * 0.3 + 0.1) * (Math.random() < 0.5 ? -1 : 1),
        vy: (Math.random() * 0.2 + 0.1) * (Math.random() < 0.5 ? -1 : 1),
        baseY,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.01 + 0.004,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const speedMultiplier = isSpeedup ? 3.5 : 1.0;
      
      // Update nodes positions along a wave path
      particles.forEach((p) => {
        p.x += p.vx * speedMultiplier;
        p.angle += p.speed * speedMultiplier;
        p.y = p.baseY + Math.sin(p.angle) * 15;

        // Loop screen edge boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
      });

      // Draw thin connected mesh lines (generative wire network)
      ctx.strokeStyle = isSpeedup ? "rgba(204, 255, 0, 0.12)" : "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 85) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw tiny node dots
      particles.forEach((p) => {
        ctx.fillStyle = isSpeedup 
          ? "rgba(204, 255, 0, 0.4)" 
          : "rgba(255, 255, 255, 0.2)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [isSpeedup]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-70" />;
}


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

      {/* Volumetric Wave Particle Canvas (inspired by first reference image) */}
      <ParticleMeshCanvas isSpeedup={isCalibrating} />

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
              className="absolute inset-0 z-10 neon-garment-glow will-change-transform pointer-events-none"
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
              className="absolute inset-0 z-20 neon-garment-glow will-change-transform pointer-events-none"
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
              className="absolute inset-0 z-25 neon-garment-glow will-change-transform pointer-events-none"
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
              className="absolute inset-0 z-15 neon-garment-glow will-change-transform pointer-events-none"
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
