"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface StyleScoreResult {
  compatibility_score: number;
  alignment_rating: string;
  critique: string;
}

interface AestheticScoreProps {
  score: StyleScoreResult;
  isLoading: boolean;
}

const GAUGE_RADIUS = 34;
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;

export default function AestheticScore({ score, isLoading }: AestheticScoreProps) {
  const [isCritiqueOpen, setIsCritiqueOpen] = useState(false);

  const strokeDashoffset = useMemo(() => {
    const clampedScore = Math.max(0, Math.min(100, score.compatibility_score));
    return GAUGE_CIRCUMFERENCE - (clampedScore / 100) * GAUGE_CIRCUMFERENCE;
  }, [score.compatibility_score]);

  return (
    <div data-testid="aesthetic-score" className="relative overflow-visible rounded-[20px] border border-[var(--accent-gold)]/25 bg-[linear-gradient(180deg,rgba(22,22,24,0.72),rgba(8,8,10,0.82))] px-4 py-3 backdrop-blur-xl shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
      <div className="flex items-center gap-4">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <svg viewBox="0 0 94 94" className="h-20 w-20 -rotate-90 overflow-visible">
            {/* Outer ring: absolute-positioned dotted line rotating slowly */}
            <circle
              cx="47"
              cy="47"
              r={GAUGE_RADIUS + 5}
              fill="none"
              stroke="var(--accent-gold)"
              strokeWidth="0.8"
              strokeDasharray="2 3"
              style={{
                animation: "spin 40s linear infinite",
                transformOrigin: "47px 47px",
              }}
            />
            {/* Middle (percentage) ring: animated with spring transition */}
            <motion.circle
              cx="47"
              cy="47"
              r={GAUGE_RADIUS}
              fill="none"
              stroke="var(--accent-gold)"
              strokeWidth="1.6"
              strokeLinecap="round"
              initial={{ strokeDashoffset: GAUGE_CIRCUMFERENCE }}
              animate={{ strokeDashoffset: strokeDashoffset }}
              transition={{ type: "spring", stiffness: 60, damping: 15 }}
              style={{ strokeDasharray: GAUGE_CIRCUMFERENCE }}
            />
            {/* Inner ring: ultra-fine vector background */}
            <circle
              cx="47"
              cy="47"
              r={GAUGE_RADIUS - 5}
              fill="none"
              stroke="rgba(197,168,128,0.18)"
              strokeWidth="0.6"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isLoading ? (
              <div data-testid="aesthetic-score-loader" className="text-center text-[8px] font-mono uppercase tracking-[0.22em] text-[#E8DEC9]/75 animate-pulse">
                [ ANALYZING
                <br />
                SYNERGY... ]
              </div>
            ) : (
              <>
                <span className="text-[7px] font-mono uppercase tracking-[0.26em] text-[#E8DEC9]/55">Match</span>
                <span data-testid="aesthetic-score-value" className="text-lg font-mono text-[#F4EFE6]">{score.compatibility_score}%</span>
              </>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between pr-1">
            <p className="text-[7px] font-mono uppercase tracking-[0.3em] text-[var(--accent-gold)]/75">Aesthetic Alignment</p>
            <span className="text-[6px] font-mono tracking-[0.15em] text-[var(--accent-gold)]/40 uppercase hidden sm:inline">
              [ SEC: 3.0 // MATCH_STAT ]
            </span>
          </div>
          <p data-testid="aesthetic-score-rating" className="mt-1 text-[10px] uppercase tracking-[0.28em] text-[#F4EFE6]">
            {isLoading ? "Calibrating Editorial Read" : score.alignment_rating}
          </p>
          <button
            type="button"
            data-testid="aesthetic-score-critique-toggle"
            onClick={() => setIsCritiqueOpen((open) => !open)}
            onMouseEnter={() => setIsCritiqueOpen(true)}
            onMouseLeave={() => setIsCritiqueOpen(false)}
            className="mt-3 inline-flex items-center border border-[var(--accent-gold)]/30 bg-[var(--foreground)]/5 px-2.5 py-1 text-[7px] font-mono uppercase tracking-[0.24em] text-[#E8DEC9]/80 transition-colors duration-500 hover:border-[var(--accent-gold)]/55 hover:text-[#F8F3EB]"
          >
            [ View Critique ]
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isCritiqueOpen && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setIsCritiqueOpen(true)}
            onMouseLeave={() => setIsCritiqueOpen(false)}
            data-testid="aesthetic-score-critique"
            className="absolute inset-x-3 bottom-[calc(100%+12px)] z-50 rounded-[18px] border border-[var(--foreground)]/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08))] p-3 text-[10px] leading-relaxed text-[#F2ECE2] shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-2xl"
          >
            {score.critique}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
