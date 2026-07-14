"use client";

import React, { memo } from "react";
import { GlassSurface } from "@/components/ui/glass-surface";

interface StatusPanelProps {
  status: "idle" | "loading" | "error" | "offline";
}

export const StatusPanel = memo(function StatusPanel({ status }: StatusPanelProps) {
  return (
    <div className="relative p-6 max-w-sm pointer-events-auto">
      {/* Tech Corner Marks */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/30" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/30" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/30" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/30" />

      <div className="grid grid-cols-2 gap-4 text-[8px] font-mono tracking-widest text-[var(--text-secondary)]">
        <div className="space-y-3">
          <div>
            <p className="text-[6px] text-[var(--text-muted)] uppercase">Assistant Status</p>
            <p className={status === "loading" ? "text-amber-500 dark:text-amber-400 font-semibold flex items-center gap-1.5 mt-0.5" : "text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5"}>
              <span className={`w-1 h-1 rounded-full ${status === "loading" ? "bg-amber-500 dark:bg-amber-400" : "bg-emerald-600 dark:bg-emerald-400"}`} />
              {status === "loading" ? "COMPUTING" : "ONLINE"}
            </p>
          </div>
          <div>
            <p className="text-[6px] text-[var(--text-muted)] uppercase">Curation</p>
            <p className="text-[var(--text-primary)] font-bold mt-0.5">2.4M PIECES</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-[6px] text-[var(--text-muted)] uppercase">Version</p>
            <p className="text-[var(--text-primary)] font-bold mt-0.5">AURAA GEN 2.1</p>
          </div>
          <div>
            <p className="text-[6px] text-[var(--text-muted)] uppercase">User Trust</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[var(--accent-gold)] font-bold">98.7%</p>
              <div className="flex-1 h-0.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--accent-gold)]" style={{ width: "98.7%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
