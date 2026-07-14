"use client";

import React, { memo } from "react";
import { GlassSurface } from "@/components/ui/glass-surface";

interface StyleAnalysisPanelProps {
  searchQuery: string;
  status: "idle" | "loading" | "error" | "offline";
  recommendation: any;
}

interface SpecificationRowProps {
  label: string;
  value?: string;
}

const SpecificationRow = memo(function SpecificationRow({ label, value }: SpecificationRowProps) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-baseline font-mono text-[9px] tracking-widest text-[var(--text-secondary)] border-b border-white/[0.03] pb-1.5 last:border-b-0 last:pb-0">
      <span className="font-light uppercase">{label}</span>
      <span className="text-[var(--text-primary)] font-light uppercase">{value}</span>
    </div>
  );
});

export const StyleAnalysisPanel = memo(function StyleAnalysisPanel({
  recommendation
}: StyleAnalysisPanelProps) {
  if (!recommendation) return null;

  return (
    <GlassSurface variant="smooth" className="p-4 rounded-[3px] border border-white/5 bg-black/35 shadow-xl pointer-events-auto">
      <div className="flex flex-col gap-3">
        <span className="text-[8px] font-mono tracking-[0.25em] text-[var(--accent-gold)] uppercase">
          Product Specifications
        </span>

        <div className="flex flex-col gap-2.5 pt-1">
          <SpecificationRow label="Collection" value={recommendation.brand || recommendation.short_metadata} />
          <SpecificationRow label="Season" value={recommendation.season} />
          <SpecificationRow label="Fit" value={recommendation.fit} />
          <SpecificationRow label="Material" value={recommendation.material} />
          <SpecificationRow label="Origin" value={recommendation.origin} />
        </div>
      </div>
    </GlassSurface>
  );
});
